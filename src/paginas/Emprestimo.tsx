import React, { useState } from 'react';

interface EmprestimoForm {
  isbn: string; 
  dataInicio: string;
  dataTermino: string;
  cpf: string; 
}

const Emprestimo: React.FC = () => {
  // Inicializa o estado do formulário com strings vazias para ISBN e CPF
  const [formData, setFormData] = useState<EmprestimoForm>({
    isbn: '', 
    dataInicio: '',
    dataTermino: '',
    cpf: '',
  });

  // Manipulador genérico para atualizar o estado
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    

    // e o estado agora aceita strings para ISBN e CPF.
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manipulador para o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Lógica de validação 
    if (!formData.isbn.trim() || !formData.dataInicio || !formData.dataTermino || !formData.cpf.trim()) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    //  (Chamada de API/Backend)
    console.log("Dados de Empréstimo a serem enviados:", formData);
    alert(`Empréstimo registrado com sucesso! \nISBN: ${formData.isbn}`);

    // Limpa o formulário após a submissão
    setFormData({
      isbn: '',
      dataInicio: '',
      dataTermino: '',
      cpf: '',
    });
  };

  return (
    <div className="pagina">
      <h2 className="titulo-pagina">Registro de Empréstimo de Livro</h2>

      <form className="emprestimo-form" onSubmit={handleSubmit} aria-label="Formulário de Registro de Empréstimo">
        
        {/* Campo ISBN */}
        <div className="form-group">
          <label htmlFor="isbn">ISBN do Livro:</label>
          <input
            type="text"
            id="isbn"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            placeholder="Ex: 978-85-325-1100-7"
            aria-describedby="isbn-help" 
            required
          />

        </div>

        {/* Campo Data Início */}
        <div className="form-group">
          <label htmlFor="dataInicio">Data de Início (Empréstimo):</label>
          <input
            type="date"
            id="dataInicio"
            name="dataInicio"
            value={formData.dataInicio}
            onChange={handleChange}
            required
          />
        </div>

        {/* Campo Data Término */}
        <div className="form-group">
          <label htmlFor="dataTermino">Data de Término (Devolução Prevista):</label>
          <input
            type="date"
            id="dataTermino"
            name="dataTermino"
            value={formData.dataTermino}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* Campo CPF */}
        <div className="form-group">
          <label htmlFor="cpf">CPF do Cliente:</label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            placeholder="Ex: 123.456.789-00"
            required
          />
        </div>
        

   
        <button 
          type="submit" 
          className="submit-btn"
          title="Clique para enviar os dados e registrar o empréstimo."
        >
          Registrar Empréstimo
        </button>
      </form>
    </div>
  );
};

export default Emprestimo;