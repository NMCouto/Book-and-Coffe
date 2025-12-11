import { useState, useEffect, useMemo } from 'react';
import { MagnifyingGlass, X } from 'phosphor-react';
import { GenericTable } from '../ui/GenericTable';
import type { ColumnDef } from '../../types';
import '../../styles/paginasTabelas.css';
import '../../styles/cadastroModal.css';

interface GenericSelectionModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fetchData: () => Promise<T[]>;
  columns: ColumnDef<T>[];
  searchKeys: (keyof T)[];
}

export function GenericSelectionModal<T extends { id: string }>({ 
  isOpen, 
  onClose, 
  title, 
  fetchData, 
  columns, 
  searchKeys 
}: GenericSelectionModalProps<T>) {
  
  const [data, setData] = useState<T[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetchData().then(res => {
        setData(res);
        setIsLoading(false);
      });
    } else {
        setSearchTerm('');
    }
  }, [isOpen, fetchData]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerTerm = searchTerm.toLowerCase();
    return data.filter(item => 
      searchKeys.some(key => String(item[key]).toLowerCase().includes(lowerTerm))
    );
  }, [data, searchTerm, searchKeys]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      {/* Card maior e mais alto para seleção */}
      <div className="modal-card" style={{
          width: '800px', 
          maxWidth: '95%', 
          height: '80vh', 
          display: 'flex', 
          flexDirection: 'column',
          padding: '24px' // Padding interno consistente
      }}>
        
        {/* Cabeçalho Limpo */}
        <div className="selection-modal-header">
            <h3 className="selection-modal-title">{title}</h3>
            <button className="btn-close-modal" onClick={onClose}>
                <X size={24} weight="bold" />
            </button>
        </div>

        <div className="selection-modal-content">
            {/* Barra de Busca */}
            <div className="search-wrapper" style={{width: '100%', marginBottom: '15px'}}>
                <input 
                    className="search-input" 
                    placeholder="Digitar para buscar..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    autoFocus
                />
                <MagnifyingGlass className="search-icon" size={20}/>
            </div>

            {/* Tabela com Scroll */}
            <div className="selection-table-wrapper">
                <GenericTable 
                    data={filteredData} 
                    columns={columns} 
                    isLoading={isLoading} 
                    itemsPerPage={100} 
                />
            </div>
        </div>
      </div>
    </div>
  );
}