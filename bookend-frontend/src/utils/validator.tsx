export function parseBookDate(dateStr: string | undefined): Date | null {
  // Se não tem data ou é "NA", retorna nulo
  if (!dateStr || dateStr === 'NA') return null;
  
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
}