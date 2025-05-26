import React from 'react'
import { useNavigate } from 'react-router-dom';

const MaquinariasAgricolasOpciones = () => {

  const navigate = useNavigate();

const handleGoBack = () => {
        navigate(-1); 
    };

    const handleGoToTractores = () => {
        navigate("/opciones/maquinarias-agricolas/tractores");
    };

     const handleGoToSembradoras = () => {
        navigate("/opciones/maquinarias-agricolas/sembradoras");
    };

      const handleGoToPulverizadoras = () => {
        navigate("/opciones/maquinarias-agricolas/pulverizadoras");
    };

       const handleGoToTolvas = () => {
        navigate("/opciones/maquinarias-agricolas/tolvas");
    };

  return (
      <div className="container">
  <div className="row justify-content-center mb-3">
    <div className="col-12 col-md-4 text-center">
      <button className="btn btn-secondary w-100" onClick={handleGoBack}>
        Volver Atrás
      </button>
    </div>
  </div>

  <div className="row justify-content-center">
    <div className="col-12 col-md-8 d-flex flex-column gap-2">
      <button className="btn btn-success" onClick={handleGoToTractores}>
        Ir a Tractores
      </button>
      <button className="btn btn-success" onClick={handleGoToSembradoras}>
        Ir a Sembradoras
      </button>
      <button className="btn btn-success" onClick={handleGoToPulverizadoras}>
        Ir a Pulverizadoras
      </button>
        <button className="btn btn-success" onClick={handleGoToTolvas}>
        Ir a Tolvas
      </button>
     
    </div>
  </div>
</div>
  )
}

export default MaquinariasAgricolasOpciones