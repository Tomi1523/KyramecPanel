import { useState, useEffect } from 'react';
import { addTractor, getTractores, deleteTractor, updateTractor, fetchTractorById } from '../firestoreService';

export const useTractores = () => {
  const [tractores, setTractores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTractores = async () => {
      try {
        const tractoresData = await getTractores();
        setTractores(tractoresData);
      } catch (err) {
        setError("Error al obtener los tractores.");
      } finally {
        setLoading(false);
      }
    };

    fetchTractores();
  }, []);

  const handleAddTractor = async (tractorData) => {
    try {
      await addTractor(tractorData);
      const updatedTractores = await getTractores();
      setTractores(updatedTractores);
    } catch (err) {
      setError("Error al agregar tractor.");
    }
  };

  const handleDeleteTractor = async (tractorId) => {
    try {
      await deleteTractor(tractorId);
      const updatedTractores = await getTractores();
      setTractores(updatedTractores);
    } catch (err) {
      setError("Error al eliminar tractor.");
    }
  };

  const handleUpdateTractor = async (tractorId, updatedData) => {
    try {
      await updateTractor(tractorId, updatedData);
      const updatedTractores = await getTractores();
      setTractores(updatedTractores);
    } catch (err) {
      setError("Error al actualizar tractor.");
    }
  };

  const getTractorById = async (id) => {
    return await fetchTractorById(id);
  };

  return {
    tractores,
    loading,
    error,
    handleAddTractor,
    handleDeleteTractor,
    handleUpdateTractor,
    getTractorById 
  };
};
