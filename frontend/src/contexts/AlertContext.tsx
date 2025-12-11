import { createContext, useContext, useState, useRef } from 'react';
import type { ReactNode } from 'react';
import '../styles/components/AlertModal.css';

// Tipos
interface AlertOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'confirm' | 'alert'; // 'alert' só tem botão OK, 'confirm' tem Sim/Não
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => Promise<boolean>;
}

const AlertContext = createContext<AlertContextType>({} as AlertContextType);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<AlertOptions>({ message: '' });
  
  // Guardamos a função 'resolve' da Promessa aqui para chamar quando o usuário clicar
  const resolveRef = useRef<(value: boolean) => void>(() => {});

  const showAlert = (newOptions: AlertOptions): Promise<boolean> => {
    setOptions({
        title: 'Alerta',
        confirmText: 'Sim',
        cancelText: 'Cancelar',
        type: 'confirm', // Padrão é confirmação
        ...newOptions
    });
    setIsOpen(true);

    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  };

  const handleConfirm = () => {
    setIsOpen(false);
    resolveRef.current(true); // Retorna TRUE
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolveRef.current(false); // Retorna FALSE
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      
      {/* --- O MODAL RENDERIZADO GLOBALMENTE --- */}
      {isOpen && (
        <div className="alert-overlay">
          <div className="alert-card">
            {options.title && <div className="alert-title">{options.title}</div>}
            
            <div className="alert-message">
              {options.message}
            </div>

            <div className="alert-actions">
              {/* Se for tipo 'confirm', mostra cancelar. Se for 'alert', esconde. */}
              {options.type === 'confirm' && (
                <button className="btn-alert btn-alert-cancel" onClick={handleCancel}>
                  {options.cancelText}
                </button>
              )}
              
              <button className="btn-alert btn-alert-confirm" onClick={handleConfirm}>
                {options.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}

export const useAlert = () => useContext(AlertContext);