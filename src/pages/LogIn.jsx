import '../css/LogIn.css'
import loginLogo from '../imgs/loginLogo.png'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom';
import { useState } from 'react'
import Cookies from 'universal-cookie';

// Página de inicio de sesión

function LogIn () {
    
  const cookies = new Cookies;

  // Si hay una sesión iniciada, redirigir al Dashboard
  const componentDidMount = () => {
    if(cookies.get('orgid')) {
      window.location.href='./dashboard';
    }
  }

  // Variables y funciones para la recuperación de los valores ingresados
  // en el formulario 
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const handleChangeUser = async (e) => {
    setUser(e.target.value)
  };
  const handleChangePwd = async (e) => {
    setPwd(e.target.value)
  };

  // Función para el inicio de sesión
  const logIn = async (e) => {
    e.preventDefault();
    let adminData = {
      "username": user,
      "password": pwd
    }
    // Validación de entradas en el formulario
    if (user == "" || user == null) {
      alert("Ingresar usuario");
      return;
    }
    if (pwd == "" || pwd == null) {
      alert("Ingresar contraseña");
      return;
    }
    // Solicitud al API para la autenticación del usuario
    fetch(`${URL}admins/login`, {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(adminData)
    })
    .then((response) => response.json())
    .then((result) => {
      {/* Si el usuario no está registrado, notificar */}
      if (result[0].message == "User not found") {
        alert("Usuario no encontrado");
      {/* Si la contraseña es incorrecta, notificar*/}
      } else if (result[0].message == "Not allowed") {
        alert("Contraseña incorrecta");
      {/* Si el usuario es autenticado, guardar cookies esenciales y recuperar datos de la empresa */}
      } else if (result[0].id > 0) {
        cookies.set('username', result[0].username, {path: "/"});
        cookies.set('orgid', result[0].organizationid, {path: "/"})
        alert("Bienvenido(a) " + result[0].username);

        // Recuperación de datos de la empresa
        fetch(`${URL}progress/total/progress/${cookies.get('orgid')}`)
        .then((resp) => resp.json())
        .then((newResult) => {
          if (newResult[0].totalProgress == null) {
            cookies.set('totalProgress', 0, {path: "/"});
            cookies.set('totalEmp', 1, {path: "/"});
          } else {
            cookies.set('totalProgress', newResult[0].totalProgress, {path: "/"});
            cookies.set('totalEmp', newResult[0].totalEmp, {path: "/"});
          }
          window.location.href='./dashboard'
        })
        .catch((err) => {
          console.error("Error", err);
        })
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  }
  
  return (
    <body>
      {componentDidMount()};
      <br></br>
      <div class="imgcontainer">
        <img src={loginLogo} class="centerlogo" height="250" width="250" />
      </div>
      <br/>
      <form class="logger">
        <div class="container">
          <input
            type="text" placeholder="Usuario" name="uname" class="inputUser"
            style={{ width: "350px", height: "35px",}} onChange={handleChangeUser}
            value={user} required
          />
          <br/><br/>
          <input
            type="password" placeholder="Contraseña" name="psw" class="inputPassword"
            style={{ width: "350px", height: "35px",}} onChange={handleChangePwd}
            value={pwd} required
          />
          <br/><br/>
          <button onClick={logIn} style={{ width: "300px", height: "35px",}}>
            Iniciar sesión
          </button>
          <br/><br/>
        </div>
      </form>
      <div class="container">
        <Link as={Link} to={"/signadmin"}>
          <button style={{ width: "300px", height: "35px",}}>
            Registrar administrador
          </button>
        </Link>
        <br/><br/>
        <Link as={Link} to={"/signenterprise"}>
          <button style={{ width: "300px", height: "35px",}}>
            Registrar empresa
          </button>
        </Link>
        <br/><br/><br/><br/>
      </div>
      <Footer />
    </body>
  )
}

export default LogIn;