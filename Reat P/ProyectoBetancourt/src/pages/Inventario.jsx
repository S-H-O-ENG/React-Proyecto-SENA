import { useState } from 'react';
import logoImg from '../assets/logo.png';
import '../css/Inventario.css';

function Inventario() {
    const [productos, setProductos] = useState([]);
    const [formData, setFormData] = useState({
        id: "",
        nombre: "",
        cantidad: ""
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

        // Se crea el objeto antes de guardarlo
        const nuevoProducto = {
            id: formData.id || Date.now(),
            nombre: formData.nombre,
            cantidad: cantidadNum,
            estado,
            claseBadge
        };

        setProductos([...productos, nuevoProducto]);

        // Limpiar formulario
        setFormData({ id: "", nombre: "", cantidad: "" });

        // Cerrar Modal vía JS nativo sin romper React
        const botonCerrar = document.querySelector("#modalProducto .btn-close");
        if (botonCerrar) {
            botonCerrar.click();
        }
    };

    // Cálculos dinámicos para las tarjetas
    const activos = productos.filter((p) => p.estado === "Activo").length;
    const bajoStock = productos.filter((p) => p.estado === "Bajo Stock").length;
    const sinStock = productos.filter((p) => p.estado === "Sin Stock").length;

    return (
        <div className="dashboard-layout">
            <aside className="sidebar offcanvas offcanvas-start show" tabIndex="-1" id="sidebarMenu">
                <div className="sidebar-logo">
                    <img src={logoImg} alt="Logo Taller De Betancourt" />
                    <h2>Taller De Betancourt</h2>
                    <p>Gestión De Inventarios</p>
                </div>
                <nav className="sidebar-menu">
                    {/* Navegación mediante props de React sin recargar la página */}
                    <button onClick={() => setVistaActual && setVistaActual('proveedores')} className="btn text-start text-white w-100">
                        <i className="fa-solid fa-truck"></i> Proveedores
                    </button>
                    <button onClick={() => setVistaActual && setVistaActual('clientes')} className="btn text-start text-white w-100">
                        <i className="fa-regular fa-user"></i> Clientes
                    </button>
                    <button onClick={() => setVistaActual && setVistaActual('pedidos')} className="btn text-start text-white w-100">
                        <i className="fa-solid fa-clipboard-list"></i> Pedidos
                    </button>
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
                                <h3>{activos}</h3>
                                <p>Productos activos</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-4">
                        <div className="card-resumen">
                            <i className="fa-solid fa-triangle-exclamation"></i>
                            <div>
                                <h3>{bajoStock}</h3>
                                <p>Productos Con bajo Stock</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-4">
                        <div className="card-resumen">
                            <i className="fa-solid fa-ban"></i>
                            <div>
                                <h3>{sinStock}</h3>
                                <p>Productos Sin Stock</p>
                            </div>
                        </div>
                    </div>
                </section>

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

                <div className="tabla-inventario">
                    <table id="tablaProductos" className="table align-middle">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre Producto</th>
                                <th>Cantidad</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((prod) => (
                                <tr key={prod.id}>
                                    <td>{prod.id}</td>
                                    <td>{prod.nombre}</td>
                                    <td>{prod.cantidad}</td>
                                    <td>
                                        <span className={`badge ${prod.claseBadge}`}>
                                            {prod.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                <div className="modal fade" id="modalProducto" tabIndex="-1" aria-labelledby="modalProductoLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content modal-login text-bg-dark border-secondary">
                            <div className="modal-header border-0">
                                <h2 className="modal-title w-100 text-center" id="modalProductoLabel">
                                    Nuevo Producto
                                </h2>
                                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form id="formProducto" onSubmit={handleSubmit}>
                                    <input
                                        type="number"
                                        name="id"
                                        className="form-control mb-3"
                                        placeholder="ID Producto"
                                        value={formData.id}
                                        onChange={handleChange}
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="nombre"
                                        className="form-control mb-3"
                                        placeholder="Nombre del Producto"
                                        minLength={3}
                                        maxLength={20}
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                    />
                                    <input
                                        type="number"
                                        name="cantidad"
                                        className="form-control mb-3"
                                        placeholder="Cantidad Inicial"
                                        min="0"
                                        value={formData.cantidad}
                                        onChange={handleChange}
                                        required
                                    />

                                    <button type="submit" className="btn btn-registrar w-100">
                                        Guardar Producto
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Inventario;