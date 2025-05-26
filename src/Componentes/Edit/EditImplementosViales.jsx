import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useImplementos } from '../../Use/UseImplementos';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../../services/firebase";

const EditImplementosViales = () => {
  const { id } = useParams();
  const { getImplementoById, handleEditImplemento, loading } = useImplementos();
  const [implemento, setImplemento] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    imageUrls: [],
    pdfUrl: '',
    categoria: '',
    subcategoria: '',
    extraFields: [''],
    text: '',
    precioIVA: { moneda: "", valor: "" }
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  useEffect(() => {
    getImplementoById(id)
      .then(data => {
        setImplemento(data);
        setFormData({
          title: data.title,
          imageUrls: data.imageUrls || [],
          pdfUrl: data.pdfUrl || '',
          categoria: data.categoria || '',
          subcategoria: data.subcategoria || '',
          extraFields: data.extraFields || [''],
          text: data.text || '',
          precioIVA: data.precioIVA || { moneda: "", valor: "" }
        });
      })
      .catch(err => console.error("Error al obtener implemento", err));
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

    try {
      let imageUrls = [...formData.imageUrls];
      let pdfUrl = formData.pdfUrl;

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

      const updatedFormData = {
        ...formData,
        imageUrls,
        pdfUrl
      };

      await handleEditImplemento(id, updatedFormData);
      setShowAlert(true);
    } catch (error) {
      console.error("Error al actualizar implemento:", error);
      alert("Ocurrió un error al actualizar el implemento. Por favor, intentá nuevamente.");
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
      <h2 className="mb-4">Editar Implemento Vial</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Título</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="text" className="form-label">Descripción</label>
          <textarea
            id="text"
            name="text"
            className="form-control"
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
            <label className="form-label">Imágenes Existentes</label>
            {formData.imageUrls.map((imageUrl, index) => (
              <div key={index} className="col-3 mb-4">
                <img
                  src={imageUrl}
                  alt={`existing-${index}`}
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
        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
        {showAlert && (
          <div className="alert alert-info mt-2" role="alert">
            ¡Producto actualizado correctamente!
          </div>
        )}
      </form>
    </div>
  );
};

export default EditImplementosViales;
