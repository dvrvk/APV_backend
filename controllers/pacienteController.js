import Paciente from "../models/Paciente.js";

const agregarPaciente = async (req, res) => {
    // Creo el objeto paciente
    const paciente = new Paciente(req.body);
    // Saco el veterinario de la sesión creada con authMiddleware
    paciente.veterinario = req.veterinario._id;

    try {
        // Guardar el paciente
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);
    } catch (err) {
        const error = new Error('No se ha podido guardar el paciente');
        return res.status(400).json({ msg: error.message })
    }
}

const obtenerPacientes = async (req, res) => {
    const pacientes = await Paciente.find()
        .where('veterinario')
        .equals(req.veterinario);
    res.json(pacientes);
}

const obtenerPaciente = async (req, res) => {

    try {
        // Saco el id de la URL
        const { id } = req.params
        // Busco por id
        const paciente = await Paciente.findById(id);

        if (!paciente) {
            return res.status(404).json({ msg: "No se encontraron resultados." })
        }

        // Comprobar que el veterinario autenticado es el mismo que creo al paciente
        // IMPORTANTE: convertir en string para comparar
        if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
            return res.json({ msg: "Acción no valida. El paciente no pertenece a tu lista" })
        }

        res.json(paciente);

    } catch (err) {
        return res.status(404).json({ msg: "Error: no se pudo buscar el la base de datos. Revise el id del paciente." })
    }




}

const actualizarPaciente = async (req, res) => {
    try {
        // Saco el id de la URL
        const { id } = req.params
        // Busco por id
        const paciente = await Paciente.findById(id);

        if (!paciente) {
            return res.status(404).json({ msg: "No se encontraron resultados." })
        }

        // Comprobar que el veterinario autenticado es el mismo que creo al paciente
        // IMPORTANTE: convertir en string para comparar
        if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
            return res.json({ msg: "Acción no valida. El paciente no pertenece a tu lista" })
        }

        // Actualizar paciente
        paciente.nombre = req.body.nombre || paciente.nombre;
        paciente.propietario = req.body.propietario || paciente.propietario;
        paciente.email = req.body.email || paciente.email;
        paciente.fecha = req.body.fecha || paciente.fecha;
        paciente.sintomas = req.body.sintomas || paciente.sintomas;
        // Guardar la actualizacion
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);
    } catch (err) {
        return res.status(404).json({ msg: "Error: no se pudo actualizar el paciente. Revise el id del paciente." })
    }
}

const eliminarPaciente = async (req, res) => {
    try {
        const { id } = req.params
        const paciente = await Paciente.findById(id);

        if (!paciente) {
            return res.status(404).json({ msg: "No se encontraron resultados." })
        }

        if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
            return res.json({ msg: "Acción no valida. El paciente no pertenece a tu lista" })
        }

        await paciente.deleteOne()
        res.json({msg: "Paciente eliminado"});

    } catch (e) {
        return res.status(404).json({ msg: "Error: no se pudo eliminar el paciente. Revise el id del paciente." })
    }
}

export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}