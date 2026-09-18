import { useState, useEffect } from 'react';
import axios from 'axios';
import logoImg from '../assets/logo.png';
import '../css/Inventario.css';


const API_URL = "http://localhost:3000/productos";

function Inventario({ setVistaActual }) {
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    cantidad: ""
  });

 
  const consultarP = async () => {
    try {
      const respuesta = await axios.get(API_URL);
      setProductos(respuesta.data);
    } catch (error) {
      console.error("Error al consultar API:", error);
    }
  };

  useEffect(() => {
    consultarP();
  }, []);

  
  const obtenerEstadoYBadge = (cantidadNum) => {
    if (cantidadNum === 0) {
      return { estado: "Sin Stock", claseBadge: "bg-danger" };
    } else if (cantidadNum <= 5) {
      return { estado: "Bajo Stock", claseBadge: "bg-warning text-dark" };
    }
    return { estado: "Activo", claseBadge: "bg-success" };
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const cantidadNum = parseInt(formData.cantidad, 10) || 0;
    const { estado, claseBadge } = obtenerEstadoYBadge(cantidadNum);

    const nuevoProducto = {
      id: formData.id || String(Date.now()),
      nombre: formData.nombre,
      cantidad: cantidadNum,
      estado,
      claseBadge
    };

    try {
      await axios.post(API_URL, nuevoProducto);
      await consultarP();
      setFormData({ id: "", nombre: "", cantidad: "" });

      try {
    await axios.post(API_URL, nuevoProducto);
    await consultarP(); 
    setFormData({ id: "", nombre: "", cantidad: "" }); 
    const botonCerrar = document.querySelector("#modalProducto .btn-close");
    if (botonCerrar) botonCerrar.click();
  } catch (error) {
    console.error("Error al guardar producto:", error);
  };


      const botonCerrar = document.querySelector("#modalProducto .btn-close");
      if (botonCerrar) botonCerrar.click();
    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  };

  
  const prepararModificacion = (producto) => {
    setFormData({
      id: producto.id,
      nombre: producto.nombre,
      cantidad: producto.cantidad
    });
  };

 
  const handleUpdate = async (e) => {
    e.preventDefault();
    const cantidadNum = parseInt(formData.cantidad, 10) || 0;
    const { estado, claseBadge } = obtenerEstadoYBadge(cantidadNum);

    const productoActualizado = {
      id: formData.id,
      nombre: formData.nombre,
      cantidad: cantidadNum,
      estado,
      claseBadge
    };

    try {
      await axios.put(`${API_URL}/${formData.id}`, productoActualizado);
      await consultarP();
      setFormData({ id: "", nombre: "", cantidad: "" });

      const botonCerrar = document.querySelector("#modalModificar .btn-close");
      if (botonCerrar) botonCerrar.click();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  };

  
  const activos = productos.filter((p) => p.estado === "Activo").length;
  const bajoStock = productos.filter((p) => p.estado === "Bajo Stock").length;
  const sinStock = productos.filter((p) => p.estado === "Sin Stock").length;

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
            <button onClick={() => setVistaActual && setVistaActual('Inventario')} className="btn text-start text-white w-100">
              <i className="fa-solid fa-boxes-stacked"></i> Inventario
            </button>
            <button onClick={() => setVistaActual && setVistaActual('App')} className="btn text-start text-white w-100">
              <i className="fa-solid fa-right-from-bracket"></i> Salir
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
              <button 
                className="btn btn-inventario" 
                data-bs-toggle="modal" 
                data-bs-target="#modalProducto"
                onClick={() => setFormData({ id: "", nombre: "", cantidad: "" })}
              >
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
                  <th>Acciones</th>
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
                    <td>
                      <button 
                        className="btn btn-sm btn-warning"
                        data-bs-toggle="modal" 
                        data-bs-target="#modalModificar"
                        onClick={() => prepararModificacion(prod)}
                      >
                        <i className="fa-solid fa-pen-to-square"></i> Modificar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {}
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
                  value={formData.id || ''}
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
                  value={formData.nombre || ''}
                  onChange={handleChange}
                  required
                />
                <input
                  type="number"
                  name="cantidad"
                  className="form-control mb-3"
                  placeholder="Cantidad Inicial"
                  min="0"
                  value={formData.cantidad || ''}
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

      {}
      <div className="modal fade" id="modalModificar" tabIndex="-1" aria-labelledby="modalModificarLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content modal-login text-bg-dark border-secondary">
            <div className="modal-header border-0">
              <h2 className="modal-title w-100 text-center" id="modalModificarLabel">
                Modificar Producto #{formData.id}
              </h2>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form id="formModificar" onSubmit={handleUpdate}>
                <div className="mb-3">
                  <label className="form-label text-white-50">Nombre del Producto</label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    placeholder="Nombre del Producto"
                    minLength={3}
                    maxLength={20}
                    value={formData.nombre || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-white-50">Cantidad</label>
                  <input
                    type="number"
                    name="cantidad"
                    className="form-control"
                    placeholder="Cantidad"
                    min="0"
                    value={formData.cantidad || ''}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-registrar w-100">
                  Guardar Cambios
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Inventario;