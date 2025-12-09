export function parseBookDate(dateStr: string | undefined): Date | null {

  if (!dateStr || dateStr === 'NA') return null;
  
  // O backend pode enviar datas no formato ISO (2023-10-25T...) ou PT-BR (25/10/2023)
  
  // Caso 1: Formato PT-BR com barras
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    const [day, month, year] = parts.map(Number);
    return new Date(year, month - 1, day);
  }

  // Caso 2: Formato ISO do Banco de Dados
  const dateObj = new Date(dateStr);
  return isNaN(dateObj.getTime()) ? null : dateObj;
}