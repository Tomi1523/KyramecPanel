import React, { useState, useRef } from "react";

import { storage } from "../../services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useTractores } from "../../Use/useTractores";

const AddTractores = ({ subcategoria, categoria }) => {
  const { handleAddTractor } = useTractores();

  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const [showAlert, setShowAlert] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [finalidad, setFinalidad] = useState("");
  const [condicion, setCondicion] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [anoFabricacion, setAnoFabricacion] = useState("");
  const [linea, setLinea] = useState("");
  const [potencia, setPotencia] = useState("");
  const [traccion, setTraccion] = useState("");
  const [seccion, setSeccion] = useState("");
  const [direccion, setDireccion] = useState("");
  const [tipoMotor, setTipoMotor] = useState("");
  const [levanteTresPuntos, setLevanteTresPuntos] = useState("");
  const [cabina, setCabina] = useState("");
  const [varianteTraccion, setVarianteTraccion] = useState("");
  const [tipoRodado, setTipoRodado] = useState("");
  const [concesionario, setConcesionario] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [precioIVA, setPrecioIVA] = useState({ moneda: "", valor: "" });
  const [condicionesFinanciacion, setCondicionesFinanciacion] = useState({
    entregaFinanciacion: { checked: false, valor: "" },
    cuotas: { checked: false, valor: "" },
    financiacionFabrica: false,
    financiado: { checked: false, valor: "" },
    cheques: { checked: false, valor: "" },
    aceptaCanje: false,
    tasaDolares: { checked: false, valor: "" },
    tasaPesos: { checked: false, valor: "" },
    aConvenir: false,
  });
  const [entrega, setEntrega] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    try {
      setSubmitting(true);

      let imageUrls = [];
      let pdfUrl = "";

      for (const imageFile of imageFiles) {
        const imageRef = ref(storage, `tractores/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        const url = await getDownloadURL(imageRef);
        imageUrls.push(url);
      }

      if (pdfFile) {
        const pdfRef = ref(storage, `tractores/${Date.now()}_${pdfFile.name}`);
        await uploadBytes(pdfRef, pdfFile);
        pdfUrl = await getDownloadURL(pdfRef);
      }

      const tractorData = {
        title,
        text,
        imageUrls,
        pdfUrl,
        finalidad,
        condicion,
        marca,
        modelo,
        anoFabricacion,
        linea,
        potencia,
        traccion,
        direccion,
        tipoMotor,
        levanteTresPuntos,
        cabina,
        varianteTraccion,
        tipoRodado,
        concesionario,
        localidad,
        precioIVA,
        condicionesFinanciacion,
        seccion,
        entrega,
        categoria,
        subcategoria,
      };

      console.log("Datos del tractor a guardar:", tractorData);

      await handleAddTractor(tractorData);

      // Resetear los campos del formulario
      setTitle("");
      setText("");
      
      setImageFiles([]); 
      setPdfFile(null);
      setFinalidad("");
      setCondicion("");
      setMarca("");
      setModelo("");
      setAnoFabricacion("");
      setLinea("");
      setPotencia("");
      setTraccion("");
      setDireccion("");
      setTipoMotor("");
      setLevanteTresPuntos("");
      setCabina("");
      setVarianteTraccion("");
      setTipoRodado("");
      setSeccion("");
      setConcesionario("");
      setLocalidad("");
      setPrecioIVA({ moneda: "", valor: "" });
      setCondicionesFinanciacion({
        entregaFinanciacion: { checked: false, valor: "" },
        cuotas: { checked: false, valor: "" },
        financiacionFabrica: false,
        financiado: { checked: false, valor: "" },
        cheques: { checked: false, valor: "" },
        aceptaCanje: false,
        tasaDolares: { checked: false, valor: "" },
        tasaPesos: { checked: false, valor: "" },
        aConvenir: false,
      });
      setEntrega("");

      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
      if (pdfInputRef.current) {
        pdfInputRef.current.value = "";
      }

      setShowAlert(true); // Mostrar la alerta
      setTimeout(() => setShowAlert(false), 5000);
    } catch (err) {
      console.error("❌ Error al agregar tractor:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRadioChange = (e) => {
    setFinalidad(e.target.value);
  };

  const handleCondicionesFinanciacionChange = (e) => {
    const { name, checked, value } = e.target;
    setCondicionesFinanciacion((prev) => ({
      ...prev,
      [name]: { ...prev[name], checked, valor: value },
    }));
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Agregar Tractor</h2>
      <form onSubmit={handleSubmit} className="mb-5">
        

        <div className="mb-3 d-flex  ">
          <label className="form-label mb-0">Finalidad</label>
          <div className="d-flex gap-3" style={{ marginLeft: "31px" }}>
            <label className="d-flex  gap-1">
              <input
                type="radio"
                name="finalidad"
                value="Vendo"
                checked={finalidad === "Vendo"}
                onChange={handleRadioChange}
              />
              Vendo
            </label>
            <label className="d-flex  gap-1">
              <input
                type="radio"
                name="finalidad"
                value="Comprar"
                checked={finalidad === "Comprar"}
                onChange={handleRadioChange}
              />
              Comprar
            </label>
            <label className="d-flex  gap-1">
              <input
                type="radio"
                name="finalidad"
                value="Alquilo"
                checked={finalidad === "Alquilo"}
                onChange={handleRadioChange}
              />
              Alquilo
            </label>
          </div>
        </div>

        <div className="mb-3 d-flex  ">
          <label className="form-label mb-0">Condición</label>
          <div className="d-flex gap-3 mx-4">
            <label className="d-flex  gap-1">
              <input
                type="radio"
                name="Nuevo"
                checked={condicion === "Nuevo"}
                onChange={(e) => setCondicion(e.target.name)}
              />
              <span>Nuevo</span>
            </label>
            <label className="d-flex  gap-1">
              <input
                type="radio"
                name="Usado"
                checked={condicion === "Usado"}
                onChange={(e) => setCondicion(e.target.name)}
              />
              <span>Usado</span>
            </label>
          </div>
        </div>

        <div>
          <label className="form-label">Título</label>
          <input
            type="text"
            className="form-control"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            
            maxLength={55}
          />
          <small className="form-text text-muted justify-content-start d-flex">
            Máximo 55 caracteres.
          </small>
        </div>

        <div className="mb-3">
          <label className="form-label">Marca</label>
          <input
            type="text"
            className="form-control"
            placeholder="Marca"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Modelo</label>
          <input
            type="text"
            className="form-control"
            placeholder="Modelo"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Año de fabricación</label>
          <select
            className="form-select"
            value={anoFabricacion}
            onChange={(e) => setAnoFabricacion(e.target.value)}
          >
            <option value="">Selecciona un año</option>
            {Array.from({ length: 2025 - 1990 + 1 }, (_, i) => 1990 + i).map(
              (year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              )
            )}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Línea</label>
          <input
            type="text"
            className="form-control"
            placeholder="Línea"
            value={linea}
            onChange={(e) => setLinea(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Potencia (HP)</label>
          <select
            className="form-select"
            value={potencia}
            onChange={(e) => setPotencia(e.target.value)}
          >
            <option value="">Selecciona una opción</option>
            <option value="Menos de 100">Menos de 100</option>
            <option value="Entre 101 y 200">Entre 101 y 200</option>
            <option value="Mayor a 201">Mayor a 201</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Tipo de Tractor</label>
          <select
            className="form-select"
            value={seccion}
            onChange={(e) => setSeccion(e.target.value)}
          >
            <option value="">Selecciona una opción</option>
            <option value="A">25 a 70 hp</option>
            <option value="B">30 a 70 hp</option>
            <option value="C">45 a 90 hp</option>
            <option value="D">100 a 140 hp</option>
            <option value="E">160 a 220 hp</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Tracción</label>
          <select
            className="form-select"
            value={traccion}
            onChange={(e) => setTraccion(e.target.value)}
          >
            <option value="">Selecciona una opción</option>
            <option value="Traccion doble">Tracción doble</option>
            <option value="Traccion simple">Tracción simple</option>
            <option value="Traccion asistida">Tracción asistida</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <select
            className="form-select"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          >
            <option value="">Selecciona una opción</option>
            <option value="Asistida">Asistida</option>
            <option value="Hidraulica">Hidráulica</option>
            <option value="Mecanica">Mecánica</option>
            <option value="Electrica">Eléctrica</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Tipo de motor</label>
          <select
            className="form-select"
            value={tipoMotor}
            onChange={(e) => setTipoMotor(e.target.value)}
          >
            <option value="">Selecciona una opción</option>
            <option value="a gas">A gas</option>
            <option value="nafta">Nafta</option>
            <option value="diesel">Diésel</option>
            <option value="electrico">Eléctrico</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Levante a 3 puntos</label>
          <select
            className="form-select"
            value={levanteTresPuntos}
            onChange={(e) => setLevanteTresPuntos(e.target.value)}
          >
            <option value="">Selecciona una opción</option>
            <option value="Con levante tres puntos">
              Con levante tres puntos
            </option>
            <option value="Sin levante tres puntos">
              Sin levante tres puntos
            </option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Cabina</label>
          <select
            className="form-select"
            value={cabina}
            onChange={(e) => setCabina(e.target.value)}
          >
            <option value="">Selecciona una opción</option>
            <option value="Con cabina">Con cabina</option>
            <option value="Sin cabina">Sin cabina</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Variante de tracción</label>
          <select
            className="form-select"
            value={varianteTraccion}
            onChange={(e) => setVarianteTraccion(e.target.value)}
          >
            <option value="">Selecciona una opción</option>
            <option value="Articulado">Articulado</option>
            <option value="Rigido">Rígido</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Tipo de rodado</label>
          <select
            className="form-select"
            value={tipoRodado}
            onChange={(e) => setTipoRodado(e.target.value)}
          >
            <option value="">Selecciona una opción</option>
            <option value="Neumatico">Neumático</option>
            <option value="Oruga">Oruga</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Concesionario</label>
          <select
            className="form-select"
            value={concesionario}
            onChange={(e) => setConcesionario(e.target.value)}
          >
            <option value="">Selecciona una opción</option>
            <option value="AgroCosecha S.A">AgroCosecha S.A</option>
            <option value="AgroDirecto S.A">AgroDirecto S.A</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Localidad</label>
          <input
            type="text"
            className="form-control"
            placeholder="Localidad"
            value={localidad}
            onChange={(e) => setLocalidad(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Precio con IVA</label>
          <div className="input-group">
            <select
              className="form-select"
              value={precioIVA.moneda}
              onChange={(e) =>
                setPrecioIVA({ ...precioIVA, moneda: e.target.value })
              }
            >
              <option value="">Selecciona una moneda</option>
              <option value="ARS">ARS</option>
              <option value="USD">USD</option>
            </select>
            <input
              type="number"
              className="form-control"
              placeholder="Valor"
              value={precioIVA.valor}
              onChange={(e) =>
                setPrecioIVA({ ...precioIVA, valor: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <textarea
              className="form-control"
              placeholder="Descripción"
              value={text}
              onChange={(e) => setText(e.target.value)}
              
            />
          </div>
        </div>

        <div className="p-4 border rounded bg-light">
          <label className="form-label mb-3 fs-5">
            Condiciones y Financiación
          </label>

          {/* Entrega + Financiación */}
          <div className="d-flex justify-content-between align-items-center mb-4 gap-4">
            <label className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="entregaFinanciacion"
                checked={condicionesFinanciacion.entregaFinanciacion.checked}
                onChange={handleCondicionesFinanciacionChange}
              />
              Entrega + Financiación
            </label>
            <div className="d-flex align-items-center w-50">
              <input
                type="number"
                className="form-control form-control-sm me-2"
                placeholder="Valor"
                value={condicionesFinanciacion.entregaFinanciacion.valor}
                onChange={(e) =>
                  setCondicionesFinanciacion((prev) => ({
                    ...prev,
                    entregaFinanciacion: {
                      ...prev.entregaFinanciacion,
                      valor: e.target.value,
                    },
                  }))
                }
                disabled={!condicionesFinanciacion.entregaFinanciacion.checked}
              />
              <span className="flex-shrink-0">% entrega + financiación</span>
            </div>
          </div>

          {/* Cuotas */}
          <div className="d-flex justify-content-between align-items-center mb-4 gap-4">
            <label className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="cuotas"
                checked={condicionesFinanciacion.cuotas.checked}
                onChange={handleCondicionesFinanciacionChange}
              />
              Cuotas
            </label>
            <div className="d-flex align-items-center w-50">
              <span className="me-2">Hasta</span>
              <input
                type="number"
                className="form-control form-control-sm me-2"
                placeholder="Valor"
                value={condicionesFinanciacion.cuotas.valor}
                onChange={(e) =>
                  setCondicionesFinanciacion((prev) => ({
                    ...prev,
                    cuotas: { ...prev.cuotas, valor: e.target.value },
                  }))
                }
                disabled={!condicionesFinanciacion.cuotas.checked}
              />
              <span>cuotas</span>
            </div>
          </div>

          {/* Financiación de la Fábrica */}
          <div className="d-flex align-items-center mb-4">
            <label className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="financiacionFabrica"
                checked={condicionesFinanciacion.financiacionFabrica}
                onChange={(e) =>
                  setCondicionesFinanciacion((prev) => ({
                    ...prev,
                    financiacionFabrica: e.target.checked,
                  }))
                }
              />
              Financiación de la Fábrica
            </label>
          </div>

          {/* Financiado */}
          <div className="d-flex justify-content-between align-items-center mb-4 gap-4">
            <label className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="financiado"
                checked={condicionesFinanciacion.financiado.checked}
                onChange={handleCondicionesFinanciacionChange}
              />
              Financiado
            </label>
            <div className="d-flex align-items-center w-50">
              <span className="me-2 flex-shrink-0">Financiado en</span>
              <input
                type="number"
                className="form-control form-control-sm me-2"
                placeholder="Valor"
                value={condicionesFinanciacion.financiado.valor}
                onChange={(e) =>
                  setCondicionesFinanciacion((prev) => ({
                    ...prev,
                    financiado: { ...prev.financiado, valor: e.target.value },
                  }))
                }
                disabled={!condicionesFinanciacion.financiado.checked}
              />
              <span>años</span>
            </div>
          </div>

          {/* Cheques */}
          <div className="d-flex justify-content-between align-items-center mb-4 gap-4">
            <label className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="cheques"
                checked={condicionesFinanciacion.cheques.checked}
                onChange={handleCondicionesFinanciacionChange}
              />
              Cheques
            </label>
            <div className="d-flex align-items-center w-50">
              <span className="me-2">Hasta</span>
              <input
                type="number"
                className="form-control form-control-sm me-2"
                placeholder="Valor"
                value={condicionesFinanciacion.cheques.valor}
                onChange={(e) =>
                  setCondicionesFinanciacion((prev) => ({
                    ...prev,
                    cheques: { ...prev.cheques, valor: e.target.value },
                  }))
                }
                disabled={!condicionesFinanciacion.cheques.checked}
              />
              <span>cheques</span>
            </div>
          </div>

          {/* Acepta Canje */}
          <div className="d-flex align-items-center mb-4">
            <label className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="aceptaCanje"
                checked={condicionesFinanciacion.aceptaCanje}
                onChange={(e) =>
                  setCondicionesFinanciacion((prev) => ({
                    ...prev,
                    aceptaCanje: e.target.checked,
                  }))
                }
              />
              Acepta Canje
            </label>
          </div>

          {/* Tasa en dólares */}
          <div className="d-flex justify-content-between align-items-center mb-4 gap-4">
            <label className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="tasaDolares"
                checked={condicionesFinanciacion.tasaDolares.checked}
                onChange={handleCondicionesFinanciacionChange}
              />
              Tasa en dólares
            </label>
            <div className="d-flex align-items-center w-50">
              <span className="me-2">Tasa</span>
              <input
                type="number"
                className="form-control form-control-sm me-2"
                placeholder="Valor"
                value={condicionesFinanciacion.tasaDolares.valor}
                onChange={(e) =>
                  setCondicionesFinanciacion((prev) => ({
                    ...prev,
                    tasaDolares: { ...prev.tasaDolares, valor: e.target.value },
                  }))
                }
                disabled={!condicionesFinanciacion.tasaDolares.checked}
              />
              <span className="flex-shrink-0">% en dólares</span>
            </div>
          </div>

          {/* Tasa en pesos */}
          <div className="d-flex justify-content-between align-items-center mb-4 gap-4">
            <label className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="tasaPesos"
                checked={condicionesFinanciacion.tasaPesos.checked}
                onChange={handleCondicionesFinanciacionChange}
              />
              Tasa en pesos
            </label>
            <div className="d-flex align-items-center w-50">
              <span className="me-2">Tasa</span>
              <input
                type="number"
                className="form-control form-control-sm me-2"
                placeholder="Valor"
                value={condicionesFinanciacion.tasaPesos.valor}
                onChange={(e) =>
                  setCondicionesFinanciacion((prev) => ({
                    ...prev,
                    tasaPesos: { ...prev.tasaPesos, valor: e.target.value },
                  }))
                }
                disabled={!condicionesFinanciacion.tasaPesos.checked}
              />
              <span className="flex-shrink-0">% en pesos</span>
            </div>
          </div>

          {/* A convenir */}
          <div className="d-flex align-items-center mb-4">
            <label className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="aConvenir"
                checked={condicionesFinanciacion.aConvenir}
                onChange={(e) =>
                  setCondicionesFinanciacion((prev) => ({
                    ...prev,
                    aConvenir: e.target.checked,
                  }))
                }
              />
              A convenir
            </label>
          </div>
        </div>

        <div className="mb-3 mt-3">
          <label className="form-label">Entrega</label>
          <select
            className="form-select"
            value={entrega}
            onChange={(e) => setEntrega(e.target.value)}
          >
            <option value="">Selecciona una opción</option>
            <option value="Inmediata">Inmediata</option>
            <option value="de 0 a 15 dias">De 0 a 15 días</option>
            <option value="de 15 a 30 dias">De 15 a 30 días</option>
            <option value="de 30 a 60 dias">De 30 a 60 días</option>
            <option value="de 60 a 90 dias">De 60 a 90 días</option>
            <option value=">90dias">Más de 90 días</option>
            <option value="A convenir">A convenir</option>
          </select>
        </div>

        <div className="mb-3">
  <label className="form-label">Imagenes</label>
  <input
    type="file"
    className="form-control"
    accept="image/*"
    multiple
    onChange={(e) => {
      const files = Array.from(e.target.files);
      setImageFiles((prevImages) => [...prevImages, ...files]);
    }}
    ref={imageInputRef}
  />
</div>

{/* Mostrar solo si hay imágenes seleccionadas */}
{imageFiles.length > 0 && (
  <div className="row mt-3">
    <label className="form-label">Imágenes Seleccionadas</label>
    {imageFiles.map((image, index) => (
      <div key={index} className="col-3 mb-4">
      <img
        src={URL.createObjectURL(image)}
        alt={`preview-${index}`}
        className="img-fluid rounded"
      />
      <div className="text-center mt-2">
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={() => {
            setImageFiles((prevImages) =>
              prevImages.filter((_, i) => i !== index)
            );
          }}
        >
          Eliminar
        </button>
      </div>
    </div>
    
    ))}
  </div>
)}



        <div className="mb-3">
          <label className="form-label">PDF</label>
          <input
            type="file"
            className="form-control"
            accept=".pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
            ref={pdfInputRef}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Publicando..." : "Publicar"}
        </button>
        {showAlert && (
          <div className="alert alert-info mt-2" role="alert">
            ¡Producto agregado correctamente!
          </div>
        )}
      </form>
    </div>
  );
};

export default AddTractores;
