// useImplementos.js
import { useState, useEffect } from 'react';
import { addImplementos, getImplementos, deleteImplementos, editImplemento, fetchImplementoById } from '../firestoreService';

export const useImplementos = () => {
  const [implementos, setImplementos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImplementos = async () => {
      try {
        const implementosData = await getImplementos();
        setImplementos(implementosData);
      } catch (err) {
        setError("Error al obtener los implementos.");
      } finally {
        setLoading(false);
      }
    };

    fetchImplementos();
  }, []);

  const handleAddImplementos = async (implementosData) => {
    try {
      await addImplementos(implementosData);
      const updatedImplementos = await getImplementos();
      setImplementos(updatedImplementos);
    } catch (err) {
      setError("Error al agregar implemento.");
    }
  };

  const handleDeleteImplementos = async (implementosId) => {
    try {
      await deleteImplementos(implementosId);
      const updatedImplementos = await getImplementos();
      setImplementos(updatedImplementos);
    } catch (err) {
      setError("Error al eliminar implemento.");
    }
  };

  const handleEditImplemento = async (implementoId, updatedData) => {
    try {
      await editImplemento(implementoId, updatedData);
      const updatedImplementos = await getImplementos();
      setImplementos(updatedImplementos);
    } catch (err) {
      setError("Error al editar implemento.");
    }
  };

  const getImplementoById = async (id) => {
    try {
      return await fetchImplementoById(id);
    } catch (error) {
      console.log("Error en getImplementoById del hook:", error);
      setError("Error al obtener el implemento por ID.");
      return null;
    }
  };

  return { implementos, loading, error, handleAddImplementos, handleDeleteImplementos, handleEditImplemento, getImplementoById };
};
