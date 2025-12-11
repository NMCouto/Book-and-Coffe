import React, { useState } from 'react';

// Tipagem do estado do formulário
interface EmprestimoForm {
  isbn: number;
  dataInicio: string;
  dataTermino: string;
  cpf: number;
}

const Emprestimo: React.FC = () => {
  // Inicializa o estado do formulário
  const [formData, setFormData] = useState<EmprestimoForm>({
    isbn: 0,
    dataInicio: '',
    dataTermino: '',
    cpf: 0,
  });

  // Manipulador genérico para atualizar o estado quando um campo muda
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manipulador para o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    //  Lógica de validação 
    if (!formData.isbn || !formData.dataInicio || !formData.dataTermino || !formData.cpf) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    //  (Chamada de API/Backend)
    console.log("Dados de Empréstimo a serem enviados:", formData);
    alert(`Empréstimo registrado com sucesso! \nISBN: ${formData.isbn}`);

    // Aqui vai ter uma chamada fetch/Axios para o  backend
    // Ex: sendEmprestimoData(formData);

    // Limpa o formulário após a submissão
    setFormData({
      isbn: 0,
      dataInicio: '',
      dataTermino: '',
      cpf: 0,
    });
  };

  return (
    <div className="pagina">
      <h2 className="titulo-pagina">Registro de Empréstimo de Livro</h2>

      <form className="emprestimo-form" onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label htmlFor="isbn">ISBN do Livro:</label>
          <input
            type="text"
            id="isbn"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            placeholder="Ex: 978-85-325-1100-7"
            required
          />
        </div>

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
                <div className="form-group">
          <label htmlFor="isbn">CPF do Cliente:</label>
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
        

        <button type="submit" className="submit-btn">Registrar Empréstimo</button>
      </form>
    </div>
  );
};

export default Emprestimo;