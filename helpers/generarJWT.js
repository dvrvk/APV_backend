import jwt from 'jsonwebtoken';

const generarJWT = (id) => {
    // Crea el JWT - {información}, secret key (palabra secreta), {opciones}
    // En este caso le paso el id del usuario
    return jwt.sign({id}, process.env.JWT_SECRET, {
        // Cuando expira
        expiresIn: "30d"
    });
}

export default generarJWT;