import Header from '../components/SignHeader'
import Footer from '../components/Footer'
import '../css/SignUp.css'
import { useState } from 'react'
import Cookies from 'universal-cookie'

// Página de registro de administrador

function SignUpAdmin () {
  const cookies = new Cookies;

  // Si hay una sesión iniciada, redirigir al Dashboard
  const componentDidMount = () => {
    if(cookies.get('orgid')) {
      window.location.href='./dashboard'
    }
  }
  // Variables y funciones para la recuperación de datos del formulario
  const [user, setUser] = useState();
  const [email, setEmail] = useState();
  const [pwd, setPwd] = useState();
  const [cname, setCname] = useState();
  const [cpwd, setCpwd] = useState();
  const handleChangeUser = async (e) => {
    setUser(e.target.value)
  };
  const handleChangeEmail = async (e) => {
    setEmail(e.target.value)
  };
  const handleChangePwd = async (e) => {
    setPwd(e.target.value)
  };
  const handleChangeCname = async (e) => {
    setCname(e.target.value)
  };
  const handleChangeCpwd = async (e) => {
    setCpwd(e.target.value)
  };
  // Función para el registro de un administrador
  const addAdmin = async (e) => {
    e.preventDefault();
    let adminData = {
      "username": user,
      "email": email,
      "password": pwd,
      "companyname": cname,
      "companycode": cpwd
    }
    // Validación de entradas del usuario
    if (user == "" || user == null) {
      alert("Ingresar usuario");
      return;
    }
    if (email == "" || email == null) {
      alert("Ingresar correo electrónico");
      return;
    }
    if (pwd == "" || pwd == null) {
      alert("Ingresar contraseña");
      return;
    }
    if (cname == "" || cname == null) {
      alert("Ingresar clave de empresa");
      return;
    }
    if (cpwd == "" || cpwd == null) {
      alert("Ingresar clave de empresa");
      return;
    }
    if (!email.match(/(?=.*[@])/)) {
      alert("Correo electrónico no válido");
      return;
    }
    if (pwd.length < 8 || pwd.length > 16) {
      alert("La contraseña requiere de 8 a 16 caracteres");
      return;
    }
    if (!pwd.match(/(?=.*[A-Z])/)) {
      alert("La contraseña requiere mayúsculas");
      return;
    }
    if (!pwd.match(/(?=.*[a-z])/)) {
      alert("La contraseña requiere minúsculas");
      return;
    }
    if (!pwd.match(/(?=.*[!@#$%^&*])/)) {
      alert("La contraseña requiere caracteres especiales (!@#$%^&*)");
      return;
    }
    
    // Envía de solicitud al API para el registro de un administrador
    fetch(`${URL}admins/add`, {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(adminData)
    })
    .then((response) => response.json())
    .then((result) => {
      if (result.message == "Company not found") {
        alert("Companía no encontrada");
      } else if (result.message == "User already exists") {
        alert("Usuario ya registrado");
      } else if (result.insertId > 0) {
        alert("Registro exitoso");
        window.location.href='./'
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
      <br/><br/><br/>
      <div class="registerBox">
        <h1 class="registerTitle">Registrar administrador</h1>
        <form class="register">
          <input
            type="text" placeholder="Usuario" name="uname" class="inputUser"
            style={{ width: "400px", jeight: "50px",}} onChange={handleChangeUser}
            value={user} required
          />
          <br/><br/>
          <input
            type="email" placeholder="Correo electrónico" name="email"
            class="inputUser" style={{ width: "400px", jeight: "50px",}}
            onChange={handleChangeEmail} value={email} required
          />
          <br/><br/>
          <input
            type="password" placeholder="Contraseña" name="psw" class="inputPassword"
            style={{ width: "400px", jeight: "50px",}} onChange={handleChangePwd}
            value={pwd} required
          />
          <br/><br/>
          <input
            type="text" placeholder="Nombre de empresa" name="ename"
            class="inputUser" style={{ width: "400px", jeight: "50px",}}
            onChange={handleChangeCname} value={cname} required
          />
          <br/><br/>
          <input
            type="password" placeholder="Clave de empresa" name="psw"
            class="inputPassword" style={{ width: "400px", jeight: "50px",}}
            onChange={handleChangeCpwd} value={cpwd} required
          />
          <br/><br/>
          <div class="btcontainer">
            <button onClick={addAdmin} style={{ width: "300px", height: "40px",}}>
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

export default SignUpAdmin;