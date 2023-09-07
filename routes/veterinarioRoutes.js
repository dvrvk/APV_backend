import express from 'express';
const router = express.Router();
import { 
    registrar, 
    perfil, 
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
} from '../controllers/veterinarioController.js';
import checkAuth from '../middleware/authMiddleware.js';

// RUTAS PUBLICAS
router.post('/', registrar);
    // Ruta dinamica /:token 
router.get("/confirmar/:token", confirmar);
router.post('/login', autenticar);
    // Introduzco el email para cambiar el password
router.post('/olvide-password', olvidePassword);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword)


// RUTAS PRIVADAS
    // En este caso ejecuta las funciones en orden
router.get("/perfil", checkAuth, perfil);
router.post("/perfil/:id", checkAuth, actualizarPerfil);
router.put("/actualizar-password", checkAuth, actualizarPassword);

export default router;