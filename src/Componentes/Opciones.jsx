import React from 'react';
import { useNavigate } from 'react-router-dom';

const Opciones = () => {
    const navigate = useNavigate();

    const handleGoToMaquinarias = () => {
        navigate("/opciones/maquinarias-agricolas");
    };

    const handleGoToMaquinariaVialTractores = () => {
        navigate("/opciones/maquinariavial");
    };

    const handleGoToRepuestos = () => {
        navigate("/opciones/repuestos");
    };

    const handleGoToTecnologia = () => {
        navigate("/opciones/tecnologias");
    };

     const handleGoToImplementosAgricolas = () => {
        navigate("/opciones/implementos-agricolas");
    };

     const handleGoToImplementosViales = () => {
        navigate("/opciones/implementos-viales");
    };

    const handleGoBack = () => {
        navigate(-1); 
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
      <button className="btn btn-success" onClick={handleGoToMaquinarias}>
        Ir a Maquinarias Agricolas
      </button>
      <button className="btn btn-success" onClick={handleGoToMaquinariaVialTractores}>
        Ir a Maquinarias Viales
      </button>
      <button className="btn btn-success" onClick={handleGoToRepuestos}>
        Ir a Repuestos
      </button>
      <button className="btn btn-success" onClick={handleGoToTecnologia}>
        Ir a Tecnologías para el agro
      </button>
       <button className="btn btn-success" onClick={handleGoToImplementosAgricolas}>
        Ir a Implementos Agricolas
      </button>
       <button className="btn btn-success" onClick={handleGoToImplementosViales}>
        Ir a Implementos Viales
      </button>
    </div>
  </div>
</div>

  
    );
};

export default Opciones;
