// useRepuestos.js
import { useState, useEffect } from 'react';
import { addRepuesto, getRepuestos, deleteRepuesto } from '../firestoreService';

export const useRepuestos = () => {
  const [repuestos, setRepuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepuestos = async () => {
      try {
        const repuestosData = await getRepuestos();
        setRepuestos(repuestosData);
      } catch (err) {
        setError("Error al obtener los repuestos.");
      } finally {
        setLoading(false);
      }
    };

    fetchRepuestos();
  }, []);

  const handleAddRepuesto = async (repuestoData) => {
    try {
      await addRepuesto(repuestoData);
      const updatedRepuestos = await getRepuestos();
      setRepuestos(updatedRepuestos);
    } catch (err) {
      setError("Error al agregar repuesto.");
    }
  };

  const handleDeleteRepuesto = async (repuestoId) => {
    try {
      await deleteRepuesto(repuestoId);
      const updatedRepuestos = await getRepuestos();
      setRepuestos(updatedRepuestos);
    } catch (err) {
      setError("Error al eliminar repuesto.");
    }
  };

  return { repuestos, loading, error, handleAddRepuesto, handleDeleteRepuesto };
};
