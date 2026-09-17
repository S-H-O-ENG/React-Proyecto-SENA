import { useState } from 'react';
import logoImg from '../assets/logo.png';
import '../css/Inventario.css';

function Inventario() {

    const [productos, setProductos] = useState([]);
    const [formData, setFormData] = useState({

    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const cantidadNum = parseInt(formData.cantidad, 10) || 0;


        let estado = "Activo";
        let claseBadge = "bg-success";

        if (cantidadNum === 0) {
            estado = "Sin Stock";
            claseBadge = "bg-danger";
        } else if (cantidadNum <= 5) {
            estado = "Bajo Stock";
            claseBadge = "bg-warning text-dark";
        }



        setProductos([...productos, nuevoProducto]);



        const modalElement = document.getElementById("modalProducto");
        if (modalElement && window.bootstrap) {
            const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();
        }
    };

    return (
        <>

            <div className="dashboard-layout">
                <aside className="sidebar offcanvas offcanvas-start show" tabIndex="-1" id="sidebarMenu">
                    <div className="sidebar-logo">
                        <img src={logoImg} alt="Logo Taller De Betancourt" />
                        <h2>Taller De Betancourt</h2>
                        <p>Gestión De Inventarios</p>
                    </div>
                    <nav className="sidebar-menu">
                        <a href="/pages/proveedores.html">
                            <i className="fa-solid fa-truck"></i> Proveedores
                        </a>
                        <a href="/pages/Gestion_Clientes.html">
                            <i className="fa-regular fa-user"></i> Clientes
                        </a>
                        <a href="/pages/pedidos.html">
                            <i className="fa-solid fa-semibold fa-clipboard-list"></i> Pedidos
                        </a>
                        <a href="../index.html">
                            <i className="fa-solid fa-arrow-right-from-bracket"></i> Salir
                        </a>
                    </nav>
                </aside>

                <main className="dashboard-main">
                    <header className="topbar">
                        <div>
                            <p>Bienvenido</p>
                        </div>
                        <div className="inventario-info">
                            <i className="fa-solid fa-boxes-stacked"></i>
                            <span>Gestión Inventario</span>
                        </div>
                    </header>

                    <section className="row g-4 mb-4">
                        <div className="col-lg-4 col-md-4">
                            <div className="card-resumen">
                                <i className="fa-solid fa-check-to-slot"></i>
                                <div>
                                    <h3>8</h3>
                                    <p>Productos activos</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-4">
                            <div className="card-resumen">
                                <i className="fa-solid fa-triangle-exclamation"></i>
                                <div>
                                    <h3>4</h3>
                                    <p>Productos Con bajo Stock</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-4">
                            <div className="card-resumen">
                                <i className="fa-solid fa-ban"></i>
                                <div>
                                    <h3>2</h3>
                                    <p>Productos Sin Stock</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <br />

                    <section className="panel-table container-fluid">
                        <div className="cabecera-tabla d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <span>Productos</span>
                            </div>
                            <button className="btn btn-inventario" data-bs-toggle="modal" data-bs-target="#modalProducto">
                                <i className="fa-solid fa-plus"></i> Agregar
                            </button>
                        </div>
                    </section>

                    <br />

                    <div className="tabla-inventario">
                        <table id="tablaProductos" className="table-aling-middle">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre Producto</th>
                                    <th>Cantidad</th>
                                    <th>Estado</th>
                                    <th>Solicitar</th>
                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                    </div>


                    <div className="modal fade" id="modalProducto" tabIndex="-1" aria-labelledby="modalProductoLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content modal-login">
                                <div className="modal-header border-0">
                                    <h2 className="modal-title w-100 text-center" id="modalProductoLabel">
                                        Nuevo Producto
                                    </h2>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form id="formProducto">
                                        <input type="number" className="form-control mb-3" placeholder="ID Trabajador" required />
                                        <input type="text" className="form-control mb-3" placeholder="Nombre" minLength={3} maxLength={20} required />
                                        <input type="email" className="form-control mb-3" placeholder="Ingrese Su Usuario" required />

                                        <input type="number" id="prodId" className="form-control mb-3" placeholder="ID Producto" required />
                                        <input type="text" id="prodNombre" className="form-control mb-3" placeholder="Nombre del Producto" minLength={3} maxLength={20} required />
                                        <input type="number" id="prodCantidad" className="form-control mb-3" placeholder="Cantidad Inicial" min="0" required />

                                        <select defaultValue="" className="form-select mb-4" required>
                                            <option value="" disabled>Seleccione su Cargo</option>
                                            <option value="Jefe">Jefe De Taller</option>
                                            <option value="Mecanico">Mecánico</option>
                                            <option value="Asistente">Asistente General</option>
                                            <option value="Auxiliar">Auxiliar Servicio Al Cliente</option>
                                        </select>

                                        <button type="submit" className="btn btn-guardar w-100">
                                            Guardar Producto
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
export default Inventario;