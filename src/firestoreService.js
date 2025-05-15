import { db } from "./services/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';

//Tractores
export const addTractor = async (tractorData) => {
  try {
    const tractorRef = await addDoc(collection(db, 'tractores'), tractorData);
    console.log("Tractor agregado con ID:", tractorRef.id);
  } catch (error) {
    console.error("Error al agregar tractor:", error);
  }
};


export const getTractores = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'tractores'));
    const tractores = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return tractores;
  } catch (error) {
    console.error("Error al obtener los tractores:", error);
    return [];
  }
};


export const getTractorById = async (tractorId) => {
  try {
    const tractorDoc = await getDoc(doc(db, 'tractores', tractorId));
    if (tractorDoc.exists()) {
      return { id: tractorDoc.id, ...tractorDoc.data() };
    } else {
      console.log("No se encontró el tractor con ID:", tractorId);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el tractor por ID:", error);
    return null;
  }
};


export const deleteTractor = async (tractorId) => {
  try {
    await deleteDoc(doc(db, 'tractores', tractorId));
    console.log("Tractor eliminado con ID:", tractorId);
  } catch (error) {
    console.error("Error al eliminar tractor:", error);
  }
};


export const updateTractor = async (tractorId, updatedData) => {
  try {
    const tractorRef = doc(db, 'tractores', tractorId);
    await updateDoc(tractorRef, updatedData);
    console.log("Tractor actualizado con ID:", tractorId);
  } catch (error) {
    console.error("Error al actualizar tractor:", error);
  }
};

//Repuestos

export const addRepuesto = async (repuestoData) => {
  const repuestosCollection = collection(db, 'repuestos');
  await addDoc(repuestosCollection, repuestoData);
};

export const getRepuestos = async () => {
  const repuestosCollection = collection(db, 'repuestos');
  const repuestosSnapshot = await getDocs(repuestosCollection);
  return repuestosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


export const deleteRepuesto = async (repuestoId) => {
  const repuestoDoc = doc(db, 'repuestos', repuestoId);
  await deleteDoc(repuestoDoc);
};

//Implementos

export const getImplementos = async () => {
  const implementosCollection = collection(db, 'implementos');
  const implementosSnapshot = await getDocs(implementosCollection);
  return implementosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addImplementos = async (implementosData) => {
  const implementosCollection = collection(db, 'implementos');
  await addDoc(implementosCollection, implementosData);
};



export const deleteImplementos = async (implementosId) => {
  const implementosDoc = doc(db, 'implementos', implementosId);
  await deleteDoc(implementosDoc);
};
