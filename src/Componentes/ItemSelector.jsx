import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddTractores from "./Tractores/AddTractores";
import AddRepuestos from "./OtrosProductos/AddRepuestos";
import AddTractorSembradora from "./Tractores/AddTractorSembradora";
import AddTractoresPulverizadoras from "./Tractores/AddTractoresPulverizadoras";
import AddTractoresTolvas from "./Tractores/AddTractoresTolvas";
import AddTractoresUsado from "./Tractores/AddTractoresUsado";

import AddMaquinariaVial from "./OtrosProductos/AddMaquinariaVial";
import AddTecnologiaParaElAgro from "./OtrosProductos/AddTecnologiaParaElAgro";
import AddImplementosAgricolas from "./OtrosProductos/AddImplementosAgricolas";
import AddImplementosViales from "./OtrosProductos/AddImplementosViales";
import { getAuth, signOut } from 'firebase/auth';
const ItemSelector = () => {
  
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptionSub, setSelectedOptionSub] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const navigate = useNavigate();


 
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      navigate('/login'); 
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const subOptionsMap = {
    "maquinaria-agricola": [
      "Tractores",
      "Sembradoras",
      "Pulverizadoras",
      "Tolvas",
      "Usado",
    ],
    "maquinaria-viales": [
      "Autoelevares",
      "Compactadores",
      "Excavadora",
      "Grúas",
      "Minicargadoras",
      "Miniexcavadoras",
      "Retroexcavadora",
      "Zanjadoras",
      "Martillos Hidráulicos",
      "Motoniveladora",
      "Topadoras",
    ],
    "repuestos": ["Varios"],
    "tecnologia-agro": ["Varios"],
    "implementos-agricolas": [
      "Abonados",
      "Acondicionador de Suelo",
      "Arado",
      "Acoplado",
      "Cargadores de Rollos",
      "Carro Forrajo",
      "Casilla Rurales",
      "Chipeadoras",
      "Clasificadora de Semillas",
      "Desmalesadora",
      "Embolsadora",
      "Enfardadora",
      "Estercoleras",
      "Extractoras",
      "Fertilizadoras",
      "Guinches",
      "Inoculadores",
      "Maquinaria Frutihorticola",
      "Mixer Agrícolas",
      "Molduras y Quebradoras",
      "Niveladora",
      "Pala Hidraulica",
      "Rastra",
      "Otros",
    ],
    "implementos-viales": [
      "Palas Cargadoras",
      "Palas Retro",
      "Plataformas Elevadoras",
      "Transpaletas",
      "Otros",
    ],
  };

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
    setSelectedOptionSub("");
    setConfirmed(false);
  };

  const handleSelectChangeSub = (e) => {
    setSelectedOptionSub(e.target.value);
    setConfirmed(false);
  };

  const handleContinue = () => {
    setConfirmed(true);
  };

  

  const handleGoToOpciones = () => {
    navigate("/opciones");
  };

 
  const renderComponent = () => {
    if (!confirmed) return null;

    if (selectedOption === "maquinaria-agricola") {
      switch (selectedOptionSub) {
        case "tractores":
          return <AddTractores categoria={selectedOption} subcategoria={selectedOptionSub} />;
        case "sembradoras":
          return <AddTractorSembradora categoria={selectedOption} subcategoria={selectedOptionSub} />;
        case "pulverizadoras":
          return <AddTractoresPulverizadoras categoria={selectedOption} subcategoria={selectedOptionSub} />;
        case "tolvas":
          return <AddTractoresTolvas categoria={selectedOption} subcategoria={selectedOptionSub} />;
          case "usado":
          return <AddTractoresUsado categoria={selectedOption} subcategoria={selectedOptionSub} />;
        default:
          return null;
      }
    }

    if (selectedOption === "maquinaria-viales") {
      return <AddMaquinariaVial categoria={selectedOption} subcategoria={selectedOptionSub} />;
    }

    if (selectedOption === "repuestos") {
      return <AddRepuestos categoria={selectedOption} subcategoria={selectedOptionSub} />;
    }
    if (selectedOption === "tecnologia-agro") {
      return <AddTecnologiaParaElAgro categoria={selectedOption} subcategoria={selectedOptionSub} />;
    }
   
    if (selectedOption === "implementos-agricolas") {
      return <AddImplementosAgricolas categoria={selectedOption} subcategoria={selectedOptionSub} />;
    }

    if (selectedOption === "implementos-viales") {
      return <AddImplementosViales categoria={selectedOption} subcategoria={selectedOptionSub} />;
    }

    return null;
  };

  return (
    <div className="container py-4">
        <div className="d-flex justify-content-end">
    <button type="button" className="btn btn-dark" onClick={handleLogout}>
      Cerrar sesión
    </button>
  </div>
      <h2 className="mb-4">Elegí una Categoría</h2>

      <div className="row">
        <div className="col-md-6 mb-3">
          <select
            className="form-select"
            value={selectedOption}
            onChange={handleSelectChange}
          >
            <option value="">Selecciona una opción</option>
            <option value="maquinaria-agricola">Maquinaria Agrícola</option>
            <option value="maquinaria-viales">Maquinaria Vial</option>
            <option value="repuestos">Repuestos</option>
            <option value="tecnologia-agro">Tecnología para el agro</option>
            <option value="implementos-agricolas">Implementos Agrícolas</option>
            <option value="implementos-viales">Implementos Viales</option>
          </select>
        </div>

        <div className="col-md-6 mb-3">
          <select
            className="form-select"
            value={selectedOptionSub}
            onChange={handleSelectChangeSub}
            disabled={!selectedOption}
          >
            <option value="">Selecciona una subopción</option>
            {selectedOption &&
              subOptionsMap[selectedOption]?.map((sub, index) => (
                <option key={index} value={sub.toLowerCase().replace(/\s/g, "-")}>
                  {sub}
                </option>
              ))}
          </select>
        </div>

        <div className="col-12">
          <button
            className="btn btn-primary me-2"
            onClick={handleContinue}
            disabled={!selectedOption || !selectedOptionSub}
          >
            Continuar
          </button>

         
        </div>

        <div className="col-12 mt-3">
          <button className="btn btn-success" onClick={handleGoToOpciones}>
            Ir a Categorías
          </button>
        </div>
      </div>

      
      <div className="mt-5">{renderComponent()}</div>
    </div>
  );
};

export default ItemSelector;
