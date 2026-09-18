import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import NavbarJefe from './components/NavbarJefe.jsx'
import Pedidos from './pages/Pedidos.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Pedidos   />
  </StrictMode>,
)
