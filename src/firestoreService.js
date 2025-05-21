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


export const fetchTractorById = async (id) => {
  try {
    const docRef = doc(db, 'tractores', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.warn("No se encontró el tractor con ese ID.");
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

export const editRepuesto = async (repuestoId, updatedData) => {
  const repuestoDoc = doc(db, 'repuestos', repuestoId);
  await updateDoc(repuestoDoc, updatedData);
};

export const fetchRepuestoById  = async (repuestoId) => {
  try {
    const repuestoDoc = doc(db, 'repuestos', repuestoId);
    const repuestoSnap = await getDoc(repuestoDoc);
    if (repuestoSnap.exists()) {
      return { id: repuestoSnap.id, ...repuestoSnap.data() };
    } else {
      console.warn("Repuesto no encontrado en Firestore");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el repuesto:", error);
    throw error;
  }
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
