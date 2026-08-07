import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getProfile } from "./actions";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const profile = await getProfile();

  return <SettingsClient profile={profile} />;
}