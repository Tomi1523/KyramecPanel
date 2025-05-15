import React, { useState, useRef } from "react";
import { useTractores } from "../../Use/useTractores";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../services/firebase";

const AddTractorSembradora = ({ subcategoria, categoria }) => {
  const { handleAddTractor } = useTractores();
  const [showAlert, setShowAlert] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [finalidad, setFinalidad] = useState("");
  const [title, setTitle] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [condicion, setCondicion] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [cultivoUso, setCultivoUso] = useState("");
  const [distanciaSurcos, setDistanciaSurcos] = useState("");
  const [anchoTrabajo, setAnchoTrabajo] = useState("");
  const [cantidadTolvas, setCantidadTolvas] = useState("");
  const [caracteristicasChasis, setCaracteristicasChasis] = useState("");
  const [sistemaLabranza, setSistemaLabranza] = useState("");
  const [sistemaSiembra, setSistemaSiembra] = useState("");
  const [cantidadSurcos, setCantidadSurcos] = useState("");
  const [anoFabricacion, setAnoFabricacion] = useState("");
  const [concesionario, setConcesionario] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [text, setText] = useState("");
  const [cuotaSinInteres, setCuotaSinInteres] = useState("");
  const [costoEnvio, setCostoEnvio] = useState("");
  const [promocionesPago, setPromocionesPago] = useState("");
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

  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);

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
        finalidad,
        condicion,
        marca,
        modelo,
        cultivoUso,
        distanciaSurcos,
        anchoTrabajo,
        cantidadTolvas,
        caracteristicasChasis,
        sistemaLabranza,
        sistemaSiembra,
        cantidadSurcos,
        anoFabricacion,
        concesionario,
        localidad,
        text,
        cuotaSinInteres,
        costoEnvio,
        promocionesPago,
        precioIVA,
        condicionesFinanciacion,
        entrega,
        imageUrls,
        pdfUrl,
        categoria,
        subcategoria,
      };

      console.log("🚜 Datos del tractor a guardar:", tractorData);

      await handleAddTractor(tractorData);

      // Reset all form fields
      setTitle("");
      setFinalidad("");
      setCondicion("");
      setMarca("");
      setModelo("");
      setCultivoUso("");
      setDistanciaSurcos("");
      setAnchoTrabajo("");
      setCantidadTolvas("");
      setCaracteristicasChasis("");
      setSistemaLabranza("");
      setSistemaSiembra("");
      setCantidadSurcos("");
      setAnoFabricacion("");
      setConcesionario("");
      setLocalidad("");
      setText("");
      setCuotaSinInteres("");
      setCostoEnvio("");
      setPromocionesPago("");
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
      setImageFiles([]); 
      setPdfFile(null);

      // Reset file input fields
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
      if (pdfInputRef.current) {
        pdfInputRef.current.value = "";
      }

      setShowAlert(true); // Mostrar la alerta
      setTimeout(() => setShowAlert(false), 5000);
    } catch (error) {
      console.error("❌ Error al subir archivos o guardar tractor:", error);
      alert(
        "Ocurrió un error al guardar el tractor. Por favor, intentá nuevamente."
      );
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
      <h2 className="mb-4">Agregar Sembradora</h2>

      <form onSubmit={handleSubmit} className="mb-5">
        <div className="mb-3 d-flex">
          <label className="form-label mb-0">Finalidad</label>
          <div className="d-flex gap-3" style={{ marginLeft: "30px" }}>
            <label className="d-flex gap-1">
              <input
                type="radio"
                name="finalidad"
                value="Vendo"
                checked={finalidad === "Vendo"}
                onChange={handleRadioChange}
              />
              Vendo
            </label>
            <label className="d-flex gap-1">
              <input
                type="radio"
                name="finalidad"
                value="Comprar"
                checked={finalidad === "Comprar"}
                onChange={handleRadioChange}
              />
              Comprar
            </label>
            <label className="d-flex gap-1">
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

        <div className="mb-3 d-flex">
          <label className="form-label mb-0">Condición</label>
          <div className="d-flex gap-3 mx-4">
            <label className="d-flex gap-1">
              <input
                type="radio"
                name="Nuevo"
                checked={condicion === "Nuevo"}
                onChange={(e) => setCondicion(e.target.name)}
              />
              <span>Nuevo</span>
            </label>
            <label className="d-flex gap-1">
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

        <div className="mb-3">
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
          <label className="form-label">Cultivo/Uso</label>
          <input
            type="text"
            className="form-control"
            placeholder="Cultivo/Uso"
            value={cultivoUso}
            onChange={(e) => setCultivoUso(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Distancia entre surcos</label>
          <input
            type="text"
            className="form-control"
            placeholder="Distancia entre surcos"
            value={distanciaSurcos}
            onChange={(e) => setDistanciaSurcos(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Ancho de trabajo</label>
          <input
            type="text"
            className="form-control"
            placeholder="Ancho de trabajo"
            value={anchoTrabajo}
            onChange={(e) => setAnchoTrabajo(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Cantidad de tolvas</label>
          <input
            type="text"
            className="form-control"
            placeholder="Cantidad de tolvas"
            value={cantidadTolvas}
            onChange={(e) => setCantidadTolvas(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Características del chasis</label>
          <input
            type="text"
            className="form-control"
            placeholder="Características del chasis"
            value={caracteristicasChasis}
            onChange={(e) => setCaracteristicasChasis(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Sistema de labranza</label>
          <select
            className="form-control"
            value={sistemaLabranza}
            onChange={(e) => setSistemaLabranza(e.target.value)}
          >
            <option value="">Seleccione una opción</option>
            <option value="convencional">Convencional</option>
            <option value="directa">Directa</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Sistema de siembra</label>
          <select
            className="form-control"
            value={sistemaSiembra}
            onChange={(e) => setSistemaSiembra(e.target.value)}
          >
            <option value="">Seleccione una opción</option>
            <option value="a chorillo">A chorillo</option>
            <option value="a voleo">A voleo</option>
            <option value="mecánica">Mecánica</option>
            <option value="neumática">Neumática</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Cantidad de surcos</label>
          <input
            type="text"
            className="form-control"
            placeholder="Cantidad de surcos"
            value={cantidadSurcos}
            onChange={(e) => setCantidadSurcos(e.target.value)}
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
          <label className="form-label">Cuota sin interés</label>
          <select
            className="form-select"
            value={cuotaSinInteres}
            onChange={(e) => setCuotaSinInteres(e.target.value)}
          >
            <option value="">Selecciona una opción</option>
            <option value="12 cuotas">12 cuotas</option>
            <option value="3 cuotas">3 cuotas</option>
            <option value="6 cuotas">6 cuotas</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Costo de envío</label>
          <select
            className="form-select"
            value={costoEnvio}
            onChange={(e) => setCostoEnvio(e.target.value)}
          >
            <option value="">Selecciona una opción</option>
            <option value="Envio gratis">Envío gratis</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Promociones de pago</label>
          <select
            className="form-select"
            value={promocionesPago}
            onChange={(e) => setPromocionesPago(e.target.value)}
          >
            <option value="">Selecciona una opción</option>
            <option value="10%OFF adicional con Tarjeta Agro">
              10%OFF adicional con Tarjeta Agro
            </option>
            <option value="20%OFF adicional con Visa Agro">
              20%OFF adicional con Visa Agro
            </option>
            <option value="25%OFF adicional con Visa">
              25%OFF adicional con Visa
            </option>
            <option value="3%OFF adicional con AgroCanje Agro">
              3%OFF adicional con AgroCanje Agro
            </option>
            <option value="35%OFF adicional con Visa Agro">
              35%OFF adicional con Visa Agro
            </option>
            <option value="Descuento con Tarjeta Agro">
              Descuento con Tarjeta Agro
            </option>
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

export default AddTractorSembradora;
