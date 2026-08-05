// TEMPORAL: reemplazar cuando integre NextAuth con Google
export async function auth() {
  return {
    user: { id: "mock-user-id", name: "Usuario de prueba" },
  };
}