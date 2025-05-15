import React, { useState, useRef } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../services/firebase";
import { useImplementos } from "../../Use/UseImplementos";

const AddImplementosViales = ({ subcategoria, categoria }) => {
    const { handleAddImplementos } = useImplementos(); 
    const [submitting, setSubmitting] = useState(false);
    const [title, setTitle] = useState("");
    const [imageFiles, setImageFiles] = useState([]);
    const [pdfFile, setPdfFile] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [extraFields, setExtraFields] = useState([""]);
    const [text, setText] = useState("");
    const imageInputRef = useRef(null);
    const pdfInputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);

            let imageUrls = [];
            let pdfUrl = "";

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
                title,
                imageUrls,
                pdfUrl,
                categoria,
                subcategoria,
                extraFields,
                text
            };

            await handleAddImplementos(implementoData); 

         
            setTitle("");
            setImageFiles([]);
            setPdfFile(null);
            setText("");
          
            if (imageInputRef.current) {
                imageInputRef.current.value = "";
            }
            if (pdfInputRef.current) {
                pdfInputRef.current.value = "";
            }

            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
        } catch (error) {
            console.error("Error al subir archivos o guardar implemento:", error);
            alert("Ocurrió un error al guardar el implemento. Por favor, intentá nuevamente.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddField = () => {
        setExtraFields([...extraFields, ""]);
    };

    const handleFieldChange = (index, value) => {
        const updatedFields = [...extraFields];
        updatedFields[index] = value;
        setExtraFields(updatedFields);
    };

    function formatearSubcategoria(str) {
        return str
          .replace(/-/g, ' ') 
          .split(' ')         
          .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()) 
          .join(' ');         
      }
      

    return (
        <div className="container py-4">
           <h2 className="mb-4">Agregar {formatearSubcategoria(subcategoria)}</h2>
           
            <form onSubmit={handleSubmit} className="mb-5">
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
                    <label className="form-label">Descripción</label>
                    <textarea
                        className="form-control"
                        placeholder="Descripción"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Campos adicionales</label>
                    {extraFields.map((field, index) => (
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

export default AddImplementosViales;
