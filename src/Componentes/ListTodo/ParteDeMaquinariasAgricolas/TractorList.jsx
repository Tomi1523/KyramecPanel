import React from 'react';
import { useTractores } from '../../../Use/useTractores';
import { Link } from 'react-router-dom';

const TractorList = () => {
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

 
const filteredTractores = tractores.filter(
  tractor => 
    tractor.categoria === "maquinaria-agricola" && 
    (tractor.subcategoria === "tractores")
);


  return (
    <div className="container py-4">
      <h2 className="mb-4">Tractores</h2>
      <div className="row">
        {filteredTractores.map((tractor) => (
          <div key={tractor.id} className="col-md-4 mb-4">
            <div className="card">
              <img
                src={tractor.imageUrls}
                className="card-img-top"
                alt={tractor.title}
                loading="lazy"
              />
              <div className="card-body">
                <h5 className="card-title">{tractor.title}</h5>
                <p className="card-text">{tractor.text}</p>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item"><strong>Finalidad:</strong> {tractor.finalidad}</li>
                  <li className="list-group-item"><strong>Condición:</strong> {tractor.condicion}</li>
                  <li className="list-group-item"><strong>Marca:</strong> {tractor.marca}</li>
                  <li className="list-group-item"><strong>Modelo:</strong> {tractor.modelo}</li>
                  <li className="list-group-item"><strong>Año de fabricación:</strong> {tractor.anoFabricacion}</li>
                  <li className="list-group-item"><strong>Línea:</strong> {tractor.linea}</li>
                  <li className="list-group-item"><strong>Potencia:</strong> {tractor.potencia}</li>
                  <li className="list-group-item"><strong>Tracción:</strong> {tractor.traccion}</li>
                  
                 <li className="list-group-item"><strong>Precio:</strong> {tractor.precioIVA.moneda} ${tractor.precioIVA.valor} </li>
                  <li className="list-group-item"><strong>Dirección:</strong> {tractor.direccion}</li>
                  <li className="list-group-item"><strong>Tipo de motor:</strong> {tractor.tipoMotor}</li>
                  <li className="list-group-item"><strong>Levante a 3 puntos:</strong> {tractor.levanteTresPuntos}</li>
                  <li className="list-group-item"><strong>Cabina:</strong> {tractor.cabina}</li>
                  <li className="list-group-item"><strong>Variante de tracción:</strong> {tractor.varianteTraccion}</li>
                  <li className="list-group-item"><strong>Tipo de rodado:</strong> {tractor.tipoRodado}</li>
                  <li className="list-group-item"><strong>Concesionario:</strong> {tractor.concesionario}</li>
                  <li className="list-group-item"><strong>Localidad:</strong> {tractor.localidad}</li>
                  <li className="list-group-item"><strong>Entrega:</strong> {tractor.entrega}</li>
                  <li className="list-group-item"><strong>Condiciones y Financiación:</strong>
                    <ul>
                      {tractor.condicionesFinanciacion?.entregaFinanciacion?.checked && (
                        <li>% Entrega + Financiación: {tractor.condicionesFinanciacion.entregaFinanciacion.valor}%</li>
                      )}
                      {tractor.condicionesFinanciacion?.cuotas?.checked && (
                        <li>Cuotas: Hasta {tractor.condicionesFinanciacion.cuotas.valor} cuotas</li>
                      )}
                      {tractor.condicionesFinanciacion?.financiacionFabrica && (
                        <li>Financiación de la Fábrica</li>
                      )}
                      {tractor.condicionesFinanciacion?.financiado?.checked && (
                        <li>Financiado en {tractor.condicionesFinanciacion.financiado.valor} años</li>
                      )}
                      {tractor.condicionesFinanciacion?.cheques?.checked && (
                        <li>Cheques: Hasta {tractor.condicionesFinanciacion.cheques.valor} cheques</li>
                      )}
                      {tractor.condicionesFinanciacion?.aceptaCanje && (
                        <li>Acepta Canje</li>
                      )}
                      {tractor.condicionesFinanciacion?.tasaDolares?.checked && (
                        <li>Tasa en dólares: {tractor.condicionesFinanciacion.tasaDolares.valor}%</li>
                      )}
                      {tractor.condicionesFinanciacion?.tasaPesos?.checked && (
                        <li>Tasa en pesos: {tractor.condicionesFinanciacion.tasaPesos.valor}%</li>
                      )}
                      {tractor.condicionesFinanciacion?.aConvenir && (
                        <li>A convenir</li>
                      )}
                      {tractor.precioIVA.valor.aConvenir && (
                        <li>A convenir</li>
                      )}
                   
                    </ul>
                  </li>
                </ul>
                <a href={tractor.pdfUrl} className="btn btn-primary mt-3" target="_blank" rel="noopener noreferrer">Ver PDF</a>

              </div>
              <div className='gap-2 d-flex justify-content-center'>
                <button
                  className="btn btn-danger "
                  onClick={() => {
                    const confirmar = window.confirm("¿Estás seguro que deseas eliminar este tractor?");
                    if (confirmar) {
                      handleDeleteTractor(tractor.id);
                    }
                  }}
                >
                  Eliminar
                </button>

                <Link to={`/opciones/maquinarias-agricolas/tractores/${tractor.id}`} className="btn btn-warning">
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

export default TractorList;
