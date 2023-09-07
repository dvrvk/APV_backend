import jwt from 'jsonwebtoken';
import Veterinario from '../models/Veterinario.js';

// Este es un middleware creado por nosotros
const checkAuth = async (req, res, next) => {
    let token;

    // Compruebo que este el token de autorización && que empieza con Bearer
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            // Le quito Bearer a el token
            token = req.headers.authorization.split(' ')[1];
            
            // Descodifico la información (token y palabra secreta .env)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Buscar el usuario por ID y seleccionar cierta información (excluyo password token confirmado)
            // Lo agrego dentro de express con req.nombreVariable --> crea una sesion con la info
            req.veterinario = await Veterinario.findById(decoded.id).select('-password -token -confirmado');
            
            // next me sirve para pasar al siguiente middleware en determinadas condiciones
            return next() 

        } catch (e) {
            const error = new Error('Token no valido');
            return res.status(403).json({msg: error.message});
        }
    }

    // Si nunca se asigno el token
    if(!token) {
        const error = new Error('Token no valido o inexistente');
        res.status(403).json({msg: error.message});
    }
    
}

export default checkAuth;