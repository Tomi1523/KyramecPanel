// useImplementos.js
import { useState, useEffect } from 'react';
import { addImplementos, getImplementos, deleteImplementos } from '../firestoreService';

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

  return { implementos, loading, error, handleAddImplementos, handleDeleteImplementos };
};
