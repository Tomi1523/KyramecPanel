import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storage } from "../../../services/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useTractores } from '../../../Use/useTractores';

const EditPulverizadora = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTractorById, handleUpdateTractor } = useTractores();

  const [tractor, setTractor] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    text: '',
    currentImages: [],
    finalidad: '',
    condicion: '',
    marca: '',
    modelo: '',
    potencia: '',
    anchoLabor: '',
    capacidadDeposito: '',
    flashSale: '',
    anoFabricacion: '',
    concesionario: '',
    localidad: '',
    cuotaSinInteres: '',
    costoEnvio: '',
    promocionesPago: '',
    precioIVA: { moneda: '', valor: '' },
    condicionesFinanciacion: {
      entregaFinanciacion: { checked: false, valor: '' },
      cuotas: { checked: false, valor: '' },
      financiacionFabrica: false,
      financiado: { checked: false, valor: '' },
      cheques: { checked: false, valor: '' },
      aceptaCanje: false,
      tasaDolares: { checked: false, valor: '' },
      tasaPesos: { checked: false, valor: '' },
      aConvenir: false,
    },
    entrega: '',
  });

  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  useEffect(() => {
    const fetchTractor = async () => {
      const data = await getTractorById(id);
      if (data) {
        setTractor(data);
        setFormData({
          title: data.title || '',
          text: data.text || '',
          currentImages: data.imageUrls || [],
          finalidad: data.finalidad || '',
          condicion: data.condicion || '',
          marca: data.marca || '',
          modelo: data.modelo || '',
          potencia: data.potencia || '',
          anchoLabor: data.anchoLabor || '',
          capacidadDeposito: data.capacidadDeposito || '',
          flashSale: data.flashSale || '',
          anoFabricacion: data.anoFabricacion || '',
          concesionario: data.concesionario || '',
          localidad: data.localidad || '',
          cuotaSinInteres: data.cuotaSinInteres || '',
          costoEnvio: data.costoEnvio || '',
          promocionesPago: data.promocionesPago || '',
          precioIVA: data.precioIVA || { moneda: '', valor: '' },
          condicionesFinanciacion: data.condicionesFinanciacion || {
            entregaFinanciacion: { checked: false, valor: '' },
            cuotas: { checked: false, valor: '' },
            financiacionFabrica: false,
            financiado: { checked: false, valor: '' },
            cheques: { checked: false, valor: '' },
            aceptaCanje: false,
            tasaDolares: { checked: false, valor: '' },
            tasaPesos: { checked: false, valor: '' },
            aConvenir: false,
          },
          entrega: data.entrega || '',
        });
      }
    };

    fetchTractor();
  }, [id]);

  const handleDeleteImage = async (imageUrl) => {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
      setFormData((prev) => ({
        ...prev,
        currentImages: prev.currentImages.filter(url => url !== imageUrl),
      }));
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      finalidad: e.target.value,
    }));
  };

  const handleCondicionesFinanciacionChange = (e) => {
    const { name, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      condicionesFinanciacion: {
        ...prev.condicionesFinanciacion,
        [name]: { ...prev.condicionesFinanciacion[name], checked, valor: value },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrls = [...formData.currentImages];
      let pdfUrl = tractor.pdfUrl;

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
        ...formData,
        imageUrls,
        pdfUrl,
      };

      await handleUpdateTractor(id, tractorData);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    } catch (err) {
      console.error("Error al actualizar tractor:", err);
    } finally {
      setSubmitting(false);
    }
  };

   if (!tractor) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Editar Pulverizadora</h2>
      <form onSubmit={handleSubmit} className="mb-5">
        <div className="mb-3 d-flex">
          <label className="form-label mb-0">Finalidad</label>
          <div className="d-flex gap-3" style={{ marginLeft: "31px" }}>
            <label className="d-flex gap-1">
              <input
                type="radio"
                name="finalidad"
                value="Vendo"
                checked={formData.finalidad === "Vendo"}
                onChange={handleRadioChange}
              />
              Vendo
            </label>
            <label className="d-flex gap-1">
              <input
                type="radio"
                name="finalidad"
                value="Comprar"
                checked={formData.finalidad === "Comprar"}
                onChange={handleRadioChange}
              />
              Comprar
            </label>
            <label className="d-flex gap-1">
              <input
                type="radio"
                name="finalidad"
                value="Alquilo"
                checked={formData.finalidad === "Alquilo"}
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
                name="condicion"
                value="Nuevo"
                checked={formData.condicion === "Nuevo"}
                onChange={handleChange}
              />
              <span>Nuevo</span>
            </label>
            <label className="d-flex gap-1">
              <input
                type="radio"
                name="condicion"
                value="Usado"
                checked={formData.condicion === "Usado"}
                onChange={handleChange}
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
            name="title"
            value={formData.title}
            onChange={handleChange}
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
            name="marca"
            value={formData.marca}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Modelo</label>
          <input
            type="text"
            className="form-control"
            placeholder="Modelo"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Potencia (HP)</label>
          <select
            className="form-select"
            name="potencia"
            value={formData.potencia}
            onChange={handleChange}
          >
            <option value="">Selecciona una opción</option>
            <option value="Menos de 100">Menos de 100</option>
            <option value="Entre 101 y 200">Entre 101 y 200</option>
            <option value="Mayor a 201">Mayor a 201</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Ancho de Labor (en metros)</label>
          <select
            className="form-select"
            name="anchoLabor"
            value={formData.anchoLabor}
            onChange={handleChange}
          >
            <option value="">Selecciona una opción</option>
            <option value="0 a 10mts">0 a 10mts</option>
            <option value="10 a 20mts">10 a 20mts</option>
            <option value="20 a 30mts">20 a 30mts</option>
            <option value="mas de 30 mts">más de 30 mts</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Capacidad del depósito</label>
          <select
            className="form-select"
            name="capacidadDeposito"
            value={formData.capacidadDeposito}
            onChange={handleChange}
          >
            <option value="">Selecciona una opción</option>
            <option value="menos de 2000">Menos de 2000</option>
            <option value="de 2000 a 3000">De 2000 a 3000</option>
            <option value="mas de 3000">Más de 3000</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Año de fabricación</label>
          <select
            className="form-select"
            name="anoFabricacion"
            value={formData.anoFabricacion}
            onChange={handleChange}
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
            name="concesionario"
            value={formData.concesionario}
            onChange={handleChange}
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
            name="cuotaSinInteres"
            value={formData.cuotaSinInteres}
            onChange={handleChange}
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
            name="costoEnvio"
            value={formData.costoEnvio}
            onChange={handleChange}
          >
            <option value="">Selecciona una opción</option>
            <option value="Envio gratis">Envío gratis</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Promociones de pago</label>
          <select
            className="form-select"
            name="promocionesPago"
            value={formData.promocionesPago}
            onChange={handleChange}
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
          <label className="form-label">FLASH SALE</label>
          <select
            className="form-select"
            name="flashSale"
            value={formData.flashSale}
            onChange={handleChange}
          >
            <option value="">Selecciona una opción</option>
            <option value="flash sale">Flash Sale</option>
            <option value="Flash Sale Agroweek">Flash Sale Agroweek</option>
            <option value="Flash Sale Promociones">Flash Sale Promociones</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Localidad</label>
          <input
            type="text"
            className="form-control"
            placeholder="Localidad"
            name="localidad"
            value={formData.localidad}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            placeholder="Descripción"
            name="text"
            value={formData.text}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Precio con IVA</label>
          <div className="input-group">
            <select
              className="form-select"
              name="precioIVA.moneda"
              value={formData.precioIVA.moneda}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  precioIVA: { ...prev.precioIVA, moneda: e.target.value },
                }))
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
              name="precioIVA.valor"
              value={formData.precioIVA.valor}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  precioIVA: { ...prev.precioIVA, valor: e.target.value },
                }))
              }
            />
          </div>
        </div>

        <div className="p-4 border rounded bg-light">
          <label className="form-label mb-3 fs-5">
            Condiciones y Financiación
          </label>

          <div className="d-flex justify-content-between align-items-center mb-4 gap-4">
            <label className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="entregaFinanciacion"
                checked={formData.condicionesFinanciacion.entregaFinanciacion.checked}
                onChange={handleCondicionesFinanciacionChange}
              />
              Entrega + Financiación
            </label>
            <div className="d-flex align-items-center w-50">
              <input
                type="number"
                className="form-control form-control-sm me-2"
                placeholder="Valor"
                value={formData.condicionesFinanciacion.entregaFinanciacion.valor}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    condicionesFinanciacion: {
                      ...prev.condicionesFinanciacion,
                      entregaFinanciacion: {
                        ...prev.condicionesFinanciacion.entregaFinanciacion,
                        valor: e.target.value,
                      },
                    },
                  }))
                }
                disabled={!formData.condicionesFinanciacion.entregaFinanciacion.checked}
              />
              <span className="flex-shrink-0">% entrega + financiación</span>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4 gap-4">
            <label className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="cuotas"
                checked={formData.condicionesFinanciacion.cuotas.checked}
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
                value={formData.condicionesFinanciacion.cuotas.valor}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    condicionesFinanciacion: {
                      ...prev.condicionesFinanciacion,
                      cuotas: { ...prev.condicionesFinanciacion.cuotas, valor: e.target.value },
                    },
                  }))
                }
                disabled={!formData.condicionesFinanciacion.cuotas.checked}
              />
              <span>cuotas</span>
            </div>
          </div>

          <div className="d-flex align-items-center mb-4">
            <label className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="financiacionFabrica"
                checked={formData.condicionesFinanciacion.financiacionFabrica}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    condicionesFinanciacion: {
                      ...prev.condicionesFinanciacion,
                      financiacionFabrica: e.target.checked,
                    },
                  }))
                }
              />
              Financiación de la Fábrica
            </label>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4 gap-4">
            <label className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="financiado"
                checked={formData.condicionesFinanciacion.financiado.checked}
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
                value={formData.condicionesFinanciacion.financiado.valor}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    condicionesFinanciacion: {
                      ...prev.condicionesFinanciacion,
                      financiado: { ...prev.condicionesFinanciacion.financiado, valor: e.target.value },
                    },
                  }))
                }
                disabled={!formData.condicionesFinanciacion.financiado.checked}
              />
              <span>años</span>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4 gap-4">
            <label className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="cheques"
                checked={formData.condicionesFinanciacion.cheques.checked}
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
                value={formData.condicionesFinanciacion.cheques.valor}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    condicionesFinanciacion: {
                      ...prev.condicionesFinanciacion,
                      cheques: { ...prev.condicionesFinanciacion.cheques, valor: e.target.value },
                    },
                  }))
                }
                disabled={!formData.condicionesFinanciacion.cheques.checked}
              />
              <span>cheques</span>
            </div>
          </div>

          <div className="d-flex align-items-center mb-4">
            <label className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="aceptaCanje"
                checked={formData.condicionesFinanciacion.aceptaCanje}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    condicionesFinanciacion: {
                      ...prev.condicionesFinanciacion,
                      aceptaCanje: e.target.checked,
                    },
                  }))
                }
              />
              Acepta Canje
            </label>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4 gap-4">
            <label className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="tasaDolares"
                checked={formData.condicionesFinanciacion.tasaDolares.checked}
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
                value={formData.condicionesFinanciacion.tasaDolares.valor}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    condicionesFinanciacion: {
                      ...prev.condicionesFinanciacion,
                      tasaDolares: { ...prev.condicionesFinanciacion.tasaDolares, valor: e.target.value },
                    },
                  }))
                }
                disabled={!formData.condicionesFinanciacion.tasaDolares.checked}
              />
              <span className="flex-shrink-0">% en dólares</span>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4 gap-4">
            <label className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="tasaPesos"
                checked={formData.condicionesFinanciacion.tasaPesos.checked}
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
                value={formData.condicionesFinanciacion.tasaPesos.valor}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    condicionesFinanciacion: {
                      ...prev.condicionesFinanciacion,
                      tasaPesos: { ...prev.condicionesFinanciacion.tasaPesos, valor: e.target.value },
                    },
                  }))
                }
                disabled={!formData.condicionesFinanciacion.tasaPesos.checked}
              />
              <span className="flex-shrink-0">% en pesos</span>
            </div>
          </div>

          <div className="d-flex align-items-center mb-4">
            <label className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="aConvenir"
                checked={formData.condicionesFinanciacion.aConvenir}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    condicionesFinanciacion: {
                      ...prev.condicionesFinanciacion,
                      aConvenir: e.target.checked,
                    },
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
            name="entrega"
            value={formData.entrega}
            onChange={handleChange}
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
          <label className="form-label">Imágenes</label>
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

        {formData.currentImages.length > 0 && (
          <div className="row mt-3">
            <label className="form-label">Imágenes Actuales</label>
            {formData.currentImages.map((imageUrl, index) => (
              <div key={index} className="col-3 mb-4">
                <img
                  src={imageUrl}
                  alt={`current-${index}`}
                  className="img-fluid rounded"
                />
                <div className="text-center mt-2">
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteImage(imageUrl)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

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
          {submitting ? "Guardando..." : "Guardar Cambios"}
        </button>
        {showAlert && (
          <div className="alert alert-info mt-2" role="alert">
            ¡Pulverizadora actualizada correctamente!
          </div>
        )}
      </form>
    </div>
  );
};

export default EditPulverizadora;
