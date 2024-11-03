import { useState } from 'react';
import axios from 'axios';
import './UploadForm.css';

function UploadForm() {
  const [file, setFile] = useState(null);

  function handleFileChange(event) {
    setFile(event.target.files[0]);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    
    if (!file) {
      alert("Sem arquivo selecionado!");
      return; // Retorna para não prosseguir com a requisição
    }

    const instance = axios.create({
      baseURL: 'http://localhost:3000',
      timeout: 10000,
    });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await instance.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error);
    }
  }

  return (
    <form className="container" onSubmit={handleSubmit}>
      <input type="file" required accept="image/*" onChange={handleFileChange} />
      <button type="submit">Enviar</button>
    </form>
  );
}

export default UploadForm;
