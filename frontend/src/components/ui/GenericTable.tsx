import '../../styles/paginasTabelas.css';
import type { ColumnDef } from '../../types';

interface GenericTableProps<T> {
  data: T[];                // Os dados da página atual
  columns: ColumnDef<T>[];  // A configuração das colunas
  isLoading: boolean;
  emptyMessage?: string;
  itemsPerPage?: number;    // Para desenhar as linhas vazias
}

// O <T extends { id: string }> garante que todo item tenha um ID para a key
export function GenericTable<T extends { id: string }>({ 
  data, 
  columns, 
  isLoading,
  emptyMessage = "Nenhum registro encontrado.",
  itemsPerPage = 10
}: GenericTableProps<T>) {

  if (isLoading) {
    return <div style={{padding: '40px', textAlign: 'center', color: '#666'}}>Carregando...</div>;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index} className={col.className}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            {columns.map((col, index) => (
              <td key={index} className={col.className}>
                {/* Se tiver função render, usa ela. Se não, mostra o texto do accessor */}
                {col.render 
                  ? col.render(item) 
                  : (col.accessor ? String(item[col.accessor]) : '')}
              </td>
            ))}
          </tr>
        ))}

        {/* Linhas vazias para manter o layout fixo */}
        {Array.from({ length: Math.max(0, itemsPerPage - data.length) }).map((_, idx) => (
             <tr key={`empty-${idx}`}><td colSpan={columns.length}>&nbsp;</td></tr>
        ))}

        {data.length === 0 && (
          <tr>
            <td colSpan={columns.length} style={{textAlign: 'center', padding: 20, color: '#666'}}>
              {emptyMessage}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}