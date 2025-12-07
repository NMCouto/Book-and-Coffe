import { CaretLeft, CaretRight, CaretDoubleLeft, CaretDoubleRight } from 'phosphor-react';
import '../../styles/paginasTabelas.css'; // Importa os estilos dos botões

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Se só tem 1 página, não mostra nada
  if (totalPages <= 1) return null;

  // Lógica para gerar os números das páginas (simplificada para mostrar todas ou limitar)
  // Aqui faremos uma lógica simples: mostra até 5 páginas ao redor da atual
  const getPageNumbers = () => {
    const pages = [];
    // Ajuste aqui se quiser limitar (ex: mostrar só 1, 2, 3 ... 10)
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="pagination-footer">
      {/* Botão Primeira Página */}
      <button 
        className="page-btn" 
        onClick={() => onPageChange(1)} 
        disabled={currentPage === 1}
        title="Primeira Página"
      >
        <CaretDoubleLeft />
      </button>

      {/* Botão Anterior */}
      <button 
        className="page-btn" 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        title="Página Anterior (Seta Esquerda)"
      >
        <CaretLeft />
      </button>

      {/* Números das Páginas */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          className={`page-btn ${page === currentPage ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* Botão Próximo */}
      <button 
        className="page-btn" 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        title="Próxima Página (Seta Direita)"
      >
        <CaretRight />
      </button>

      {/* Botão Última Página */}
      <button 
        className="page-btn" 
        onClick={() => onPageChange(totalPages)} 
        disabled={currentPage === totalPages}
        title="Última Página"
      >
        <CaretDoubleRight />
      </button>
    </div>
  );
}