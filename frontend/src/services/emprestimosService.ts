import { api } from './api';
import type { EmprestimoView } from '../types';
import { adaptEmprestimo } from '../utils/adapters';
import { EMPRESTIMOS_MOCK } from '../mocks/emprestimosMocks';
// Importamos o serviço de livros para fazer a validação e atualização
import { LivrosService } from './livrosService'; 

let emprestimosLocal = [...EMPRESTIMOS_MOCK];

export const EmprestimosService = {
  getAll: async (): Promise<EmprestimoView[]> => {
    try {
      const response = await api.get('/emprestimos', { timeout: 2000 });
      return response.data.map(adaptEmprestimo);
    } catch (error) {
      return emprestimosLocal.map(adaptEmprestimo);
    }
  },

  // --- CRIAR COM VALIDAÇÃO E ATUALIZAÇÃO DE STATUS ---
  create: async (novo: any): Promise<void> => {
    
    // 1. BUSCAR O LIVRO PARA VALIDAR
    const todosLivros = await LivrosService.getAll();
    // Removemos caracteres não numéricos para comparar corretamente
    const isbnLimpo = String(novo.isbn).replace(/\D/g, '');
    
    // Procura o livro comparando ISBN (convertido para string para garantir)
    const livroAlvo = todosLivros.find(l => String(l.isbn).replace(/\D/g, '') === isbnLimpo);

    if (!livroAlvo) {
        throw new Error("Livro não encontrado no acervo.");
    }

    if (!livroAlvo.disponivel) {
        throw new Error(`O livro "${livroAlvo.titulo}" já está emprestado/indisponível.`);
    }

    // 2. PREPARAR PAYLOAD DO EMPRÉSTIMO
    const payload = {
        titulo: novo.titulo,
        isbn: Number(isbnLimpo),
        cpf_emprestimo: Number(String(novo.cpf).replace(/\D/g, '')),
        data_emissao: novo.dataEmissao,
        data_devolucao: novo.dataDevolucao,
        comentario: novo.obs,
        status: "Em dia"
    };

    // 3. TENTAR CRIAR O EMPRÉSTIMO
    try {
      await api.post('/emprestimos', payload);
    } catch (error) {
      console.warn("⚠️ Backend Offline. Salvando no Mock.");
      const novoMock = { 
          _id: Math.random().toString(), 
          ...payload,
      };
      // @ts-ignore
      emprestimosLocal.push(novoMock);
    }

    // 4. ATUALIZAR O LIVRO PARA INDISPONÍVEL
    await LivrosService.update(livroAlvo.id, {
        titulo: livroAlvo.titulo,
        autor: livroAlvo.autor,
        genero: livroAlvo.genero,
        // Garantimos que ISBN e Volume sejam números para satisfazer o TypeScript
        isbn: Number(String(livroAlvo.isbn).replace(/\D/g, '')),
        // @ts-ignore (Caso volume não exista na View, passamos undefined ou 0)
        volume: livroAlvo.volume ? Number(livroAlvo.volume) : undefined,
        // @ts-ignore (Mesma coisa para editora/data se não estiverem na View padrão)
        editora: livroAlvo.editora,
        data_lancamento: undefined, // Ou mapear se tiver na view
        
        disponivel: false // <--- AQUI MUDA O STATUS
    });
  },

  update: async (id: string, dados: any): Promise<void> => {
    const payload = {
        status: dados.status,
        comentario: dados.obs, 
        data_devolucao: dados.dataDevolucao
    };

    try {
      await api.put(`/emprestimos/${id}`, payload);
    } catch (error) {
       emprestimosLocal = emprestimosLocal.map(e => {
           if (e.id === id || e._id === id) {
               return { ...e, ...payload, dataDevolucao: payload.data_devolucao || e.dataDevolucao };
           }
           return e;
       });
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/emprestimos/${id}`);
    } catch (error) {
      emprestimosLocal = emprestimosLocal.filter(e => e._id !== id && e.id !== id);
    }
  },

  getAtrasados: async (): Promise<EmprestimoView[]> => {
    try {
      const response = await api.get('/emprestimos/atrasados');
      return response.data.map(adaptEmprestimo);
    } catch (error) {
      console.warn("Backend offline, retornando mock vazio para atrasados.");
      return []; 
    }
  },
};