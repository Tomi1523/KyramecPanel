import React from 'react';
import { useImplementos } from "../../Use/UseImplementos";
import { Link } from 'react-router-dom';

const ImplementosAgricolasList = () => {
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

  const filteredImplementosAgricolas = implementos.filter(implemento => implemento.categoria === "implementos-agricolas");
  console.log(filteredImplementosAgricolas);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Implementos Agrícolas</h2>
      <div className="row">
        {filteredImplementosAgricolas.map((implemento) => (
          <div key={implemento.id} className="col-md-4 mb-4">
            <div className="card">
              <img
                src={implemento.imageUrls}
                className="card-img-top"
                alt={implemento.title}
                loading="lazy"
              />
              <div className="card-body">
                <h5 className="card-title">{implemento.title}</h5>
                <p className="card-text">{implemento.text}</p>
                <ul className="list-group list-group-flush">
                  {implemento.extraFields.map((field, index) => (
                    <li key={index} className="list-group-item">{field}</li>
                  ))}
                </ul>
                <a href={implemento.pdfUrl} className="btn btn-primary mt-3" target="_blank" rel="noopener noreferrer">Ver PDF</a>
              </div>
              <div className='gap-2 d-flex justify-content-center'>
                <button
                  className="btn btn-danger "
                  onClick={() => {
                    const confirmar = window.confirm("¿Estás seguro que deseas eliminar este producto?");
                    if (confirmar) {
                      handleDeleteImplementos(implemento.id);
                    }
                  }}
                >
                  Eliminar
                </button>
                <Link to={`/opciones/implementos-agricolas/${implemento.id}`} className="btn btn-warning">
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

export default ImplementosAgricolasList;
