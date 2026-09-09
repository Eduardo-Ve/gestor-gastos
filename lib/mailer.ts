import nodemailer from "nodemailer";

function createTransporter() {
  const user = process.env.GMAIL_USER;
  const appPassword = process.env.GMAIL_APP_PASSWORD;

  if (!user) {
    throw new Error("GMAIL_USER no está configurado");
  }

  if (appPassword) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass: appPassword },
    });
  }

  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Configura GMAIL_APP_PASSWORD o las variables OAuth2 de Gmail"
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user,
      clientId,
      clientSecret,
      refreshToken,
    },
  });
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const user = process.env.GMAIL_USER;
  if (!user) {
    throw new Error("GMAIL_USER no está configurado");
  }

  const transporter = createTransporter();
  const safeResetUrl = resetUrl.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

  return transporter.sendMail({
    from: `Finanzas <${user}>`,
    to: email,
    subject: "Restablece tu contraseña de Finanzas",
    text: [
      "Finanzas",
      "",
      "Restablece tu contraseña",
      "Recibimos una solicitud para crear una nueva contraseña.",
      "",
      `Abre este enlace: ${resetUrl}`,
      "",
      "El enlace expira en 60 minutos. Si no solicitaste este cambio, puedes ignorar este correo.",
    ].join("\n"),
    html: `
      <!doctype html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Restablece tu contraseña</title>
        </head>
        <body style="margin:0; padding:0; background-color:#09090b; font-family:Arial,Helvetica,sans-serif; color:#f4f4f5;">
          <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
            Crea una nueva contraseña para volver a entrar a Finanzas.
          </div>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#09090b; padding:32px 16px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;">
                  <tr>
                    <td style="padding:0 0 20px 4px;">
                      <span style="font-size:19px; font-weight:700; letter-spacing:-0.2px; color:#f4f4f5;">Finanzas</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color:#151517; border:1px solid #29292e; border-radius:12px; padding:40px 36px;">
                      <div style="width:44px; height:44px; line-height:44px; text-align:center; border-radius:10px; background-color:#f4f4f5; color:#09090b; font-size:22px; font-weight:700;">F</div>
                      <h1 style="margin:26px 0 12px; font-size:25px; line-height:1.2; font-weight:700; color:#f4f4f5;">Restablece tu contraseña</h1>
                      <p style="margin:0; font-size:15px; line-height:1.6; color:#a1a1aa;">Recibimos una solicitud para crear una nueva contraseña para tu cuenta.</p>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:28px 0;">
                        <tr>
                          <td style="border-radius:7px; background-color:#22c55e;">
                            <a href="${safeResetUrl}" style="display:inline-block; padding:13px 20px; border-radius:7px; color:#09090b; font-size:14px; font-weight:700; text-decoration:none;">Crear nueva contraseña</a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin:0 0 10px; font-size:12px; line-height:1.6; color:#a1a1aa;">Este enlace expira en 60 minutos y solo puede utilizarse una vez.</p>
                      <p style="margin:0; font-size:12px; line-height:1.6; color:#a1a1aa;">Si el botón no funciona, copia este enlace en tu navegador:</p>
                      <p style="margin:8px 0 0; word-break:break-all; font-size:12px; line-height:1.6;"><a href="${safeResetUrl}" style="color:#86efac; text-decoration:underline;">${safeResetUrl}</a></p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:22px 4px 0;">
                      <p style="margin:0; font-size:12px; line-height:1.6; color:#71717a;">Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña no se modificara.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}