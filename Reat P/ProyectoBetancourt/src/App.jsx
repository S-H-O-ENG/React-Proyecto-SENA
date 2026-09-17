import { useState } from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import Swal from 'sweetalert2';

import PanelJefe from './components/PanelJefe.jsx';
import logo from './assets/logo.png';
import supra from './assets/supra.png';
import './App.css';

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [vistaActual, setVistaActual] = useState("login");


  async function login(e) {
    e.preventDefault();

    if (!email || !password) {
      setMensaje("Correo y contraseña obligatorios");
      return;
    }
    try {
      //await = para que la pagina espere el resultado de la consulta
      //axios.get... = se comunica con axios que es el puente  entre el back y front y busca los campos del correo
      const consulta = await axios.get(`http://localhost:3000/usuarios?email=${email}`);

      //consulta.data.length === 0 = en el db.json los campos son arreglos, entonces un arreglo vacio o uno donde no
      //coincide el usuario es 0 - por eso el .leght, consulta la cantidad de catacteres y si no existe manda el msj
      if (consulta.data.length === 0) {
        setMensaje("El correo no está registrado");
        return;
      }

      //esta linea crea la variable usuario y le asigna el resultado que da el db.json, entonces pq 0 
      //pq como json devuleve la consulta en un arreglo el primer arreglo siempre es 0, y como arriba estamos
      //haciendo una consulta con axios donde estamos diciendo que el email sea = al email que se ingreso
      //si existe la respuesta del json es un arreglo donde ese email es el numero 0 osea el primero y ahi se asigna
      const usuario = consulta.data[0];

      //variable que hace la comparacion de la clave ingresada y la que esta en la bd
      //bycript.comparesync hace todo el calculo para saber para saber si la contra es o no
      //password es la pass que el usuario  ingresa - usuario.pass.. es la pass de la bd
      //bycrypt = encripta la contra que el usuario pone 
      const correcta = bcrypt.compareSync(password, usuario.password);

      if (!correcta) {
        setMensaje("Contraseña incorrecta");
        return;
      }


      Swal.fire(`¡Bienvenido/a ${usuario.nombre}!`);

      document.body.classList.remove('modal-open');
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '';

      //redireccionamiento a paginas
      //si el rol del usuario es igual a admin entonces la variable set vista asignele paneljefe que es igual a la pagina
      //pq arriba se importo
      if (usuario.role === "admin") {
        setVistaActual("PanelJefe")
      }


    } catch (error) {
      setMensaje("Error al iniciar sesión");
      console.error(error);
    }
  };
  //si la vista actual = anel jefe retorne panel jefe, para q se muestre xd
  if (vistaActual === "PanelJefe") {
    return <PanelJefe />;
  }

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
            aria-="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <nav className="collapse navbar-collapse navegar" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item"><a className="nav-link" href="#Nosotros">Sobre Nosotros</a></li>
              <li className="nav-item"><a className="nav-link" href="#donde">Encuéntranos</a></li>
              <li className="nav-item"><a className="nav-link btn-cita-nav" href="#agendacita">Agenda tu Cita</a></li>

              <li className="nav-item">
                <button className="btn btn-login-nav" data-bs-toggle="modal" data-bs-target="#loginModal">Login
                </button>
              </li>
            </ul>
          </nav>

        </div>

      </header>

      <div className="modal fade" id="loginModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content modal-login">
            <div className="modal-header border-0">
              <h2 className="modal-title w-100 text-center">Iniciar Sesión</h2>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={login} action="">
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo Electrónico:</label>
                  <input type="email" className="form-control" id="email" placeholder="Ingresa tu correo"
                    required value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                </div>


                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Contraseña:</label>
                  <input type="password" className="form-control" id="password"
                    placeholder="Ingresa tu contraseña" required value={password}
                    onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-login btn-ingresar w-100">Ingresar</button>


                <div className="d-flex justify-content-between mt-3">
                  <a href="#" className="link-login">¿Olvidaste tu contraseña?</a>
                </div>
              </form>
              <p>{mensaje}</p>
            </div>


          </div>
        </div>
      </div>

      <section className="banner-taller text-center d-flex flex-column justify-content-center align-items-center">
        <img src={supra} alt="supra" className="carro-animado" />
        <h1>Potencia y Rendimiento</h1>
        <p>Tu vehículo en manos de verdaderos profesionales</p>
      </section>

      <main className="container my-5 contenido-principal">

        <section className="seccion-contenedor p-4 mb-5 text-center" id="Nosotros"
          style={{ background: "rgba(24, 24, 31, 0.6)", borderRadius: "8px" }}>

          <h2>¿Quiénes somos?</h2>
          <p className="mx-auto mt-3 text-secondary"
            style={{ maxWidth: "800px", fontFamily: "'Lato', sans-serif", lineHeight: "1.6" }}>
            Somos un taller automotriz comprometido con la excelencia mecánica. Contamos con tecnología de
            vanguardia y un equipo de técnicos altamente calificados para ofrecerte soluciones confiables y seguras.
          </p>
        </section>

        <section className="seccion-contenedor p-4 mb-5 text-center" id="donde"
          style={{ background: "rgba(24, 24, 31, 0.6)", borderRadius: "8px" }}>
          <h2 className="mb-4">Encuéntranos</h2>
          <div className="ratio ratio-21x9 mx-auto" style={{ maxWidth: "1000px", borderRadius: "8px", overflow: "hidden" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.974443187212!2d-74.093416!3d4.60001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNC淡MzYnMDAuMCJOIDc0wrA1NSczNi4zIlc!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco"
              style={{ border: "0", loading: "lazy", referrerPolicy: "no-referrer-when-downgrade" }}>
            </iframe>
          </div>
        </section>

        <section className="seccion-contenedor p-4 mb-5" id="agendacita"
          style={{ background: "rgba(24, 24, 31, 0.6)", borderRadius: "8px" }}>
          <h2 className="text-center mb-4">Agenda tu Cita</h2>

          <div className="cita">
            <form action="#" method="POST" className="mx-auto" style={{ maxWidth: "600px" }}>
              <div className="mb-3">
                <label htmlFor="nombreCita" className="form- text-secondary">Nombre Completo:</label>
                <input type="text" id="nombreCita" className="form-control bg-dark text-white border-secondary"
                  placeholder="Ingrese su nombre" required />
              </div>

              <div className="row mb-3">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label htmlFor="telefonoCita" className="form- text-secondary">Teléfono de Contacto:</label>
                  <input type="tel" id="telefonoCita" className="form-control bg-dark text-white border-secondary"
                    placeholder="Ingrese numero telefonico" required />
                </div>
                <div className="col-md-6">
                  <label htmlFor="fechaCita" className="form- text-secondary">Fecha Solicitada:</label>
                  <input type="date" id="fechaCita" className="form-control bg-dark text-white border-secondary"
                    required />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="motivoCita" className="form- text-secondary">Motivo del Servicio / Falla del
                  Vehículo:</label>
                <textarea id="motivoCita" className="form-control text-white border-secondary" rows="4"
                  placeholder="Ej: Cambio de aceite, ruido en la suspensión..." required></textarea>
              </div>

              <div className="text-center">
                <button type="submit" className="btn px-5 py-2 border-0 btn-enviarS">Enviar Solicitud</button>
              </div>
            </form>
          </div>
        </section>

      </main>

    </>
  )

}

export default App;