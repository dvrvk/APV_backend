import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarId from "../helpers/generarId.js";

// Creo el esquema de datos (forma)
const veterinarioSchema = mongoose.Schema({
    nombre: {
        // Tipo de dato
        type: String,
        // Validarlo en el servidor
        required: true,
        // Eliminar espacios en blanco (delante-detras)
        trim: true
    },
    password: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true,
        // Dato único
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        // Como no es obligatorio le pongo un valor por defecto
        default: null, 
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        // Token único
        default: generarId()
    }, 
    confirmado: {
        type: Boolean,
        default: false
    }

});

// Acciones antes (y/o después) de que se almacene el registro
// Antes de almacenarlo - usamos funtion para poder acceder con this
veterinarioSchema.pre('save', async function(next) {
    // Para que no me vuelva a Hasear el password - next pasa al siguiente middleware (de index.js)
    if(!this.isModified('password')) {
        next();
    }
    // Genero el hasheo y lo guardo
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
});

// Registro funciones que se registra solo en este Schema
veterinarioSchema.methods.comprobarPassword = async function(passwordFormulario) {
    // Recibe dos parametros (password del formulario, password haseado del modelo) retorna true/false
    return await bcrypt.compare(passwordFormulario, this.password);
}

// Registro como un modelo (nombre, esquema de datos) 
const Veterinario = mongoose.model("Veterinario", veterinarioSchema);
export default Veterinario;

