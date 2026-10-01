const AUTH_ERROR_MESSAGES: Record<string, string> = {
  AccessDenied: "Se canceló o denegó el inicio de sesión con Google.",
  Callback: "No se pudo completar el inicio de sesión. Inténtalo de nuevo.",
  Configuration: "El inicio de sesión con Google no está configurado. Contacta al administrador.",
  OAuthAccountNotLinked:
    "Ya existe una cuenta con este correo. Inicia sesión con el método original; las cuentas no se vinculan automáticamente.",
  OAuthCallbackError: "Google devolvió un error durante la autenticación. Inténtalo de nuevo.",
  OAuthCreateAccount: "Google no pudo crear la cuenta. Inténtalo de nuevo.",
  OAuthSignin: "No se pudo iniciar el acceso con Google. Inténtalo de nuevo.",
  Signin: "No se pudo iniciar sesión. Inténtalo de nuevo.",
};

export function getAuthErrorMessage(error: string | string[] | undefined) {
  const errorCode = Array.isArray(error) ? error[0] : error;
  if (!errorCode) return undefined;

  return AUTH_ERROR_MESSAGES[errorCode] ?? "No se pudo completar el inicio de sesión. Inténtalo de nuevo.";
}
