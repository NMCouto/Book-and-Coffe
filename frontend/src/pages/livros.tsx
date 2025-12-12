import { useState, useEffect, useMemo } from 'react';
import { Trash, PencilSimple, Funnel } from 'phosphor-react';
import { TopNavigation } from '../components/ui/TopNavigation';
import { GenericTable } from '../components/ui/GenericTable';
import { GenericToolbar } from '../components/ui/GenericToolbar';
import { Pagination } from '../components/ui/Paginacao';
import { useAlert } from '../contexts/AlertContext';
import { CadastroLivro } from '../components/cadastro_livros';
import { ModalFiltrarLivro } from '../components/filtrarLivro'; // Importando seu modal existente

// Services & Types
import { LivrosService } from '../services/livrosService';
import type { LivroView, ColumnDef, AdvancedFilterState } from '../types'; // Certifique-se que AdvancedFilterState está no types ou defina aqui

import '../styles/paginasTabelas.css';
import '../styles/emprestimos.css'; 


type SimpleFilterType = 'todos' | 'disponivel' | 'indisponivel';

export function Livros() {
  const { showAlert } = useAlert();
  
  const [data, setData] = useState<LivroView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- ESTADOS DE FILTRO E MODAIS ---
  const [simpleFilter, setSimpleFilter] = useState<SimpleFilterType>('todos');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterState>({
    genres: [],
    authors: [],
    publishers: [],
    startDate: null,
    endDate: null
  });

  // --- ESTADOS DE EDIÇÃO/CRIAÇÃO ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<LivroView | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11;

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    setIsLoading(true);
    const res = await LivrosService.getAll();
    setData(res);
    setIsLoading(false);
  };

  // --- LÓGICA DE FILTRAGEM COMPLETA ---
  const filteredData = useMemo(() => {
    return data.filter(livro => {
      // 1. Busca textual (Título ou ISBN)
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        livro.titulo.toLowerCase().includes(term) || livro.autor.toLowerCase().includes(term) ||
        livro.isbn.includes(term);

      if (!matchesSearch) return false;

      // 2. Filtro Simples (Abas: Disponível/Indisponível)
      if (simpleFilter === 'disponivel' && !livro.disponivel) return false;
      if (simpleFilter === 'indisponivel' && livro.disponivel) return false;

      // 3. Filtros Avançados (Modal)
      const { genres, authors, publishers, startDate, endDate } = advancedFilters;

      // Gênero
      if (genres.length > 0) {
        const bookGenre = (livro.genero || '').toLowerCase();
        // Verifica se ALGUM (some) dos gêneros selecionados está INCLUÍDO (includes) no gênero do livro
        const hasMatch = genres.some(selectedGenre => 
            bookGenre.includes(selectedGenre.toLowerCase())
        );
        
        if (!hasMatch) return false;
      }
      
      // Autor
      if (authors.length > 0 && !authors.includes(livro.autor)) return false;
      
      // Editora (Se seu LivroView tiver editora, senão ignore ou ajuste)
      if (publishers.length > 0 && !publishers.includes((livro as any).editora || '')) return false;

      // Datas
      if (startDate || endDate) {
        // Assume que data_lancamento existe no objeto vindo do banco, mesmo que não esteja na View padrão
        const rawDate = (livro as any).data_lancamento; 
        const bookDate = rawDate ? new Date(rawDate) : null;
        
        if (!bookDate) return false;
        if (startDate && bookDate < startDate) return false;
        if (endDate && bookDate > endDate) return false;
      }

      return true;
    });
  }, [data, searchTerm, simpleFilter, advancedFilters]);

  // Paginação
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- NAVEGAÇÃO POR TECLADO ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Só navega se não tiver modal aberto
      if (!isModalOpen && !isFilterModalOpen) {
        if (e.key === 'ArrowLeft') {
            setCurrentPage(p => Math.max(1, p - 1));
        } else if (e.key === 'ArrowRight') {
            setCurrentPage(p => Math.min(totalPages, p + 1));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalPages, isModalOpen, isFilterModalOpen]);

  // --- AÇÕES CRUD ---
  const handleNew = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };

  const handleEdit = (livro: LivroView) => {
    setEditingBook(livro);
    setIsModalOpen(true);
  };

  const handleSaveLivro = async (dados: any) => {
    try {
        if (editingBook) {
            await LivrosService.update(editingBook.id, dados);
        } else {
            await LivrosService.create(dados);
        }
        await carregar();
        setIsModalOpen(false);
        setEditingBook(null);
    } catch (error) {
        console.error("Erro ao salvar livro", error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmado = await showAlert({
        title: 'Excluir Livro',
        message: 'Tem certeza que deseja excluir este livro do acervo?',
        confirmText: 'Sim',
        cancelText: 'Cancelar'
    });

    if (confirmado) {
        await LivrosService.delete(id);
        carregar();
    }
  };

  // Colunas
  const columns: ColumnDef<LivroView>[] = [
    { header: 'Título', accessor: 'titulo', className: 'text-left' },
    { header: 'Autor', accessor: 'autor', className: 'text-left' },
    { header: 'Gênero', accessor: 'genero', className: 'text-left' },
    { header: 'ISBN', accessor: 'isbn', className: 'text-left' },
    { 
        header: 'Disponível', 
        className: 'text-center',
        render: (item) => item.disponivel 
            ? <span style={{color:'var(--status-success-text)', fontWeight:'bold'}}>Sim</span> 
            : <span style={{color:'var(--status-danger-text)'}}>Não</span>
    },
    {
      header: 'Ações',
      className: 'action-cell',
      render: (item) => (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button className="icon-btn edit" title="Editar" onClick={() => handleEdit(item)}>
            <PencilSimple size={20} />
          </button>
          <button className="icon-btn delete" title="Excluir" onClick={() => handleDelete(item.id)}>
            <Trash size={20} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="page-container">
      <TopNavigation />

      <GenericToolbar 
        searchTerm={searchTerm} 
        onSearchChange={(t) => { setSearchTerm(t); setCurrentPage(1); }} 
        newItemLabel="Novo Livro" 
        onNewItem={handleNew} 
      >
        {/* BOTÕES DE FILTRO SIMPLES + BOTÃO FILTRO AVANÇADO */}
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <div className="filter-tabs-group">
                <button 
                    className={`filter-tab-btn ${simpleFilter === 'todos' ? 'active' : ''}`} 
                    onClick={() => { setSimpleFilter('todos'); setCurrentPage(1); }}
                >
                    Todos
                </button>
                <button 
                    className={`filter-tab-btn ${simpleFilter === 'disponivel' ? 'active' : ''}`} 
                    onClick={() => { setSimpleFilter('disponivel'); setCurrentPage(1); }}
                >
                    Disponíveis
                </button>
                <button 
                    className={`filter-tab-btn ${simpleFilter === 'indisponivel' ? 'active' : ''}`} 
                    onClick={() => { setSimpleFilter('indisponivel'); setCurrentPage(1); }}
                >
                    Indisponíveis
                </button>
            </div>

            {/* Botão do Filtro Avançado */}
            <button 
                className='btn-filter'
                onClick={() => setIsFilterModalOpen(true)}
                title="Filtros Avançados"
            >
                <Funnel size={20} weight={Object.values(advancedFilters).some(v => Array.isArray(v) ? v.length > 0 : v) ? "fill" : "regular"} />
            </button>
        </div>
      </GenericToolbar>

      <div className="table-container">
        <GenericTable 
            data={currentData} 
            columns={columns} 
            isLoading={isLoading} 
            itemsPerPage={itemsPerPage}
            emptyMessage="Nenhum livro encontrado."
        />
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* MODAL DE CADASTRO/EDIÇÃO */}
      <CadastroLivro
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingBook(null); }}
        onSave={handleSaveLivro}
        livroParaEditar={editingBook}
      />

      {/* MODAL DE FILTRO AVANÇADO */}
      <ModalFiltrarLivro 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        livrosTotais={data} // Passa todos os dados para contagem
        onConfirm={(filters) => {
            setAdvancedFilters(filters);
            setCurrentPage(1);
        }}
        currentFilters={advancedFilters}
      />
    </div>
  );
}