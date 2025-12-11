import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ConteudoFiltroType {
  selectedMonth: number; 
  setSelectedMonth: (monthIndex: number) => void;
  monthNames: string[];
}

const ConteudoFiltro = createContext<ConteudoFiltroType | undefined>(undefined);

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Começa no mês atual
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth()); 

  return (
    <ConteudoFiltro.Provider value={{ selectedMonth, setSelectedMonth, monthNames: MONTHS }}>
      {children}
    </ConteudoFiltro.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(ConteudoFiltro);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};