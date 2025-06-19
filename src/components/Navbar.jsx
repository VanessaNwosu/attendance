import getchange from "../assets/getchange.png"
import { Link } from "react-router"

const Navbar = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-sm bg-light navbar-light">
  <div className="container-fluid">
    <img src={getchange} width={120} alt='getchange pix' />
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="collapsibleNavbar">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link className="nav-link" to={"/"}>Home</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to={"signup"}>Sign up</Link>
        </li>
        
      </ul>
    </div>
  </div>
</nav>
    </div>
  )
}

export default Navbar
