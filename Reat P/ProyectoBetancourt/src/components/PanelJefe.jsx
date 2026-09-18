// PanelJefe.jsx
import { useState } from 'react';
import NavbarJefe from '../components/NavbarJefe.jsx';
import Pedidos from '../pages/Pedidos.jsx';



function PanelJefe() {
    const [subVista, setSubVista] = useState('Pedidos');

    return (
        <NavbarJefe vistaActual={subVista} setVistaActual={setSubVista}>
            {subVista === 'Pedidos' && <Pedidos />}
            {subVista === 'Proveedores' && <Proveedores />}
        </NavbarJefe>
    );
}

export default PanelJefe;
