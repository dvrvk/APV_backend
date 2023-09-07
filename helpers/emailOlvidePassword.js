import nodemailer from "nodemailer";

const emailOlvidePassord = async (datos) => {
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
        subject: 'Restablece tu password',
        text: 'Restablece tu password',
        html:`<p>Hola: ${nombre}, restablece el password de tu cuenta en APV.</p>
            <p> Pincha en el siguiente enlace para generar un nuevo password: 
                <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer password</a>
            </p>
            <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
    });

    console.log("Mensaje enviado: %s", info.messageId);

}

export default emailOlvidePassord;