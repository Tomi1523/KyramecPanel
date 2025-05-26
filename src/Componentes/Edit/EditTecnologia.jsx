import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storage } from "../../services/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useImplementos } from '../../Use/UseImplementos';


const EditTecnologia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getImplementoById, handleUpdateImplementos } = useImplementos();

  const [implemento, setImplemento] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    text: '',
    currentImages: [],
    extraFields: [""],
    precioIVA: { moneda: '', valor: '' },
  });

  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  useEffect(() => {
    const fetchImplemento = async () => {
      const data = await getImplementoById(id);
      if (data) {
        setImplemento(data);
        setFormData({
          title: data.title || '',
          text: data.text || '',
          currentImages: data.imageUrls || [],
          extraFields: data.extraFields || [""],
          precioIVA: data.precioIVA || { moneda: '', valor: '' },
        });
      }
    };

    fetchImplemento();
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

  const handleAddField = () => {
    setFormData((prev) => ({
      ...prev,
      extraFields: [...prev.extraFields, ""],
    }));
  };

  const handleFieldChange = (index, value) => {
    const updatedFields = [...formData.extraFields];
    updatedFields[index] = value;
    setFormData((prev) => ({
      ...prev,
      extraFields: updatedFields,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrls = [...formData.currentImages];
      let pdfUrl = implemento.pdfUrl;

      for (const imageFile of imageFiles) {
        const imageRef = ref(storage, `implementos/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        const url = await getDownloadURL(imageRef);
        imageUrls.push(url);
      }

      if (pdfFile) {
        const pdfRef = ref(storage, `implementos/${Date.now()}_${pdfFile.name}`);
        await uploadBytes(pdfRef, pdfFile);
        pdfUrl = await getDownloadURL(pdfRef);
      }

      const implementoData = {
        ...formData,
        imageUrls,
        pdfUrl,
      };

      await handleUpdateImplementos(id, implementoData);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    } catch (err) {
      console.error("Error al actualizar implemento:", err);
    } finally {
      setSubmitting(false);
    }
  };

   if (!implemento) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Editar Tecnología para el Agro</h2>

      <form onSubmit={handleSubmit} className="mb-5">
        <div className="mb-3">
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

        <div className="mb-3 mt-2">
          <label className="form-label">Campos adicionales</label>
          {formData.extraFields.map((field, index) => (
            <input
              key={index}
              type="text"
              className="form-control mb-2"
              placeholder={`Texto ${index + 1}`}
              value={field}
              onChange={(e) => handleFieldChange(index, e.target.value)}
            />
          ))}
          <button
            type="button"
            className="btn btn-success btn-sm mt-2"
            onClick={handleAddField}
          >
            + Añadir campo
          </button>
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
            ¡Tecnología para el agro actualizada correctamente!
          </div>
        )}
      </form>
    </div>
  );
};

export default EditTecnologia;
