import type { LivroDB } from '../types';

export const LIVROS_MOCK: LivroDB[] = [
  { _id: '1', titulo: 'Harry Potter e a Pedra Filosofal', autor: 'J.K. Rowling', genero: 'Fantasia', isbn: 9788532530783, editora: 'Rocco', data_lancamento: '2001-10-20', disponibilidade: 'Disponível', volume: 1 },
  { _id: '2', titulo: 'O Senhor dos Anéis: A Sociedade do Anel', autor: 'J.R.R. Tolkien', genero: 'Aventura', isbn: 9788595086357, editora: 'HarperCollins', data_lancamento: '1954-07-29', disponibilidade: 'Indisponível', volume: 1 },
  { _id: '3', titulo: 'O Iluminado', autor: 'Stephen King', genero: 'Terror', isbn: 9788532530784, editora: 'Companhia das Letras', data_lancamento: '1977-01-28', disponibilidade: 'Disponível' },
  { _id: '4', titulo: '1984', autor: 'George Orwell', genero: 'Sci-Fi', isbn: 9788535914849, editora: 'Companhia das Letras', data_lancamento: '1949-06-08', disponibilidade: 'Disponível' },
  { _id: '5', titulo: 'Dom Casmurro', autor: 'Machado de Assis', genero: 'Romance', isbn: 9788508154142, editora: 'Companhia das Letras', data_lancamento: '1899-01-01', disponibilidade: 'Disponível' },
  { _id: '6', titulo: 'O Hobbit', autor: 'J.R.R. Tolkien', genero: 'Fantasia', isbn: 9788595084742, editora: 'HarperCollins', data_lancamento: '1937-09-21', disponibilidade: 'Indisponível' },
  { _id: '7', titulo: 'Harry Potter e a Câmara Secreta', autor: 'J.K. Rowling', genero: 'Fantasia', isbn: 9788532530790, editora: 'Rocco', data_lancamento: '2002-07-02', disponibilidade: 'Disponível', volume: 2 },
  { _id: '8', titulo: 'Duna', autor: 'Frank Herbert', genero: 'Sci-Fi', isbn: 9788576573135, editora: 'Intrínseca', data_lancamento: '1965-08-01', disponibilidade: 'Disponível' },
  { _id: '9', titulo: 'O Cortiço', autor: 'Aluísio Azevedo', genero: 'História', isbn: 9788508154145, editora: 'Companhia das Letras', data_lancamento: '1890-01-01', disponibilidade: 'Disponível' },
  { _id: '10', titulo: 'Cidades de Papel', autor: 'John Green', genero: 'Romance', isbn: 9788580572261, editora: 'Intrínseca', data_lancamento: '2008-10-16', disponibilidade: 'Indisponível' },
  { _id: '11', titulo: 'Sherlock Holmes: Um Estudo em Vermelho', autor: 'Arthur Conan Doyle', genero: 'Suspense', isbn: 9788537801383, editora: 'Zahar', data_lancamento: '1887-11-01', disponibilidade: 'Disponível' },
  { _id: '12', titulo: 'It: A Coisa', autor: 'Stephen King', genero: 'Terror', isbn: 9788535914841, editora: 'Suma', data_lancamento: '1986-09-15', disponibilidade: 'Disponível' },
  { _id: '13', titulo: 'O Pequeno Príncipe', autor: 'Antoine de Saint-Exupéry', genero: 'Infantil', isbn: 9788522031382, editora: 'HarperCollins', data_lancamento: '1943-04-06', disponibilidade: 'Disponível' },
  { _id: '14', titulo: 'Neuromancer', autor: 'William Gibson', genero: 'Sci-Fi', isbn: 9788576573005, editora: 'Aleph', data_lancamento: '1984-07-01', disponibilidade: 'Indisponível' },
  { _id: '15', titulo: 'Breves Respostas para Grandes Questões', autor: 'Stephen Hawking', genero: 'Acadêmico', isbn: 9788551004128, editora: 'Intrínseca', data_lancamento: '2018-10-16', disponibilidade: 'Disponível' }
];