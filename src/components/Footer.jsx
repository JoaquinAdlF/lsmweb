import '../css/Footer.css'
import itesmLogo from '../imgs/itesm_logo.png'

// Componente Footer. Permite ser importado y colocado en la parte inferior
// de cualquier página de la aplicación.

function Footer () {
  let url="https://tec.mx";
  let element=<a href={url}><img src={itesmLogo} /></a>;
  
  return (
    <footer>
      <br />
      <div class="credits">
        Powered/Developed by
      </div>
      <div class="Developer">
        {element}
      </div>
      <div class="copyright">
        &copy; Copyright 2022 Androids. All rights reserved.
      </div>
      <br />
    </footer>
  )
}

export default Footer;