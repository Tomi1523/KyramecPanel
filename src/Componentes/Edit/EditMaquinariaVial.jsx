import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTractores } from '../../Use/useTractores';
import { storage } from "../../services/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const EditMaquinariaVial = () => {
  const { id } = useParams();
  const { getTractorById, handleUpdateTractor } = useTractores();

  const [formData, setFormData] = useState({
    title: '',
    text: '',
    imageUrls: [],
    pdfUrl: '',
    extraFields: [''],
    precioIVA: { moneda: "", valor: "" }
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  useEffect(() => {
    const fetchTractor = async () => {
      const data = await getTractorById(id);
      if (data) {
        setFormData({
          title: data.title || '',
          text: data.text || '',
          imageUrls: data.imageUrls || [],
          pdfUrl: data.pdfUrl || '',
          extraFields: data.extraFields || [''],
          precioIVA: data.precioIVA || { moneda: "", valor: "" }
        });
      }
    };

    fetchTractor();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFieldChange = (index, value) => {
    const updatedFields = [...formData.extraFields];
    updatedFields[index] = value;
    setFormData({ ...formData, extraFields: updatedFields });
  };

  const handleAddField = () => {
    setFormData({ ...formData, extraFields: [...formData.extraFields, ""] });
  };

  const handleDeleteImage = async (index) => {
    const imageUrl = formData.imageUrls[index];
    const imageRef = ref(storage, imageUrl);

    try {
      await deleteObject(imageRef);
      const updatedImageUrls = formData.imageUrls.filter((_, i) => i !== index);
      setFormData({ ...formData, imageUrls: updatedImageUrls });
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrls = [...formData.imageUrls];
      let pdfUrl = formData.pdfUrl;

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
        pdfUrl
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

  return (
    <div className="container py-4">
      <h2 className="mb-4">Editar Maquinaria Vial</h2>
      <form onSubmit={handleSubmit} className="mb-5">
        <div className="mb-3">
          <label className="form-label">Título</label>
          <input
            type="text"
            className="form-control"
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
                setFormData({ ...formData, precioIVA: { ...formData.precioIVA, moneda: e.target.value } })
              }
            >
              <option value="">Selecciona una moneda</option>
              <option value="ARS">ARS</option>
              <option value="USD">USD</option>
            </select>
            <input
              type="number"
              className="form-control"
              name="precioIVA.valor"
              placeholder="Valor"
              value={formData.precioIVA.valor}
              onChange={(e) =>
                setFormData({ ...formData, precioIVA: { ...formData.precioIVA, valor: e.target.value } })
              }
            />
          </div>
        </div>

        <div className="mb-3">
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

        {formData.imageUrls.length > 0 && (
          <div className="row mt-3">
            <label className="form-label">Imágenes Actuales</label>
            {formData.imageUrls.map((imageUrl, index) => (
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
                    onClick={() => handleDeleteImage(index)}
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
            ¡Producto actualizado correctamente!
          </div>
        )}
      </form>
    </div>
  );
};

export default EditMaquinariaVial;
