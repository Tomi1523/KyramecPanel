import React from 'react';
import { useRepuestos } from '../../Use/UseRepuestos';


const RepuestosList = () => {
  const { repuestos, loading, error, handleDeleteRepuesto } = useRepuestos();

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

  // Filter repuestos to only include those with the category "repuestos"
  const filteredRepuestos = repuestos.filter(repuesto => repuesto.categoria === "repuestos");

  return (
    <div className="container py-4">
      <h2 className="mb-4">Repuestos</h2>
      <div className="row">
        {filteredRepuestos.map((repuesto) => (
          <div key={repuesto.id} className="col-md-4 mb-4">
            <div className="card">
              <img
                src={repuesto.imageUrls}
                className="card-img-top"
                alt={repuesto.title}
                loading="lazy"
              />
              <div className="card-body">
                <h5 className="card-title">{repuesto.title}</h5>
                <p className="card-text">{repuesto.text}</p>
                <ul className="list-group list-group-flush">
                  {repuesto.extraFields.map((field, index) => (
                    <li key={index} className="list-group-item">{field}</li>
                  ))}
                </ul>
                <a href={repuesto.pdfUrl} className="btn btn-primary mt-3" target="_blank" rel="noopener noreferrer">Ver PDF</a>
              </div>
              <div>
                <button
                  className="btn btn-danger mt-2"
                  onClick={() => {
                    const confirmar = window.confirm("¿Estás seguro que deseas eliminar este repuesto?");
                    if (confirmar) {
                      handleDeleteRepuesto(repuesto.id);
                    }
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepuestosList;
