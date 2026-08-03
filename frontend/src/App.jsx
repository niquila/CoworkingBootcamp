import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Salas from "./pages/salas";
import Reservas from "./pages/reservas";
import Perfil from "./pages/perfil";
import AdminSalas from "./pages/admin";

// Componente App: define as rotas principais do aplicativo..
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/salas" element={<Salas />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/admin" element={<AdminSalas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;