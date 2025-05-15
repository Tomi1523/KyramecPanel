import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUnlock, faLock } from "@fortawesome/free-solid-svg-icons";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          setErrorMessage("Usuario no encontrado.");
          break;
        case "auth/wrong-password":
          setErrorMessage("Contraseña incorrecta.");
          break;
        case "auth/invalid-email":
          setErrorMessage("Email inválido.");
          break;
        default:
          setErrorMessage("Ocurrió un error al iniciar sesión.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Iniciar sesión</h2>

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleLogin}>
        {/* Email */}
        <div className="row mb-3">
          <div className="col-md-6 mx-auto">
            <label htmlFor="email" className="form-label">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Contraseña */}
        <div className="row mb-3">
          <div className="col-md-6 mx-auto">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-control"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                style={{ width: "45px" }}
              >
                <FontAwesomeIcon icon={showPassword ? faUnlock : faLock} />
              </button>
            </div>
          </div>
        </div>

        {/* Botón */}
        <div className="row mb-3">
          <div className="col-md-6 mx-auto">
            <button type="submit" className="btn btn-primary w-100">
              Ingresar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
