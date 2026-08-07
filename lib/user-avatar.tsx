// lib/user-avatar.tsx
import { getAvatarIconKey, AVATAR_ICONS, AVATAR_COLORS } from "@/lib/avatar-icons";

interface UserAvatarProps {
  image?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
}

export function UserAvatar({ image, name, size = 32, className = "" }: UserAvatarProps) {
  const iconKey = getAvatarIconKey(image);

  if (iconKey) {
    const Icon = AVATAR_ICONS[iconKey];
    return (
      <div
        className={`rounded-full ${AVATAR_COLORS[iconKey]} flex items-center justify-center shrink-0 ring-2 ring-white/10 ${className}`}
        style={{ width: size, height: size }}
      >
        <Icon size={Math.round(size * 0.55)} className="text-white" strokeWidth={2} />
      </div>
    );
  }

  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={image}
        alt={name ?? "Avatar"}
        className={`rounded-full object-cover shrink-0 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  const initials = (name ?? "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={`rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold shrink-0 ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
    >
      {initials}
    </div>
  );
}