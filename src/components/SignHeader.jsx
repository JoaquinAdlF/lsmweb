import { Link } from 'react-router-dom';
import loginLogo from '../imgs/loginLogo.png'

// Componente Header. Permite ser importado en la parte superior
// de cualquier página de la aplicación 

function SignHeader () {
  return (
    <div style={{ backgroundColor: "black"}}>
      <br />
      <div class="header">
        <Link as={Link} to={"/"} class="headerLogo"><img src={loginLogo} /></Link>
      </div>
      <br />
    </div>
  )
}

export default SignHeader;