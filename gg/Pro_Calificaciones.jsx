import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import '../css/Pro_Clasificacion.css';

function Pro_Calificacion() {
    const API = 'http://localhost:5000';

    const [calificaciones, setCalificaciones] = useState([]);
    const [modal, setModal] = useState(false);
    const [editando, setEditando] = useState(null);
    const [buscar, setBuscar] = useState('');

    const [formulario, setFormulario] = useState({
        proveedor: '',
        fecha: '',
        tiempo: 5,
        calidad: 5,
        cumplimiento: 5,
        precio: 5
    });

    const cargarDatos = async () => {
        try {
            const respuesta = await fetch(`${API}/calificaciones`);
            const datos = await respuesta.json();
            setCalificaciones(Array.isArray(datos) ? datos : []);
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudieron cargar los datos desde el servidor.',
                background: '#18181d',
                color: '#ffffff'
            });
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const promedio =
        (Number(formulario.tiempo) +
            Number(formulario.calidad) +
            Number(formulario.cumplimiento) +
            Number(formulario.precio)) /
        4;

    const abrirModal = () => {
        setEditando(null);
        setFormulario({
            proveedor: '',
            fecha: new Date().toISOString().split('T')[0],
            tiempo: 5,
            calidad: 5,
            cumplimiento: 5,
            precio: 5
        });
        setModal(true);
    };

    const cerrarModal = () => {
        setModal(false);
        setEditando(null);
    };

    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const guardar = async (e) => {
        e.preventDefault();

        if (!formulario.proveedor.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo incompleto',
                text: 'Debes ingresar el nombre del proveedor.',
                background: '#18181d',
                color: '#ffffff'
            });
            return;
        }

        try {
            const datos = {
                proveedor: formulario.proveedor.trim(),
                fecha: formulario.fecha,
                tiempo: Number(formulario.tiempo),
                calidad: Number(formulario.calidad),
                cumplimiento: Number(formulario.cumplimiento),
                precio: Number(formulario.precio),
                promedio: Number(promedio.toFixed(2))
            };

            if (editando) {
                await fetch(`${API}/calificaciones/${editando.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editando.id, ...datos })
                });

                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Calificación actualizada',
                    showConfirmButton: false,
                    timer: 2000,
                    background: '#18181d',
                    color: '#ffffff'
                });
            } else {
                const nuevoId =
                    calificaciones.length > 0
                        ? Math.max(...calificaciones.map((c) => Number(c.id) || 0)) + 1
                        : 1;

                await fetch(`${API}/calificaciones`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: nuevoId, ...datos })
                });

                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Calificación registrada',
                    showConfirmButton: false,
                    timer: 2000,
                    background: '#18181d',
                    color: '#ffffff'
                });
            }

            await cargarDatos();
            cerrarModal();
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo guardar la calificación.',
                background: '#18181d',
                color: '#ffffff'
            });
        }
    };

    const editar = (calificacion) => {
        setEditando(calificacion);
        setFormulario({
            proveedor: calificacion.proveedor || '',
            fecha: calificacion.fecha,
            tiempo: calificacion.tiempo,
            calidad: calificacion.calidad,
            cumplimiento: calificacion.cumplimiento,
            precio: calificacion.precio
        });
        setModal(true);
    };

    const eliminar = async (id) => {
        const confirmacion = await Swal.fire({
            title: '¿Deseas eliminar esta calificación?',
            text: 'Esta acción no se podrá revertir',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#18181d',
            color: '#ffffff'
        });

        if (!confirmacion.isConfirmed) return;

        try {
            await fetch(`${API}/calificaciones/${id}`, { method: 'DELETE' });

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Calificación eliminada',
                showConfirmButton: false,
                timer: 2000,
                background: '#18181d',
                color: '#ffffff'
            });

            cargarDatos();
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar la calificación.',
                background: '#18181d',
                color: '#ffffff'
            });
        }
    };

    const filtradas = calificaciones.filter((c) => {
        const proveedorNombre = (c.proveedor || '').toLowerCase();
        const termino = buscar.toLowerCase();

        return (
            String(c.id).includes(termino) ||
            proveedorNombre.includes(termino) ||
            (c.fecha && c.fecha.includes(termino))
        );
    });

    const promedioGeneral =
        calificaciones.length > 0
            ? (
                calificaciones.reduce(
                    (total, c) => total + Number(c.promedio || 0),
                    0
                ) / calificaciones.length
            ).toFixed(2)
            : '0.00';

    return (
        <div className="container-fluid py-4">
            <div className="cuadros mb-4">
                <div className="encabezado shadow p-3">
                    <h2>Calificación de Proveedores</h2>
                    <h5>Evaluación y seguimiento del desempeño</h5>
                </div>
            </div>

            <div className="contenedor-cards row g-3 mb-4">
                <div className="col-md-6">
                    <div className="card p-3">
                        <div className="header d-flex justify-content-between">
                            <span>Total calificaciones</span>
                            <i className="fa-solid fa-ranking-star"></i>
                        </div>
                        <h2 className="mt-2">{calificaciones.length}</h2>
                        <p className="mb-0 small">Evaluaciones realizadas</p>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card p-3">
                        <div className="header d-flex justify-content-between">
                            <span>Promedio general</span>
                            <i className="fa-solid fa-star"></i>
                        </div>
                        <h2 className="mt-2 text-warning">{promedioGeneral}</h2>
                        <p className="mb-0 small">Sobre 5.0</p>
                    </div>
                </div>
            </div>

            <div className="tabla-contenedor">
                <div className="card shadow p-3">
                    <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center px-0 mb-3">
                        <h3 className="mb-0 text-white">Listado de Calificaciones</h3>
                        <button
                            type="button"
                            className="btn btn-registrar"
                            onClick={abrirModal}
                        >
                            <i className="fa-solid fa-plus me-1"></i> Nueva Calificación
                        </button>
                    </div>

                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control input-dark"
                            placeholder="Buscar por ID, Proveedor o Fecha..."
                            value={buscar}
                            onChange={(e) => setBuscar(e.target.value)}
                        />
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Proveedor</th>
                                    <th>Fecha</th>
                                    <th>Tiempo</th>
                                    <th>Calidad</th>
                                    <th>Cumplimiento</th>
                                    <th>Precio</th>
                                    <th>Promedio</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtradas.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="text-center py-4 text-muted">
                                            No se encontraron calificaciones registradas.
                                        </td>
                                    </tr>
                                ) : (
                                    filtradas.map((c) => (
                                        <tr key={c.id}>
                                            <td>{c.id}</td>
                                            <td>{c.proveedor}</td>
                                            <td>{c.fecha}</td>
                                            <td>{c.tiempo}</td>
                                            <td>{c.calidad}</td>
                                            <td>{c.cumplimiento}</td>
                                            <td>{c.precio}</td>
                                            <td>
                                                <span className="badge bg-warning text-dark">
                                                    {c.promedio}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-warning btn-sm me-2"
                                                    onClick={() => editar(c)}
                                                >
                                                    <i className="fa-solid fa-pen"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => eliminar(c.id)}
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {modal && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content text-bg-dark border-secondary">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editando ? 'Editar Calificación' : 'Nueva Calificación'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={cerrarModal}
                                ></button>
                            </div>

                            <form onSubmit={guardar}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Proveedor</label>
                                        <input
                                            type="text"
                                            name="proveedor"
                                            className="form-control input-dark"
                                            placeholder="Nombre del proveedor..."
                                            value={formulario.proveedor}
                                            onChange={manejarCambio}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Fecha</label>
                                        <input
                                            type="date"
                                            name="fecha"
                                            className="form-control input-dark"
                                            value={formulario.fecha}
                                            onChange={manejarCambio}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Tiempo de entrega (1-5)</label>
                                        <input
                                            type="number"
                                            name="tiempo"
                                            min="1"
                                            max="5"
                                            className="form-control input-dark"
                                            value={formulario.tiempo}
                                            onChange={manejarCambio}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Calidad (1-5)</label>
                                        <input
                                            type="number"
                                            name="calidad"
                                            min="1"
                                            max="5"
                                            className="form-control input-dark"
                                            value={formulario.calidad}
                                            onChange={manejarCambio}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Cumplimiento (1-5)</label>
                                        <input
                                            type="number"
                                            name="cumplimiento"
                                            min="1"
                                            max="5"
                                            className="form-control input-dark"
                                            value={formulario.cumplimiento}
                                            onChange={manejarCambio}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Precio (1-5)</label>
                                        <input
                                            type="number"
                                            name="precio"
                                            min="1"
                                            max="5"
                                            className="form-control input-dark"
                                            value={formulario.precio}
                                            onChange={manejarCambio}
                                            required
                                        />
                                    </div>

                                    <div className="alert alert-purple mb-0">
                                        Promedio: <strong>{promedio.toFixed(2)}</strong>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={cerrarModal}
                                    >
                                        Cancelar
                                    </button>

                                    <button type="submit" className="btn btn-registrar">
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Pro_Calificacion;