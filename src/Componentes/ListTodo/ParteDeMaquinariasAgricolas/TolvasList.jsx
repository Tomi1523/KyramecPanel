import React from 'react';
import { useTractores } from '../../../Use/useTractores';
import { Link } from 'react-router-dom';

const TolvasList = () => {
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

  const filteredTolvas = tractores.filter(
    tractor => tractor.categoria === "maquinaria-agricola" && tractor.subcategoria === "tolvas"
  );

  return (
    <div className="container py-4">
      <h2 className="mb-4">Tolvas</h2>
      <div className="row">
        {filteredTolvas.map((tractor) => (
          <div key={tractor.id} className="col-md-4 mb-4">
            <div className="card">
              <img
                src={tractor.imageUrls[0]}
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
                  <li className="list-group-item"><strong>Serie:</strong> {tractor.serie}</li>
                  <li className="list-group-item"><strong>Tipo de Tolva:</strong> {tractor.tipoTolva}</li>
                  <li className="list-group-item"><strong>Toneladas:</strong> {tractor.toneladas}</li>
                  <li className="list-group-item"><strong>Ejes:</strong> {tractor.ejes}</li>
                  <li className="list-group-item"><strong>Sinfín:</strong> {tractor.sinfin}</li>
                  <li className="list-group-item"><strong>Balancín:</strong> {tractor.balancin}</li>
                  <li className="list-group-item"><strong>Tiempo de descarga:</strong> {tractor.tiempoDescarga}</li>
                  <li className="list-group-item"><strong>Sistema Potencia Autónomo:</strong> {tractor.sistemaPotenciaAutonomo}</li>
                  <li className="list-group-item"><strong>Accesorios incluidos:</strong> {tractor.accesoriosIncluidos}</li>
                  <li className="list-group-item"><strong>Incluye balanza:</strong> {tractor.incluyeBalanza}</li>
                  <li className="list-group-item"><strong>Diámetro del tubo de descarga (mm):</strong> {tractor.diametroTuboDescarga}</li>
                  <li className="list-group-item"><strong>Cultivo/Uso:</strong> {tractor.cultivoUso}</li>
                  <li className="list-group-item"><strong>Año de fabricación:</strong> {tractor.anoFabricacion}</li>
                  <li className="list-group-item"><strong>Concesionario:</strong> {tractor.concesionario}</li>
                  <li className="list-group-item"><strong>Localidad:</strong> {tractor.localidad}</li>
                  <li className="list-group-item"><strong>Cuota sin interés:</strong> {tractor.cuotaSinInteres}</li>
                  <li className="list-group-item"><strong>Costo de envío:</strong> {tractor.costoEnvio}</li>
                  <li className="list-group-item"><strong>Promociones de pago:</strong> {tractor.promocionesPago}</li>
                  <li className="list-group-item"><strong>Precio con IVA:</strong> {tractor.precioIVA.moneda} {tractor.precioIVA.valor}</li>
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
                    </ul>
                  </li>
                  <li className="list-group-item"><strong>Entrega:</strong> {tractor.entrega}</li>
                </ul>
                <a href={tractor.pdfUrl} className="btn btn-primary mt-3" target="_blank" rel="noopener noreferrer">Ver PDF</a>
              </div>
              <div className='gap-2 d-flex justify-content-center'>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    const confirmar = window.confirm("¿Estás seguro que deseas eliminar este tractor?");
                    if (confirmar) {
                      handleDeleteTractor(tractor.id);
                    }
                  }}
                >
                  Eliminar
                </button>
                    <Link to={`/opciones/maquinarias-agricolas/tolva/${tractor.id}`} className="btn btn-warning">
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

export default TolvasList;
