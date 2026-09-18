import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import '../css/Pro_Facturas.css';


function Pro_Facturas() {
    const API = 'http://localhost:5000/Pro_Facturas';

    const [facturas, setFacturas] = useState([]);
    const [modal, setModal] = useState(false);
    const [editando, setEditando] = useState(null);
    const [buscar, setBuscar] = useState('');

    const [formulario, setFormulario] = useState({
        proveedor: '',
        numeroFactura: '',
        fecha: '',
        subtotal: '',
        formaPago: 'Transferencia',
        estado: 'Pendiente'
    });

    const cargarDatos = async () => {
        try {
            const respuestaFacturas = await fetch(`${API}/facturas`);
            const datosFacturas = await respuestaFacturas.json();
            const datos = await respuesta.json();
            setFacturas(Array.isArray(datos) ? datos : []);

            setFacturas(Array.isArray(datosFacturas) ? datosFacturas : []);
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudieron cargar los datos del servidor.',
                background: '#18181d',
                color: '#ffffff'
            });
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const subtotal = Number(formulario.subtotal) || 0;
    const iva = subtotal * 0.19;
    const total = subtotal + iva;

    const abrirModal = () => {
        setEditando(null);
        setFormulario({
            proveedor: '',
            numeroFactura: '',
            fecha: new Date().toISOString().split('T')[0],
            subtotal: '',
            formaPago: 'Transferencia',
            estado: 'Pendiente'
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

        if (!formulario.proveedor.trim() || !formulario.numeroFactura.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor ingrese el nombre del proveedor y el número de factura.',
                background: '#18181d',
                color: '#ffffff'
            });
            return;
        }

        try {
            const datos = {
                proveedor: formulario.proveedor.trim(),
                numeroFactura: formulario.numeroFactura.trim(),
                fecha: formulario.fecha,
                subtotal: subtotal,
                iva: Number(iva.toFixed(2)),
                total: Number(total.toFixed(2)),
                formaPago: formulario.formaPago,
                estado: formulario.estado
            };

            if (editando) {
                await fetch(`${API}/facturas/${editando.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editando.id, ...datos })
                });

                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Factura actualizada',
                    showConfirmButton: false,
                    timer: 2000,
                    background: '#18181d',
                    color: '#ffffff'
                });
            } else {
                const nuevoId =
                    facturas.length > 0
                        ? Math.max(...facturas.map((f) => Number(f.id) || 0)) + 1
                        : 1;

                await fetch(`${API}/facturas`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: nuevoId, ...datos })
                });

                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Factura registrada',
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
                text: 'No se pudo guardar la factura.',
                background: '#18181d',
                color: '#ffffff'
            });
        }
    };

    const editar = (factura) => {
        setEditando(factura);
        setFormulario({
            proveedor: factura.proveedor || '',
            numeroFactura: factura.numeroFactura,
            fecha: factura.fecha,
            subtotal: factura.subtotal,
            formaPago: factura.formaPago,
            estado: factura.estado
        });
        setModal(true);
    };

    const eliminar = async (id) => {
        const confirmacion = await Swal.fire({
            title: '¿Deseas eliminar esta factura?',
            text: 'Esta acción no se podrá deshacer',
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
            await fetch(`${API}/facturas/${id}`, { method: 'DELETE' });

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Factura eliminada',
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
                text: 'No se pudo eliminar la factura.',
                background: '#18181d',
                color: '#ffffff'
            });
        }
    };

    const facturasFiltradas = facturas.filter((f) => {
        const proveedor = (f.proveedor || '').toLowerCase();
        const numFactura = (f.numeroFactura || '').toLowerCase();
        const estadoFactura = (f.estado || '').toLowerCase();
        const fechaFactura = f.fecha || '';
        const termino = buscar.toLowerCase();

        return (
            String(f.id).toLowerCase().includes(termino) ||
            numFactura.includes(termino) ||
            proveedor.includes(termino) ||
            fechaFactura.includes(termino) ||
            estadoFactura.includes(termino)
        );
    });

    const pendientes = facturas.filter((f) => f.estado === 'Pendiente').length;
    const pagadas = facturas.filter((f) => f.estado === 'Pagada').length;
    const totalFacturado = facturas.reduce(
        (total, f) => total + Number(f.total || 0),
        0
    );

    return (
        <div className="container-fluid py-4">
            <div className="cuadros mb-4">
                <div className="encabezado shadow p-3">
                    <h2>Gestión de Facturas</h2>
                    <h5>Registro y control de facturas de proveedores</h5>
                </div>
            </div>

            <div className="contenedor-cards row g-3 mb-4">
                <div className="col-md-3">
                    <div className="card p-3">
                        <div className="header d-flex justify-content-between">
                            <span>Total facturas</span>
                            <i className="fa-solid fa-receipt"></i>
                        </div>
                        <h2 className="mt-2">{facturas.length}</h2>
                        <p className="mb-0 small">Facturas registradas</p>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card p-3">
                        <div className="header d-flex justify-content-between">
                            <span>Pagadas</span>
                            <i className="fa-solid fa-circle-check"></i>
                        </div>
                        <h2 className="mt-2 text-success">{pagadas}</h2>
                        <p className="mb-0 small">Facturas pagadas</p>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card p-3">
                        <div className="header d-flex justify-content-between">
                            <span>Pendientes</span>
                            <i className="fa-solid fa-clock"></i>
                        </div>
                        <h2 className="mt-2 text-warning">{pendientes}</h2>
                        <p className="mb-0 small">Por pagar</p>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card p-3">
                        <div className="header d-flex justify-content-between">
                            <span>Total</span>
                            <i className="fa-solid fa-money-bill"></i>
                        </div>
                        <h2 className="mt-2 text-info">
                            ${totalFacturado.toLocaleString('es-CO')}
                        </h2>
                        <p className="mb-0 small">Valor facturado</p>
                    </div>
                </div>
            </div>

            <div className="tabla-contenedor">
                <div className="card shadow p-3">
                    <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center px-0 mb-3">
                        <h3 className="mb-0 text-white">Listado de Facturas</h3>

                        <button
                            type="button"
                            className="btn btn-registrar"
                            onClick={abrirModal}
                        >
                            <i className="fa-solid fa-plus me-1"></i> Registrar Factura
                        </button>
                    </div>

                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control input-dark"
                            placeholder="Buscar factura por N°, proveedor, estado..."
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
                                    <th>N° Factura</th>
                                    <th>Fecha</th>
                                    <th>Subtotal</th>
                                    <th>IVA</th>
                                    <th>Total</th>
                                    <th>Forma de pago</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {facturasFiltradas.length === 0 ? (
                                    <tr>
                                        <td colSpan="10" className="text-center py-4 text-muted">
                                            No se encontraron facturas registradas.
                                        </td>
                                    </tr>
                                ) : (
                                    facturasFiltradas.map((f) => (
                                        <tr key={f.id}>
                                            <td>{f.id}</td>
                                            <td>{f.proveedor}</td>
                                            <td>{f.numeroFactura}</td>
                                            <td>{f.fecha}</td>
                                            <td>${Number(f.subtotal || 0).toLocaleString('es-CO')}</td>
                                            <td>${Number(f.iva || 0).toLocaleString('es-CO')}</td>
                                            <td>${Number(f.total || 0).toLocaleString('es-CO')}</td>
                                            <td>{f.formaPago}</td>
                                            <td>
                                                <span
                                                    className={
                                                        f.estado === 'Pagada'
                                                            ? 'badge bg-success'
                                                            : f.estado === 'Pendiente'
                                                                ? 'badge bg-warning text-dark'
                                                                : 'badge bg-danger'
                                                    }
                                                >
                                                    {f.estado}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-warning btn-sm me-2"
                                                    onClick={() => editar(f)}
                                                >
                                                    <i className="fa-solid fa-pen"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => eliminar(f.id)}
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
                                    {editando ? 'Editar Factura' : 'Registrar Factura'}
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
                                        <label className="form-label">Número de factura</label>
                                        <input
                                            type="text"
                                            name="numeroFactura"
                                            className="form-control input-dark"
                                            placeholder="FAC-001"
                                            value={formulario.numeroFactura}
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
                                        <label className="form-label">Subtotal</label>
                                        <input
                                            type="number"
                                            name="subtotal"
                                            className="form-control input-dark"
                                            min="0"
                                            value={formulario.subtotal}
                                            onChange={manejarCambio}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">IVA 19%</label>
                                        <input
                                            type="text"
                                            className="form-control input-dark text-muted"
                                            value={`$${iva.toLocaleString('es-CO')}`}
                                            readOnly
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Total</label>
                                        <input
                                            type="text"
                                            className="form-control input-dark text-muted"
                                            value={`$${total.toLocaleString('es-CO')}`}
                                            readOnly
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Forma de pago</label>
                                        <select
                                            name="formaPago"
                                            className="form-select input-dark"
                                            value={formulario.formaPago}
                                            onChange={manejarCambio}
                                        >
                                            <option value="Efectivo">Efectivo</option>
                                            <option value="Transferencia">Transferencia</option>
                                            <option value="Tarjeta">Tarjeta</option>
                                            <option value="Crédito">Crédito</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Estado</label>
                                        <select
                                            name="estado"
                                            className="form-select input-dark"
                                            value={formulario.estado}
                                            onChange={manejarCambio}
                                        >
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="Pagada">Pagada</option>
                                            <option value="Anulada">Anulada</option>
                                        </select>
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

export default Pro_Facturas;