import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAuthErrorMessage } from "@/lib/auth-error-message";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const [session, params] = await Promise.all([auth(), searchParams]);
  if (session?.user?.id) redirect("/dashboard");

  return <LoginForm googleErrorMessage={getAuthErrorMessage(params.error)} />;
}