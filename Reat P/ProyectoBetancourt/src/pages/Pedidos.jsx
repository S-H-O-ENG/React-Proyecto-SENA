import { useState } from 'react';
import logo from '../assets/logo.png';
import '../css/Pedidos.css';

function Pedidos() {
    //bootstrap numero repuestos
    const [rangeValue, setRangeValue] = useState(50);





    return (
        <>



            <div className="container">
                <header className="topbar">
                    <div>
                        <p>Bienvenido</p>
                    </div>
                    <div className="inventario-info">
                        <i className="fa-regular fa-user"></i>
                        <span>Gestión de Pedidos</span>
                    </div>
                </header>
                <div className="formulario">
                    <div className="input-group">
                        <span className="input-group-text">Nombres y apellidos</span>
                        <input type="text" aria-label="First name" className="form-control" />
                        <input type="text" aria-label="Last name" className="form-control" />
                    </div>

                    <div className="rol">
                        <label htmlFor="">Seleccione su rol en el taller</label>
                        <select className="form-select" aria-label="Default select example">
                            <option selected disabled>Seleccione una opcion</option>
                            <option value="1">Jefe del taller</option>
                        </select>
                    </div>

                    <div className="proveedor">
                        <label htmlFor="">Seleccione un proveedor </label>
                        <select className="form-select" aria-label="Default select example">
                            <option selected disabled>Seleccione una opcion</option>
                            <option value="1">Proveedor 1</option>
                            <option value="2">Proveedor 2</option>
                            <option value="3">Proveedor 3</option>
                        </select>
                    </div>

                    <label htmlFor="range4" className="form-label">Cantidad de repuestos requerida:  <strong>{rangeValue}</strong></label>
                    <input type="range" className="form-range" min="0" max="100" value={rangeValue} id="range4" onChange={(e) => setRangeValue(e.target.value)} />


                    <div className="importancia">
                        <label htmlFor="">Seleccione la importancia del pedido</label> <br />
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="alta"
                                value="option1" />
                            <label className="form-check-label" htmlFor="inlineRadio1">Alta</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="media"
                                value="option2" />
                            <label className="form-check-label" htmlFor="inlineRadio2">Media</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="baja"
                                value="option2" />
                            <label className="form-check-label" htmlFor="inlineRadio2">Baja</label>
                        </div>
                    </div>

                    <div className="pagom">
                        <label htmlFor="">Seleccione un metodo de pago</label>
                        <select className="form-select" aria-label="Default select example">
                            <option value="" disabled>Seleccione una opcion</option>
                            <option value="transferencia">Transferencia</option>
                            <option value="efectivo">Efectivo</option>
                        </select>
                    </div>

                    <button className="btn-enviar">Solicitar Pedido</button>
                </div>



            </div>
        </>
    )
}

export default Pedidos;