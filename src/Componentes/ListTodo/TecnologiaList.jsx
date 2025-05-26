import React from 'react';
import { useImplementos } from "../../Use/UseImplementos";
import { Link } from 'react-router-dom';

const TecnologiaList = () => {
  const { implementos, loading, error, handleDeleteImplementos } = useImplementos();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <h2 className="mb-4">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

 
  const filteredTecnologiaParaElAgro = implementos.filter(implemento => implemento.categoria === "tecnologia-agro"); 
  console.log(filteredTecnologiaParaElAgro);
  
  return (
    <div className="container py-4">
      <h2 className="mb-4">Tecnología para el Agro</h2>
      <div className="row">
        {filteredTecnologiaParaElAgro.map((tecnologia) => (
          <div key={tecnologia.id} className="col-md-4 mb-4">
            <div className="card">
              <img
                src={tecnologia.imageUrls}
                className="card-img-top"
                alt={tecnologia.title}
                loading="lazy"
              />
              <div className="card-body">
                <h5 className="card-title">{tecnologia.title}</h5>
                <p className="card-text">{tecnologia.text}</p>
                <ul className="list-group list-group-flush">
                  {tecnologia.extraFields.map((field, index) => (
                    <li key={index} className="list-group-item">{field}</li>
                  ))}
                </ul>
                <a href={tecnologia.pdfUrl} className="btn btn-primary mt-3" target="_blank" rel="noopener noreferrer">Ver PDF</a>
              </div>
             <div className='gap-2 d-flex justify-content-center'>
                <button
                  className="btn btn-danger "
                  onClick={() => {
                    const confirmar = window.confirm("¿Estás seguro que deseas eliminar este producto?");
                    if (confirmar) {
                      handleDeleteImplementos(tecnologia.id);
                    }
                  }}
                >
                  Eliminar
                </button>
                  <Link to={`/opciones/tecnologia/${tecnologia.id}`} className="btn btn-warning">
                  Editar
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TecnologiaList;
