import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import conectarDB from "./config/db.js";
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js';


const app = express();
// Habilitamos el uso de datos JSON
app.use(express.json());

dotenv.config();

const PORT = process.env.PORT || 4000;
conectarDB();

// policy CORS - dominios autorizados a realizar peticiones
const dominiosPermitidos = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: function (origin, callback) {
        // Si encuentra el dominio (origin) dentro de la lista de permitidos
        if (dominiosPermitidos.indexOf(origin) !== -1) {
            // El origien del Request esta permitido
            callback(null, true)
        } else {
            callback(new Error('No permitido por CORS'))
        }
    }
}

app.use(cors(corsOptions));

// Routing
app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes);


app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`)
})






