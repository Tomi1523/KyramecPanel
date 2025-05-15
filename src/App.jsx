import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Login from './Componentes/Login';
import ItemSelector from './Componentes/ItemSelector';
import TractorList from './Componentes/ListTodo/TractorList';
import Opciones from './Componentes/Opciones';
import MaquinaraVialTractoresList from './Componentes/ListTodo/MaquinaraVialTractoresList';
import RepuestosList from './Componentes/ListTodo/RepuestosList';
import TecnologiaList from './Componentes/ListTodo/TecnologiaList';
import ImplementosAgricolasList from './Componentes/ListTodo/ImplementosAgricolasList';
import ImplementosVialesList from './Componentes/ListTodo/ImplementosVialesList';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

       
        <Route path="/" element={user ? <ItemSelector /> : <Navigate to="/login" />} />
        <Route path="/opciones" element={user ? <Opciones /> : <Navigate to="/login" />} />
        <Route path="/opciones/tractores" element={user ? <TractorList /> : <Navigate to="/login" />} />
        <Route path="/opciones/maquinariavial" element={user ? <MaquinaraVialTractoresList /> : <Navigate to="/login" />} />
        <Route path="/opciones/repuestos" element={user ? <RepuestosList /> : <Navigate to="/login" />} />
        <Route path="/opciones/tecnologias" element={user ? <TecnologiaList /> : <Navigate to="/login" />} /> 
         <Route path="/opciones/implementos-agricolas" element={user ? <ImplementosAgricolasList /> : <Navigate to="/login" />} />
         <Route path="/opciones/implementos-viales" element={user ? <ImplementosVialesList /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
