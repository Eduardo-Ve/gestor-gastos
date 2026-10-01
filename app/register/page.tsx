import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAuthErrorMessage } from "@/lib/auth-error-message";
import { RegisterForm } from "./register-form";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const [session, params] = await Promise.all([auth(), searchParams]);
  if (session?.user) redirect("/dashboard");

  return (
    <div className="min-h-screen flex items-stretch md:items-center justify-center bg-background text-foreground md:p-6">
      <RegisterForm googleErrorMessage={getAuthErrorMessage(params.error)} />
    </div>
  );
}