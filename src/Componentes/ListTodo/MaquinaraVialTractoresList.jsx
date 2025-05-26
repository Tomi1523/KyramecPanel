import React from 'react';
import { useTractores } from '../../Use/useTractores';
import { Link } from 'react-router-dom';

const MaquinaraVialTractoresList = () => {
  const { tractores, loading, error, handleDeleteTractor } = useTractores();

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

  const filteredMaquinariaVial = tractores.filter(tractor => tractor.categoria === "maquinaria-viales");

  return (
    <div className="container py-4">
      <h2 className="mb-4">Maquinaria Vial</h2>
      <div className="row">
        {filteredMaquinariaVial.map((maquinaria) => (
          <div key={maquinaria.id} className="col-md-4 mb-4">
            <div className="card">
              <img
                src={maquinaria.imageUrls}
                className="card-img-top"
                alt={maquinaria.title}
                loading="lazy"
              />
              <div className="card-body">
                <h5 className="card-title">{maquinaria.title}</h5>
                <p>{maquinaria.condicion}</p>
                <hr />
                <p className="card-text">{maquinaria.text}</p>
                <hr />
                <p className="card-text">
                  {maquinaria.precioIVA.valor} {maquinaria.precioIVA.moneda}
                </p>
                <hr />
                <ul className="list-group list-group-flush">
                  {maquinaria.extraFields.map((field, index) => (
                    <li key={index} className="list-group-item">{field}</li>
                  ))}
                </ul>
                <a href={maquinaria.pdfUrl} className="btn btn-primary mt-3" target="_blank" rel="noopener noreferrer">Ver PDF</a>
              </div>
              <div className='gap-2 d-flex justify-content-center'>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    const confirmar = window.confirm("¿Estás seguro que deseas eliminar este producto?");
                    if (confirmar) {
                      handleDeleteTractor(maquinaria.id);
                    }
                  }}
                >
                  Eliminar
                </button>
                <Link to={`/opciones/maquinariavial/${maquinaria.id}`} className="btn btn-warning">
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

export default MaquinaraVialTractoresList;
