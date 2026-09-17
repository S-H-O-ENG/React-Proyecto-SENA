import React, { useState, useEffect } from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import logoImg from '../assets/logo.png';
import supraImg from '../assets/supra.png';
import '../css/Clientes.css';

const API_URL = "http://localhost:3000/clientes";

const EstadoInicialForm = {
    id: null,
    cedula: '',
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    tipoVehiculo: '',
    placa: '',
    marca: '',
    modelo: '',
    color: ''
};

function GestionClientes() {
    const [clientes, setClientes] = useState([]);
    const [formData, setFormData] = useState(EstadoInicialForm);
    const [mostrarModal, setMostrarModal] = useState(false);

    const obtenerClientes = async () => {
        try {
            const respuesta = await axios.get(API_URL);
            setClientes(respuesta.data);
        } catch (error) {
            console.error("Error al cargar clientes desde db.json:", error);
        }
    };

    useEffect(() => {
        obtenerClientes();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const abrirNuevoRegistro = () => {
        setFormData(EstadoInicialForm);
        setMostrarModal(true);
    };

    const abrirEdicion = (cliente) => {
        // Al editar, se deja el campo cédula vacío por seguridad ya que al estar hasheada con bcrypt no se puede revertir
        setFormData({
            ...cliente,
            cedula: ''
        });
        setMostrarModal(true);
    };

    const cerrarModal = () => {
        setMostrarModal(false);
        setFormData(EstadoInicialForm);
    };

    const guardarCliente = async (e) => {
        e.preventDefault();

        try {
            if (formData.id === null) {
                // Validar si la placa ya existe
                const existePlaca = clientes.some(
                    c => c.placa.toLowerCase() === formData.placa.toLowerCase()
                );

                if (existePlaca) {
                    alert("Atención: Ya existe un registro con esta Placa.");
                    return;
                }

                // Se genenera Hash con bcryptjs para la cédula
                const salt = await bcrypt.genSalt(10);
                const cedulaEncriptada = await bcrypt.hash(formData.cedula, salt);

                const nuevoCliente = {
                    ...formData,
                    cedula: cedulaEncriptada
                };

                const { id, ...nuevoSinId } = nuevoCliente;
                await axios.post(API_URL, nuevoSinId);
            } else {
                // Si el usuario ingresó una nueva cédula al editar, se encripta; de lo contrario se conserva la actual
                let cedulaFinal = formData.cedula;

                if (formData.cedula && formData.cedula.trim() !== '') {
                    const salt = await bcrypt.genSalt(10);
                    cedulaFinal = await bcrypt.hash(formData.cedula, salt);
                } else {
                    const clienteOriginal = clientes.find(c => c.id === formData.id);
                    cedulaFinal = clienteOriginal ? clienteOriginal.cedula : formData.cedula;
                }

                const datosActualizados = {
                    ...formData,
                    cedula: cedulaFinal
                };

                await axios.put(`${API_URL}/${formData.id}`, datosActualizados);
            }

            obtenerClientes();
            cerrarModal();
        } catch (error) {
            console.error("Error al guardar cliente en db.json:", error);
            alert("Ocurrió un error al guardar en la base de datos.");
        }
    };

    const eliminarCliente = async (cliente) => {
        if (window.confirm(`¿Estás seguro que deseas eliminar el registro de ${cliente.nombre} ${cliente.apellido}?`)) {
            try {
                await axios.delete(`${API_URL}/${cliente.id}`);
                obtenerClientes();
            } catch (error) {
                console.error("Error al eliminar cliente:", error);
                alert("Ocurrió un error al eliminar el registro.");
            }
        }
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar offcanvas">
                <div className="sidebar-logo">
                    <img src={logoImg} alt="Logo Taller" />
                    <h2>Taller De Betancourt</h2>
                    <p>Gestión de Clientes</p>
                </div>
                <nav className="sidebar-menu">
                    <a href="#gestion-clientes" className="active">
                        <i className="fa-regular fa-user"></i>
                        <span>Gestion Clientes</span>
                    </a>
                    <a href="#salir" onClick={(e) => { e.preventDefault(); if (alSalir) alSalir(); }}>
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                        <span>Salir</span>
                    </a>
                </nav>
            </aside>

            <main className="dashboard-main">
                <header className="topbar">
                    <div>
                        <p>Bienvenido</p>
                    </div>
                    <div className="inventario-info">
                        <i className="fa-regular fa-user"></i>
                        <span>Gestión de Clientes</span>
                    </div>
                </header>

                <div className="contenedor-principal">
                    <div className="header mb-4 d-flex justify-content-between align-items-center">
                        <div>
                            <h2>Gestión y Registro de Clientes</h2>
                        </div>
                        <img src={supraImg} className="carro" alt="Vehículo decorativo" />
                    </div>

                    <section className="panel tabla">
                        <div className="cabecera-tabla d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h2>Clientes y Vehículos</h2>
                            </div>
                            <button className="btn btn-taller" onClick={abrirNuevoRegistro}>
                                <i className="fa-solid fa-plus"></i> Nuevo Cliente
                            </button>
                        </div>

                        <div className="table-responsive">
                            <table id="tablaUsuarios" className="table align-middle table-dark table-hover">
                                <thead>
                                    <tr>
                                        <th>Cédula</th>
                                        <th>Propietario</th>
                                        <th>Teléfono / Correo</th>
                                        <th>Vehículo</th>
                                        <th>Placa</th>
                                        <th>Detalles Vehículo</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clientes.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center text-muted py-4">
                                                No hay clientes registrados en el sistema.
                                            </td>
                                        </tr>
                                    ) : (
                                        clientes.map((cliente) => (
                                            <tr key={cliente.id}>
                                                <td>
                                                    <span className="badge bg-dark text-white-50 font-monospace text-truncate" style={{ maxWidth: '140px', display: 'inline-block' }} title={cliente.cedula}>
                                                        {cliente.cedula ? `${cliente.cedula.substring(0, 15)}...` : ''}
                                                    </span>
                                                </td>
                                                <td>{cliente.nombre} {cliente.apellido}</td>
                                                <td>
                                                    <div className="small">
                                                        <i className="fa-solid fa-phone text-muted me-1"></i> {cliente.telefono}
                                                    </div>
                                                    <div className="small correo-tabla">
                                                        <i className="fa-solid fa-envelope me-1"></i> {cliente.correo}
                                                    </div>
                                                </td>
                                                <td><span className="badge bg-secondary">{cliente.tipoVehiculo}</span></td>
                                                <td>
                                                    <span className="badge bg-warning text-dark font-monospace" style={{ letterSpacing: '1px' }}>
                                                        {cliente.placa ? cliente.placa.toUpperCase() : ''}
                                                    </span>
                                                </td>
                                                <td className="small text-white-50">
                                                    {cliente.marca} {cliente.modelo} ({cliente.color})
                                                </td>
                                                <td>
                                                    <button className="btn btn-sm btn-outline-info me-1" onClick={() => abrirEdicion(cliente)}>
                                                        <i className="fa-solid fa-pen"></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => eliminarCliente(cliente)}>
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {mostrarModal && (
                        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} tabIndex="-1">
                            <div className="modal-dialog modal-dialog-centered modal-lg-custom">
                                <div className="modal-content">
                                    <div className="modal-header border-0">
                                        <h2 className="modal-title w-100 text-center">
                                            {formData.id ? "Modificar Datos del Cliente" : "Nuevo Registro de Cliente"}
                                        </h2>
                                        <button type="button" className="btn-close" onClick={cerrarModal}></button>
                                    </div>

                                    <div className="modal-body">
                                        <form onSubmit={guardarCliente}>
                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <div className="seccion-titulo-modal">Datos del propietario</div>

                                                    <div className="mb-3">
                                                        <label className="form-label text-white-50">
                                                            {formData.id ? "Cédula (dejar en blanco para mantener la actual):" : "Cédula:"}
                                                        </label>
                                                        <input
                                                            type="number"
                                                            id="cedula"
                                                            className="form-control"
                                                            placeholder={formData.id ? "Nueva cédula (opcional)" : "Cédula de ciudadanía"}
                                                            value={formData.cedula}
                                                            onChange={handleChange}
                                                            required={!formData.id}
                                                        />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label text-white-50">Nombre:</label>
                                                        <input type="text" id="nombre" className="form-control" placeholder="Nombres" value={formData.nombre} onChange={handleChange} required />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label text-white-50">Apellido:</label>
                                                        <input type="text" id="apellido" className="form-control" placeholder="Apellidos" value={formData.apellido} onChange={handleChange} required />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label text-white-50">Teléfono:</label>
                                                        <input type="tel" id="telefono" className="form-control" placeholder="Número de celular" value={formData.telefono} onChange={handleChange} required />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label text-white-50">Correo Electrónico:</label>
                                                        <input type="email" id="correo" className="form-control" placeholder="correo@ejemplo.com" value={formData.correo} onChange={handleChange} required />
                                                    </div>
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <div className="seccion-titulo-modal">Datos del vehículo</div>

                                                    <div className="mb-3">
                                                        <label className="form-label text-white-50">Tipo de vehículo:</label>
                                                        <select id="tipoVehiculo" className="form-select" value={formData.tipoVehiculo} onChange={handleChange} required>
                                                            <option value="">Seleccione un tipo</option>
                                                            <option value="Automóvil">Automóvil</option>
                                                            <option value="Camioneta">Camioneta</option>
                                                            <option value="Motocicleta">Motocicleta</option>
                                                            <option value="Camión">Camión</option>
                                                        </select>
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label text-white-50">Placa:</label>
                                                        <input type="text" id="placa" className="form-control" placeholder="Ej: ABC123" value={formData.placa} onChange={handleChange} required />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label text-white-50">Marca:</label>
                                                        <input type="text" id="marca" className="form-control" placeholder="Ej: Chevrolet" value={formData.marca} onChange={handleChange} required />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label text-white-50">Modelo:</label>
                                                        <input type="text" id="modelo" className="form-control" placeholder="Ej: 2024" value={formData.modelo} onChange={handleChange} required />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label text-white-50">Color:</label>
                                                        <input type="text" id="color" className="form-control" placeholder="Ej: Negro" value={formData.color} onChange={handleChange} required />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mt-3">
                                                <div className="col-12">
                                                    <button type="submit" className="btn btn-taller w-100 py-2">
                                                        {formData.id ? "Actualizar Cambios" : "Guardar Registro"}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default GestionClientes;