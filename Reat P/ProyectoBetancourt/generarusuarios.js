import bcrypt from 'bcryptjs';
import fs from 'fs';


const usuariosNativos = [
  { id: "1", nombre: "Jefe", email: "jefe@betancourt.com", role: "admin", passwordPlana: "12345" },
  { id: "2", nombre: "Asistente Administrativo", email: "administrativo@betancourt.com", role: "administrativo", passwordPlana: "12345"},
  { id: "3", nombre: "Auxiliar", email: "auxiliar@betancourt.com", role: "Auxiliar", passwordPlana: "12345" }
  
];


const usuariosEncriptados = usuariosNativos.map((usuario) => {
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(usuario.passwordPlana, salt);

  return {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    role: usuario.role,
    password: passwordHash 
  };
});


const dataBase = {
  usuarios: usuariosEncriptados
};

fs.writeFileSync('db.json', JSON.stringify(dataBase, null, 2));

console.log('¡Base de datos db.json generada con éxito y contraseñas encriptadas!');