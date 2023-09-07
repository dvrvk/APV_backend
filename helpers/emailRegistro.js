import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
    var transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    // Esta información viene de veterinarioController.js -> registrar
    const { nombre, email, token } = datos;
    // Envio el email objeto con configuración.enviar({configuracion})
    const info = await transporter.sendMail({
        from: "APV - Administrador de pacientes de veterinaria",
        to: email,
        subject: 'Verifica tu cuenta en APV',
        text: 'Verifica tu cuenta en APV',
        html:`<p>Hola: ${nombre}, verifica tu cuenta en APV.</p>
            <p> Estas a un paso de confirmar tu cuenta. Pincha en el siguiente enlace: 
                <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a>
            </p>
            <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
    });

    console.log("Mensaje enviado: %s", info.messageId);

}

export default emailRegistro;