import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import NavbarJefe from '../components/NavbarJefe';
import '../css/Pedidos.css';


function Pedidos() {
    const API_URL = 'http://localhost:3000/pedidos';

    const [carga, setCarga] = useState(false); //esta es una constante que se usa para evitar que se dupliquen lo datos al enviarlos a la bd,json (esto es una variable boolenao, por eso el estado inicial es falso)

    const [rangeValue, setRangeValue] = useState(50);

    //como usar use state, como hacer crud funcinal, etc
    //creamos una constante que se va a encargar e almacenar ls datos para luegon pasarlos al db.json

    const [datos, setDatos] = useState({
        nombre: '',
        apellido: '',
        rol: '',
        proveedor: '',
        repuesto: '',
        cantidad: '',
        importancia: '',
        metodopago: '',
        estado: 'Pendiente'
    });
    //cons = constante, datos = nombre que le damos a la constante, setDatos = es la manera de modificar datos, osea si ponemos datos = 1, no va a funcionar,setDatos es la unnica autorizada a modificar el campo, mas abajo estan todos los campos que se van a recibir, nombre apellido repuesto etc, y de ultimas el estado en pendiente, siempre nace en pendiennte pq un pedido recien hecho siempre es un pedido pendiente



    //funcion que se usa para enviar los datos anteriores a la constante
    //(e) dice que la funcion recibe un evento
    function actualizardatos(e){
        //aqui llamamos a setdatos para copiar todo el conetnido de esa constante a esa constante, por eso el setdatos, pq estamos modificando esa constante
        //el ... antes de datos es un operador que copia todo el contenido que ya tenia la constante, para evitar que se pierdan datos
        //e.target.name captura el atributo name de el html, ese atributo es el que disparo el cambio
        //e.target.value captura el texto que el usuario escribio o selecciono
        setDatos({
            ...datos,
            [e.target.name]: e.target.value
        });
    }


     //async = indica que la funcion es asincroniza pq las conecciones entre una pagina y la bd tardan
     //esta funcion va a ser la encargada de enviar los datos de la constante a la bd.json, tambien recibe un evento, por eso el (e)
    async function enviardatos(e){
        e.preventDefault(); //es una funcion que evita que la pagina se recargue o se pierdan datos

        //la primera barrera de segurida
        //entonces cmo definimos carrgando como falsa si el usuario hace un doble click o se detecta un segundo envio antes de que la funcion halla terminado su recorrido lo que pasa es esto;
        //en el primer envio que es el correcto como la condicion es falsa la funcion simplemente continnua y define el carga cmo verdadero, entonces ai justo aqui se hace otro envio sin que el primero halla terminado, como la funcion ahora si es verdadera pq ya se habia definifo el carga entrue el va a hacer un return, y la funcion se va a detener
        // y abajo del todo volvemos a definir carga como falso para que se puefan seguir haciendo pedidos

        
        //aqui usamos axios entonces, primero un try para verificar si hay o no errores, para que la funcion registre errores basicamente
        //axios.post(api, datos) = aqui es como hacer un post en postman xd, osea vamos a registrar datos y le estamos pasando primero la url de la bd, y segundo los campos que va a registar, que son los de la primera constante y pues si es correcto le sacamos la alerta
        //cons respuesta = await ... = esto sirve para que axios al enviar el pedido no nos de solo lo que guaradmos si no mas datos de la coneccion con el servidor utiles, por ejemplo, el status headers etc


        try{
            const respuesta = await axios.post(API_URL, datos);
            Swal.fire(`Pedido Creado Con Exito`);
        }catch (error){
            Swal.fire(`No Se Ha Podido Crear El Pedido`);
        }
        
    }
    
    return (
        <>
            <NavbarJefe />
            <div className="container">

                
                {/*aqui agregamos on submit al formulario para que permita que todo lo que se haga aca sea enviado a la funcion designada*/}

                <form className="formulario" onSubmit={enviardatos}>

                    <div className="input-group">
                        <span className="input-group-text">Nombres y apellidos</span>
                        <input type="text" aria-label="First name" className="form-control" name='nombre' value={datos.nombre} onChange={actualizardatos} required/>
                        <input type="text" aria-label="Last name" className="form-control" name='apellido' value={datos.apellido} onChange={actualizardatos} required/>
                    </div>

                    <div className="rol">
                        <label htmlFor="">Seleccione su rol en el taller</label>
                        <select className="form-select" name='rol' aria-label="Default select example" value={datos.rol} onChange={actualizardatos} required>
                            <option selected>Seleccione una opcion</option>
                            <option >Jefe del taller</option>
                        </select>
                    </div>

                    <div className="proveedor">
                        <label htmlFor="">Seleccione un proveedor </label>
                        <select className="form-select" name='proveedor' aria-label="Default select example" value={datos.proveedor} onChange={actualizardatos} required>
                            <option selected>Seleccione una opcion</option>
                            <option >Proveedor 1</option>
                            <option >Proveedor 2</option>
                            <option >Proveedor 3</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <span className="input-group-text">Repuesto Requerido</span>
                        <input type="text" aria-label="First name" className="form-control" name='repuesto' value={datos.repuesto} onChange={actualizardatos} required/>
                    </div>


                    <label htmlFor="range4" className="form-label">Cantidad de repuestos requerida:  <strong>{datos.cantidad}</strong></label>
                    <input type="range" name='cantidad' className="form-range" min="0" max="100" value={datos.cantidad} id="range4" onChange={actualizardatos} required/>


                    <div className="importancia">
                        <label htmlFor="">Seleccione la importancia del pedido</label> <br />
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="importancia" id="alta"
                                value='alta' checked={datos.importancia === 'alta'}onChange={actualizardatos} required/>
                            <label className="form-check-label" htmlFor="inlineRadio1">Alta</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="importancia" id="media"
                                value='media' checked={datos.importancia === 'media'} onChange={actualizardatos} required/>
                            <label className="form-check-label" htmlFor="inlineRadio2">Media</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="importancia" id="baja"
                                value='baja' checked={datos.importancia === 'baja'} onChange={actualizardatos} required/>
                            <label className="form-check-label" htmlFor="inlineRadio2">Baja</label>
                        </div>
                    </div>

                    <div className="pagom">
                        <label htmlFor="">Seleccione un metodo de pago</label>
                        <select className="form-select" name='metodopago' aria-label="Default select example" value={datos.metodopago} onChange={actualizardatos} required>
                            <option selected>Seleccione una opcion</option>
                            <option value="transferencia">Transferencia</option>
                            <option value="efectivo">Efectivo</option>
                        </select>
                    </div>

                    {/*en todos loa campos anteriores se agegaron
                    value.datos... lo que hace es vincular ese campo de la constante con el input o la linea donde se halla puesto, para eso TODOS LOS INPUT O LABEL ETC, DEBEN DE TENER UN ATRIBUTO NAME CON EL MISMO NOMBRE QUE EL CAMPO DE LA CONSTANTE, OSEA si es datos.metodopago, el form debe tener name='metodopago'
                    onchange(actualizardatos) = aqui es una funncion que dice que cuando detecte cualquier cambio llame a la funcion que va entre las {}, este y el de arriba trabajan juntos 
                    */}



                    {/*aqui se le pone tipo submit al boton pq anteriomente en la funcion y la variable quedamos en que recibian un evento, y el submit es un evento, entonces gracias a este boton todo el formulario lo escucha y llama a la funcinn que le asignamos osea enviardatos, pero ES IMPORANTE PQ ESTO SOLO FUNCIONA SIEMPRE Y CUANDO TDO ESTE DENTRO DE UNA ETIQUETA FORM, no sirve en divs ni main ni nada*/}
                    <button type="submit" className="btn-enviar">Solicitar Pedido</button>
                </form>

            </div>
        </>
    )
}

export default Pedidos;