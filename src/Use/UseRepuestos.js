// useRepuestos.js
import { useState, useEffect } from 'react';
import { addRepuesto, getRepuestos, deleteRepuesto, editRepuesto, fetchRepuestoById } from '../firestoreService';

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

    const handleEditRepuesto = async (repuestoId, updatedData) => {
    try {
      await editRepuesto(repuestoId, updatedData);
      const updatedRepuestos = await getRepuestos();
      setRepuestos(updatedRepuestos);
    } catch (err) {
      setError("Error al editar repuesto.");
    }
  };

const getRepuestoById = async (id) => {
    try {
      return await fetchRepuestoById(id); 
    } catch (error) {
      console.log("Error en getRepuestoById del hook:", error);
      setError("Error al obtener el repuesto por ID.");
      return null;
    }
  };

  return { repuestos, loading, error, handleAddRepuesto, handleDeleteRepuesto, handleEditRepuesto, getRepuestoById };
};
