// Importo el Modelo
import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassord from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
    // Con esto leo los datos
    const { email, password, nombre } = req.body;

    // Prevenir usuarios duplicados (Consultar si existe) (findOne busca por los atributos)
    const existeUsuario = await Veterinario.findOne({ email })

    if (existeUsuario) {
        // Envio mensaje de error - el usuario existe - paro el programa
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({ msg: error.message })
    }

    // Guardar un nuevo Veterinario
    try {
        // Creo una instancia del modelo con los datos pasados
        const veterinario = new Veterinario(req.body);
        // Almacenar datos
        const veterinarioGuardado = await veterinario.save();
        // Enviar el email
        emailRegistro({nombre, email, token: veterinarioGuardado.token})

        // Responder
        res.json(veterinarioGuardado)
    } catch (error) {
        console.log(error);
    }

};

const perfil = (req, res) => {
    // Esta información viene del authMiddleware.js que guarda la info en req.veterinario
    const { veterinario } = req;
    res.json({ perfil: veterinario })
};

const confirmar = async (req, res) => {
    // Leer los datos de la URL - req.params.nombreVariable
    const { token } = req.params;
    // Buscamos por el token - await es para paralizar la ejecución mientras realiza la busqueda
    const usuarioConfirmar = await Veterinario.findOne({ token });
    // Mensaje de error si no existe el usuario
    if (!usuarioConfirmar) {
        const error = new Error('Token no valido');
        return res.status(404).json({ msg: error.message });
    }

    try {
        // UsuarioConfirmar es un objeto el cual modifico
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;

        // Guardar datos modificados
        await usuarioConfirmar.save();
        // Envio mensaje
        res.json({ msg: "Usuario confirmado correctamente" })
    } catch (error) {
        console.log(error);
    }

}

const autenticar = async (req, res) => {
    // Saco los datos
    const { email, password } = req.body;
    // Comprobar si existe el usuario
    const usuario = await Veterinario.findOne({ email });
    // Si no existe mensaje de error
    if (!usuario) {
        const error = new Error("Usuario no existe");
        return res.status(403).json({ msg: error.message });
    }
    // Comprobar si el usuario esta confirmado
    if (!usuario.confirmado) {
        const error = new Error("Tu cuenta no ha sido confirmada");
        return res.status(403).json({ msg: error.message });
    }
    // Revisar si el password es correcto
    if (await usuario.comprobarPassword(password)) {
        // Autenticar usuario - Guardo el token
        // Respondo con el usuario
        res.json({
            _id : usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id),
            web: usuario.web
        });
    } else {
        const error = new Error("Password incorrecto");
        return res.status(403).json({ msg: error.message });
    }

}

const olvidePassword = async (req, res) => {
    const { email } = req.body;

    const exiteVeterinario = await Veterinario.findOne({ email });
    if (!exiteVeterinario || !exiteVeterinario.confirmado) {
        const error = new Error("El usuario no existe o la cuenta no está confirmada");
        return res.status(400).json({ msg: error.message });
    }

    try {
        // Genera token
        exiteVeterinario.token = generarId();
        // Guarda en la base de datos
        await exiteVeterinario.save();
        // Enviar email con instrucciones
        emailOlvidePassord({
            nombre: exiteVeterinario.nombre,
            email,
            token: exiteVeterinario.token
        });

        res.json({ msg: "Hemos enviado un email con las instrucciones." })

    } catch (error) {
        console.log(error)
    }

}

const comprobarToken = async (req, res) => {
    // Accedo al parámetro
    const { token } = req.params;

    // Busco el token
    const tokenValido = await Veterinario.findOne({ token });
    
    if(tokenValido) {
        // El token es válido
        res.json({msg: "Token válido y el usuario existe"})

    } else {
        const error = new Error('Token no válido');
        return res.status(400).json({msg: error.message});
    }

}

const nuevoPassword = async (req, res) => {
    // Extraigo el parametro de la URL
    const { token } = req.params;
    // Extraigo la información del formulario (lo que escribe el usuario)
    const { password } = req.body;

    // Buscamos el registro
    const veterinario = await Veterinario.findOne({token});

    if(!veterinario){
        const error = new Error('Token no válido');
        return res.status(400).json({msg: error.message});
    }

    // Modificamos el registro
    try {
        // Elimino el token
        veterinario.token = "";
        // Modifico el password (el haseo esta en el modelo)
        veterinario.password = password;
        // Guardar en la BD
        await veterinario.save();
        res.json({msg: "Password modificado correctamente."});
    } catch (error) {
        console.log(error);
    }


}

const actualizarPerfil = async (req, res) => {

    const veterinario = await Veterinario.findById(req.params.id);

    if(!veterinario) {
        const error = new Error('Usuario no encontrado');
        return res.status(400).json({msg: error.message});
    }

    // Si he modificado el email - verifico que no exista en mi BD
    const {email} = req.body;
    if(veterinario.email !== req.body.email){
        const existeEmail = await Veterinario.findOne({email});
        if(existeEmail){
            const error = new Error('Error: este email ya está en uso');
            return res.status(400).json({msg: error.message});
        }
    }

    // Saco los datos del POST y actualizo la base de datos
    try {
        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;
        
        // Guardo cambios
        const veterinarioActualizado = await veterinario.save()
        
        res.json({
            _id : veterinarioActualizado._id,
            __v: veterinario.__v,
            telefono: veterinarioActualizado.telefono,
            nombre: veterinarioActualizado.nombre,
            email: veterinarioActualizado.email,
            token: generarJWT(veterinarioActualizado.id),
            web: veterinarioActualizado.web
        });

    } catch (error) {
        console.log(error);
    }
    

}

const actualizarPassword = async (req, res) => {
    // Leer los datos
    const { id } = req.veterinario;
    const { pwd_actual, pwd_nuevo } = req.body;
    // Comprobar que veterinario existe
    const veterinario = await Veterinario.findById(id);

    if(!veterinario) {
        const error = new Error('Usuario no encontrado');
        return res.status(400).json({msg: error.message});
    }
    // Comprobar su password
    if(await veterinario.comprobarPassword(pwd_actual)) {
        // Almacenar su password - se encripta en el modelo
        veterinario.password = pwd_nuevo;
        // Guardo en la base de datos
        await veterinario.save()
        // Respuesta
        res.json({
            msg: 'Password actualizado correctamente',
            error: false
        })
    } else {
        const error = new Error('Error, password actual es incorrecto');
        return res.status(400).json({msg: error.message});
    }

    

}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}