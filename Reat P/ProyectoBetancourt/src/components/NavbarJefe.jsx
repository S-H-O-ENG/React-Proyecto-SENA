import logo from '../assets/logo.png';
import '../App.css';

{/*Qué hace: Define la función del componente y recibe tres herramientas externas (props) mediante destructuración.
    Cómo funciona:vistaActual: Es la variable que dice qué página está abierta (ej. 'Pedidos').
    setVistaActual: Es la función para cambiar esa página cuando haces clic.
    children: Es una propiedad especial de React que representa todo el contenido que metas dentro de las etiquetas <NavbarJefe> ... </NavbarJefe> en el otro archivo. */}
function NavbarJefe({ vistaActual, setVistaActual, children }) {
    return (
        <>
            
            <header className="header-principal navbar navbar-expand-lg">
                <div className="container-fluid container-header">

                    <div className="logo-marca-wrapper d-flex align-items-center">
                        <img src={logo} alt="Logo Taller" className="logo-header me-2" />
                        <h1 className="marca m-0">TALLER DE BETANCOURT</h1>
                    </div>

                    <button className="navbar-toggler custom-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <nav className="collapse navbar-collapse navegar" id="navbarNav">
                        <ul className="navbar-nav ms-auto align-items-center">
                            <li className="nav-item">
                                {/* className={...}: Evalúa si vistaActual es exactamente igual a 'Proveedores'. Si es verdad, le añade la clase CSS active para resaltar el texto (ponerlo en negrita o cambiarle el color); si no, la deja vacía.style={{...}}: Quita los bordes y fondos grises por defecto que tienen los botones HTML para que parezca un enlace de texto limpio, y añade la "manito" al pasar el cursor (cursor: 'pointer').onClick={() => setVistaActual('Proveedores')}: Al hacer clic, ejecuta la función del padre y actualiza el estado global a 'Proveedores'.*/}
                                <button
                                    className={`nav-link ${vistaActual === 'Proveedores' ? 'active' : ''}`}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                    onClick={() => setVistaActual('Proveedores')}
                                >
                                    Proveedores
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${vistaActual === 'Pedidos' ? 'active' : ''}`}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                    onClick={() => setVistaActual('Pedidos')}
                                >
                                    Pedidos
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header >

            
            <main>
                {children}
            </main>
        </>
    );
}

export default NavbarJefe;
