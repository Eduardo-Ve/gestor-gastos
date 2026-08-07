"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { updateProfile, changePassword } from "./actions";
import { UserAvatar } from "@/lib/user-avatar";
import { AVATAR_ICONS, type AvatarIconKey } from "@/lib/avatar-icons";
import { AVATAR_COLORS } from "@/lib/avatar-icons";
type Profile = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  hasPassword: boolean;
  hasGoogleAccount: boolean;
  selectedIcon: AvatarIconKey | null;
};

export function SettingsClient({ profile }: { profile: Profile }) {
  const [name, setName] = useState(profile.name ?? "");
  const [pickedIcon, setPickedIcon] = useState<AvatarIconKey | null>(profile.selectedIcon);
  const [showPicker, setShowPicker] = useState(!profile.hasGoogleAccount || !!profile.selectedIcon);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  // Preview: si el usuario todavía no tocó el picker, mostramos lo que ya está guardado (foto de Google o ícono actual)
  const previewImage = pickedIcon ? `icon:${pickedIcon}` : profile.image;

  async function handleSaveProfile() {
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      await updateProfile({ name, avatarIcon: pickedIcon });
      setProfileMsg("Perfil actualizado.");
    } catch (e) {
      setProfileMsg(e instanceof Error ? e.message : "Error al guardar.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword() {
    setPasswordMsg(null);
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "Las contraseñas nuevas no coinciden." });
      return;
    }
    setSavingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setPasswordMsg({ type: "ok", text: "Contraseña actualizada." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e) {
      setPasswordMsg({ type: "error", text: e instanceof Error ? e.message : "Error al cambiar la contraseña." });
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground px-5 py-6 md:px-8 md:py-8 max-w-2xl mx-auto">
      <h1 className="text-lg font-semibold tracking-tight mb-6">Configuración</h1>

      {/* Perfil */}
      <div className="bg-card border border-border rounded-lg p-5 mb-6">
        <p className="text-sm font-medium mb-4">Perfil</p>

        <div className="flex items-center gap-4 mb-4">
          <UserAvatar image={previewImage} name={name} size={56} />
          <div className="flex-1">
            {profile.hasGoogleAccount && !showPicker ? (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Usando tu foto de Google</p>
                <button
                  onClick={() => setShowPicker(true)}
                  className="text-xs text-primary hover:underline"
                >
                  Usar un ícono en su lugar
                </button>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Elige un ícono para tu avatar</p>
            )}
          </div>
        </div>

{showPicker && (
  <div className="flex flex-wrap gap-3 mb-4">
    {(Object.keys(AVATAR_ICONS) as AvatarIconKey[]).map((key) => {
      const Icon = AVATAR_ICONS[key];
      const selected = pickedIcon === key;
      return (
        <button
          key={key}
          onClick={() => setPickedIcon(key)}
          className={`relative w-11 h-11 rounded-full ${AVATAR_COLORS[key]} flex items-center justify-center transition-transform hover:scale-105 ${
            selected ? "ring-2 ring-offset-2 ring-offset-card ring-foreground" : ""
          }`}
        >
          <Icon size={20} className="text-white" strokeWidth={2} />
        </button>
      );
    })}
  </div>
)}

        <label className="text-xs text-muted-foreground block mb-1">Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm mb-1 focus:outline-none focus:border-foreground/40"
        />

        <p className="text-xs text-muted-foreground mb-4">{profile.email} (no editable)</p>

        {profileMsg && <p className="text-xs text-muted-foreground mb-3">{profileMsg}</p>}

        <button
          onClick={handleSaveProfile}
          disabled={savingProfile}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          {savingProfile ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>

      {/* Contraseña */}
      <div className="bg-card border border-border rounded-lg p-5 mb-6">
        <p className="text-sm font-medium mb-1">
          {profile.hasPassword ? "Cambiar contraseña" : "Definir contraseña"}
        </p>
        {!profile.hasPassword && (
          <p className="text-xs text-muted-foreground mb-4">
            Entraste con Google y todavía no tenés contraseña. Podés definir una para poder iniciar sesión también con email.
          </p>
        )}

        {profile.hasPassword && (
          <div className="mb-3">
            <label className="text-xs text-muted-foreground block mb-1">Contraseña actual</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-foreground/40"
            />
          </div>
        )}

        <div className="mb-3">
          <label className="text-xs text-muted-foreground block mb-1">Nueva contraseña</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-foreground/40"
          />
        </div>

        <div className="mb-4">
          <label className="text-xs text-muted-foreground block mb-1">Confirmar nueva contraseña</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-foreground/40"
          />
        </div>

        {passwordMsg && (
          <p className={`text-xs mb-3 ${passwordMsg.type === "error" ? "text-rose-500" : "text-emerald-500"}`}>
            {passwordMsg.text}
          </p>
        )}

        <button
          onClick={handleChangePassword}
          disabled={savingPassword || !newPassword}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          {savingPassword ? "Guardando..." : profile.hasPassword ? "Actualizar contraseña" : "Definir contraseña"}
        </button>
      </div>

      <button onClick={() => signOut({ callbackUrl: "/login" })} className="text-sm text-rose-500 hover:underline">
        Cerrar sesión
      </button>
    </div>
  );
}