import '../css/Dashboard.css'
import '../css/Modal.css'
import React from 'react';
import { useState } from 'react';
import loginLogo from '../imgs/loginLogo.png'
import buildings from '../imgs/buildings.png'
import workers from '../imgs/workers.png'
import { Link } from 'react-router-dom';
import Footer from '../components/Footer'
import Cookies from 'universal-cookie'

// Página de Dashboard

function Dashboard () {

  // Recuperación de cookies almacenadas tras inicio de sesión
  const cookies = new Cookies();
  const orgid = cookies.get('orgid');
  const totalProgress = Math.trunc(cookies.get('totalProgress')/cookies.get('totalEmp')/3);

  // Variables para el manejo de datos de los empleados y empresa
  let [empData, setEmpData] = React.useState([{}]);
  const [companyData, setCompanyData] = React.useState([{}]);

  // Variables para la notificación de estado y errores
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  // Variables para el filtrado de usuarios
  const [filteredResults, setFilteredResults] = React.useState([]);
  const [searchInput, setSearchInput] = React.useState('');

  // Variables y funciones para la recuperación de datos del formulario de cambio de contraseña
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const handleChangeUser = async (e) => {
    setUser(e.target.value)
  };
  const handleChangePwd = async (e) => {
    setPwd(e.target.value)
  };

  // Recuperación de datos de los empleados
  React.useEffect(() => {
    fetch(`${URL}employees/alldatabyorg/${orgid}`)
    .then((resp) => {
      return resp.json();
    })
    .then((json) => {
      setEmpData(json);
      setFilteredResults(json);
      setError("");
    })
    .catch((err) => {
      setError(err);
      setData(null);
    })
    .finally(() => {
      setLoading(false)
    })
  }, [])

  // Recuperación de datos de la empresa
  React.useEffect(() => {
    fetch(`${URL}organizations/byid/${orgid}`)
    .then((resp) => {
      return resp.json();
    })
    .then((json) => {
      setCompanyData(json);
      setError("");
    })
    .catch((err) => {
      setError(err);
      setCompanyData(null);
    })
    .finally(() => {
      setLoading(false)
    })
  }, [])

  // Asignación de valores a la gráfica del dashboard
  React.useEffect(() => {
    // Recuperación de la gráfica dentro del cuerpo de la página
    let circularProgress = document.querySelector(".circular-progress"),
    progressValue = document.querySelector(".progress-value");
    // Parámetros para la animación de la gráfica
    let progressStartValue = -1,
    progressEndValue = totalProgress,
    speed = 10;
    // Función para la animación de la gráfica
    let progress = setInterval(() => {
      progressStartValue++;
      progressValue.textContent = `${progressStartValue}%`
      circularProgress.style.background = `conic-gradient(black ${progressStartValue * 3.6}deg, white 0deg)`
      if(progressStartValue == progressEndValue){
        clearInterval(progress);
      }
    }, speed);
  }, [])

  // Recuperación de elementos del componente modal para el cambio de contraseñas
  React.useEffect(() => {
    // Recuperación del modal
    var modal = document.getElementById("myModal");
    // Recuperación del botón para abrir el modal
    var btn = document.getElementById("myBtn");
    // Recuperación del elemento para el cierre del modal
    var span = document.getElementsByClassName("close")[0];
    
    // Función para abrir el modal al dar clic en el botón
    btn.onclick = function() {
      modal.style.display = "block";
    }
    // Función para el cierre del modal
    span.onclick = function() {
      modal.style.display = "none";
    }
    // Función para el cierre del modal al dar clic fuera de él
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  }, []);

  // Función para el filtrado de usuarios
  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    if (searchInput !== '') {
      const filteredData = empData.filter((user) => {
          return Object.values(user).join('').toLowerCase().includes(searchInput.toLowerCase());
      })
      setFilteredResults(filteredData);
    } else {
      setFilteredResults(empData);
    }
  }

  // Si no hay una sesión iniciada, regresar al inicio de sesión
  const componentDidMount = () => {
    if (!orgid) {
      window.location.href='./';
    }
  }

  // Función para el cierre de sesión
  const logOut = () => {
    cookies.remove('orgid', {path: '/'});
    cookies.remove('username', {path: '/'});
    window.location.href='./';
  }

  // Función para el cambio de contraseñas de los empleados
  const changePassword = async (e) => {
    e.preventDefault();
    let userData = {
      "username": user,
      "password": pwd
    }
    // Validación de entradas
    if (user == "" || user == null) {
      alert("Ingresar usuario");
      return;
    }
    if (pwd == "" || pwd == null) {
      alert("Ingresar contraseña");
      return;
    }
    // Envío de solicitud al API
    fetch(`${URL}admins/setnewpwd`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
    })
    .then((response) => response.json())
    .then((result) => {
      if (result[0].affectedRows == -1) {
        alert("Usuario no encontrado");
      } else if (result[0].affectedRows == 1) {
        alert("Se ha cambiado la contraseña del usuario " + user + " a " + pwd);
        window.location.href='./dashboard';
      } else {
        alert("Error al cambiar contraseña");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  }

  return (
    <body>
      {componentDidMount()};
      
      {/* Componente modal */}
      <div id="myModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <span class="close">&times;</span>
            <h2>Cambiar contraseña a empleado</h2>
          </div>
          <div class="modal-body">
            <br/><br/>
            <form class="register">
              <input
                type="text" placeholder="Nombre de usuario" name="uname"
                class="inputUser" style={{ width: "400px", height: "50px",}}
                onChange={handleChangeUser} value={user} required
              />
              <br/><br/><br/>
              <input
                type="password" placeholder="Nueva contraseña" name="psw"
                class="inputPassword" style={{ width: "400px", height: "50px",}}
                onChange={handleChangePwd} value={pwd} required
              />
              <br/><br/><br/>
              <button onClick={changePassword} style={{ width: "300px", height: "40px", }}>
                Cambiar contraseña
              </button>
              <br/><br/><br/><br/>
            </form>
          </div>
          <div class="modal-footer">
            <h3></h3>
          </div>
        </div>
      </div>

      {/* Header de la página de Dashboard */}
      <div class="header" style={{ backgroundColor: "black"}}>
        <br/>
        <Link as={Link} to="#" class="headerLogo"><img src={loginLogo} /></Link>
        <div style={{ float: "right" }} class="rightbt">
          <button class="headerButton" onClick={logOut} style={{ width: "150px", height: "40px",}}>
            Cerrar sesión
          </button>
        </div>
        <br/><br/>
      </div>

      {/* Gráfica de progreso */}
      <div style={{ float: "right" }} class="rightgraph">
        <br/>
        <span class="text">&nbsp;&nbsp;Progreso global</span>
        <br/><br/><br/><br/>
        <div class="circular-progress">
          <span class="progress-value">0%</span>
        </div>
        <br/><br/>
        {/* Botón para la apertura del componente modal */}
        <button class="modalbtn" id="myBtn" style={{ width: "150px", height: "50px",}}>
          Cambiar contraseña
        </button>
      </div>

      {loading && "Cargando información"}
      {error && <div> {`Error al cargar la información ${error}`} </div>}
      
      {/* Datos básicos de la empresa */}
      <br/>
      <div class="first">
        <img src={buildings} alt="buildings" />
        <h1>{companyData[0].name}</h1>
      </div>
      <br/>
      <div class="second">
        <img src={workers} alt="workers" />
        <h2>Empleados registrados: {empData.length}</h2>
      </div>
      <br/><br/><br/>

      {/* Tabla de usuarios registrados */}
      <div class="scrollable-div">
        <table>
          <tr>
            <th class="search">
              <div class="topnav">
                <div class="search-container">
                  <input onChange={(e) => searchItems(e.target.value)} type="text"
                    placeholder="Buscar" id="the_sb" name="search" style={{ width: "114px"}}
                  />
                </div>
              </div>
            </th>
            <th class="name">Usuario</th>
            <th class="progress">Nivel básico</th>
            <th class="progress">Nivel intermedio</th>
            <th class="progress">Nivel avanzado</th>
            <th class="progress">Progreso total</th>
          </tr>
          {filteredResults.map(({username, level1, level2, level3}) => (
            <tr>
              <th class="blank-mid"></th>
              <td>{username}</td>
              <td>{level1}%</td>
              <td>{level2}%</td>
              <td>{level3}%</td>
              <td>{Math.trunc((level1+level2+level3)/3)}%</td>
            </tr>
          ))}
        </table>
      </div>
      <Footer />
    </body>
  )
}

export default Dashboard;