import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Login from './Componentes/Login';
import ItemSelector from './Componentes/ItemSelector';
import TractorList from './Componentes/ListTodo/ParteDeMaquinariasAgricolas/TractorList';
import Opciones from './Componentes/Opciones';
import MaquinaraVialTractoresList from './Componentes/ListTodo/MaquinaraVialTractoresList';
import RepuestosList from './Componentes/ListTodo/RepuestosList';
import TecnologiaList from './Componentes/ListTodo/TecnologiaList';
import ImplementosAgricolasList from './Componentes/ListTodo/ImplementosAgricolasList';
import ImplementosVialesList from './Componentes/ListTodo/ImplementosVialesList';
import EditRepuesto from './Componentes/Edit/EditRepuesto';
import EditMaquinariaVial from './Componentes/Edit/EditMaquinariaVial';
import MaquinariasAgricolasOpciones from './Componentes/ListTodo/MaquinariasAgricolasOpciones';
import SembradoraList from './Componentes/ListTodo/ParteDeMaquinariasAgricolas/SembradoraList';
import PulverizadorasList from './Componentes/ListTodo/ParteDeMaquinariasAgricolas/PulverizadorasList';
import TolvasList from './Componentes/ListTodo/ParteDeMaquinariasAgricolas/TolvasList';
import EditSembradora from './Componentes/Edit/EditTractores/EditSembradora';
import EditTractor from './Componentes/Edit/EditTractores/EditTractor';
import EditPulverizadora from './Componentes/Edit/EditTractores/EditPulverizadora';
import EditTolvas from './Componentes/Edit/EditTractores/EditTolvas';
import EditImplementosAgricolas from './Componentes/Edit/EditImplementosAgricolas';
import EditImplementosViales from './Componentes/Edit/EditImplementosViales';
import EditTecnologia from './Componentes/Edit/EditTecnologia';

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

 if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />


        <Route path="/" element={user ? <ItemSelector /> : <Navigate to="/login" />} />
        <Route path="/opciones" element={user ? <Opciones /> : <Navigate to="/login" />} />
        <Route path="/opciones/maquinarias-agricolas" element={user ? <MaquinariasAgricolasOpciones /> : <Navigate to="/login" />} />
        <Route path="/opciones/maquinarias-agricolas/tractores" element={user ? <TractorList /> : <Navigate to="/login" />} />
        <Route path="/opciones/maquinarias-agricolas/sembradoras" element={user ? <SembradoraList /> : <Navigate to="/login" />} />
        <Route path="/opciones/maquinarias-agricolas/pulverizadoras" element={user ? <PulverizadorasList /> : <Navigate to="/login" />} />
        <Route path="/opciones/maquinarias-agricolas/tolvas" element={user ? <TolvasList /> : <Navigate to="/login" />} />
        <Route path="/opciones/maquinarias-agricolas/tractores/:id" element={user ? <EditTractor /> : <Navigate to="/login" />} />
        <Route path="/opciones/maquinarias-agricolas/sembradora/:id" element={user ? <EditSembradora /> : <Navigate to="/login" />} />
        <Route path="/opciones/maquinarias-agricolas/pulverizadora/:id" element={user ? <EditPulverizadora /> : <Navigate to="/login" />} />
        <Route path="/opciones/maquinarias-agricolas/tolva/:id" element={user ? <EditTolvas /> : <Navigate to="/login" />} />

        <Route path="/opciones/maquinariavial" element={user ? <MaquinaraVialTractoresList /> : <Navigate to="/login" />} />
        <Route path="/opciones/repuestos" element={user ? <RepuestosList /> : <Navigate to="/login" />} />
        <Route path="/opciones/tecnologias" element={user ? <TecnologiaList /> : <Navigate to="/login" />} />
        <Route path="/opciones/implementos-agricolas" element={user ? <ImplementosAgricolasList /> : <Navigate to="/login" />} />
        <Route path="/opciones/implementos-agricolas/:id" element={user ? <EditImplementosAgricolas /> : <Navigate to="/login" />} />
        <Route path="/opciones/implementos-viales" element={user ? <ImplementosVialesList /> : <Navigate to="/login" />} />
        <Route path="/opciones/repuestos/:id" element={user ? <EditRepuesto /> : <Navigate to="/login" />} />
        <Route path="/opciones/implemento-vial/:id" element={user ? <EditImplementosViales /> : <Navigate to="/login" />} />
        <Route path="/opciones/tecnologia/:id" element={user ? <EditTecnologia /> : <Navigate to="/login" />} />

        <Route path="/opciones/maquinariavial/:id" element={user ? <EditMaquinariaVial /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
