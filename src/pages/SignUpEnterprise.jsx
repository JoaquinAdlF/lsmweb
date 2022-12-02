import Header from '../components/SignHeader'
import Footer from '../components/Footer'
import '../css/LogIn.css'
import { useState } from 'react'
import Cookies from 'universal-cookie'

// Página de registro de empresa

function SignUpEnterprise () {
  const cookies = new Cookies;

  // Si hay una sesión iniciada, redirigir al Dashboard
  const componentDidMount = () => {
    if(cookies.get('orgid')) {
      window.location.href='./dashboard'
    }
  }

  // Variables y funciones para la recuperación de los valores ingresados
  const [name, setName] = useState();
  const [code, setCode] = useState();
  const handleChangeName = async (e) => {
    setName(e.target.value)
  };
  const handleChangeCode = async (e) => {
    setCode(e.target.value)
  };
  // Función para el registro de una empresa
  const addOrg = async (e) => {
    e.preventDefault();
    let orgData = {
      "name": name,
      "companycode": code
    }
    // Validación de entradas
    if (name == "" || name == null) {
      alert("Ingresar nombre de empresa");
      return;
    }
    if (code == "" || code == null) {
      alert("Ingresar clave");
      return;
    }
    if (code.length < 8 || code.length > 16) {
      alert("La clave requiere de 8 a 16 caracteres");
      return;
    }
    if (!code.match(/(?=.*[A-Z])/)) {
      alert("La clave requiere mayúsculas");
      return;
    }
    if (!code.match(/(?=.*[a-z])/)) {
      alert("La clave requiere minúsculas");
      return;
    }
    if (!code.match(/(?=.*[!@#$%^&*])/)) {
      alert("La clave requiere caracteres especiales (!@#$%^&*)");
      return;
    }
    // Petición al API para el registro de una empresa
    fetch(`${URL}organizations/add`, {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(orgData)
    })
    .then((response) => response.json())
    .then((result) => {
      if (result.message == "Org already exists") {
        alert("Empresa ya registrada");
      } else if (result.insertId > 0) {
        alert("Empresa registrada exitosamente");
        window.location.href='./';
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  }
  
  return (
    <body>
      {componentDidMount()};
      <Header />
      <br/><br/><br/><br/><br/>
      <div class="registerBox">
        <h1 class="registerTitle">&nbsp;&nbsp;&nbsp;&nbsp;Registrar empresa</h1>
        <br/>
        <form class="register">
          <input
            type="text" placeholder="Nombre de la empresa" name="uname"
            class="inputUser" style={{ width: "400px", height: "50px",}}
            onChange={handleChangeName} value={name} required
          />
          <br/><br/><br/>
          <input
            type="password" placeholder="Clave de empresa" name="psw"
            class="inputPassword" style={{ width: "400px", height: "50px",}}
            onChange={handleChangeCode} value={code} required
          />
          <br/><br/><br/>
          <div class="btcontainer">
            <button onClick={addOrg} style={{ width: "300px", height: "40px", }}>
              Registrar
            </button>
            <br/><br/><br/><br/>
          </div>
        </form>
      </div>
      <br/><br/><br/><br/>
      <Footer />
    </body> 
  )
}

export default SignUpEnterprise;