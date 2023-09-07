import mongoose from 'mongoose';

const pacientesSchema = mongoose.Schema({
    nombre: {
        // Tipo de dato
        type: String,
        // Validarlo en el servidor
        required: true,
        // Eliminar espacios en blanco (delante-detras)
        trim: true
    },
    propietario: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now()
    },
    sintomas: {
        type: String,
        required: true,
        trim: true
    },
    veterinario: {
        // Almaceno el id del veterinario para relacionarlo
        type: mongoose.Schema.Types.ObjectId,
        // Referencio al modelo del veterinario
        ref: "Veterinario"
    }

}, {
    // Cree las columnas de creación y edicion
    timestamps: true
});

const Paciente = mongoose.model('Paciente', pacientesSchema);

export default Paciente;