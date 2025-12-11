import React, { createContext, useState, useContext, ReactNode } from 'react';

interface FilterContextType {
  selectedMonth: number; // Mês selecionado (0 = Janeiro, 11 = Dezembro)
  setSelectedMonth: (monthIndex: number) => void;
  monthNames: string[];
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Começa no mês atual
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth()); 

  return (
    <FilterContext.Provider value={{ selectedMonth, setSelectedMonth, monthNames: MONTHS }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};