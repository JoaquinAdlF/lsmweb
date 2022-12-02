import LogIn from './pages/LogIn';
import SignUpAdmin from './pages/SignUpAdmin'
import SignUpEnterprise from './pages/SignUpEnterprise'
import Dashboard from './pages/Dashboard';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom"

// Dominio base del API
window.URL = "https://lsmsystem-api.vercel.app/";

// Aplicación principal. En esta se establece el ruteo de las páginas

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' element={<LogIn />} />
          <Route path='/signadmin' element={<SignUpAdmin />} />
          <Route path='/signenterprise' element={<SignUpEnterprise />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;
