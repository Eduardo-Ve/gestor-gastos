// proxy.ts (en la raíz, reemplaza a middleware.ts)
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  // puedes dejar el callback vacío si solo quieres proteger rutas
});

export const config = {
  matcher: ["/dashboard/:path*", "/transactions/:path*", "/categories/:path*", "/budgets/:path*"],
};