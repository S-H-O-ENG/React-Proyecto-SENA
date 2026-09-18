import { BrowserRouter, NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../App.css';


function NavbarJefe() {
    return (
        <BrowserRouter>
            <header className="header-principal navbar navbar-expand-lg">
                <div className="container-fluid container-header">

                    <div className="logo-marca-wrapper d-flex align-items-center">
                        <img src={logo} alt="Logo Taller" className="logo-header me-2" />
                        <h1 className="marca m-0">TALLER DE BETANCOURT</h1>
                    </div>

                    <button className="navbar-toggler custom-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                        aria-="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <nav className="collapse navbar-collapse navegar" id="navbarNav">
                        <ul className="navbar-nav ms-auto align-items-center">
                            <NavLink className='nav-link' to='/Inicio'>Inicio</NavLink>
                            <NavLink className='nav-link' to='/Pedidos'>Pedidos</NavLink>
                            <NavLink className='nav-link' to='/ProveedoresGestion'>Gestion De Proveedores</NavLink>

                            <li className="nav-item">
                                <button className="btn btn-login-nav" data-bs-toggle="modal" data-bs-target="#loginModal">Cerrar Sesion
                                </button>
                            </li>
                        </ul>
                    </nav>

                </div>

            </header>
        </BrowserRouter>
    )
}

export default NavbarJefe;