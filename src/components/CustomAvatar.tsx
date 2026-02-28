"use client";

import type { AvatarComponent } from "@rainbow-me/rainbowkit";

// DiceBear styles: bottts (3D robots), avataaars (cartoon), lorelei (illustrated)
const AVATAR_STYLES = ["bottts", "avataaars", "lorelei"] as const;

function getStyleFromAddress(address: string): (typeof AVATAR_STYLES)[number] {
  const hash = address.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_STYLES[hash % AVATAR_STYLES.length];
}

export const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
  if (ensImage) {
    return (
      <img
        src={ensImage}
        width={size}
        height={size}
        alt="Avatar"
        className="rounded-full object-cover ring-2 ring-white/20"
        style={{ width: size, height: size }}
      />
    );
  }

  const style = getStyleFromAddress(address);
  const src = `https://api.dicebear.com/7.x/${style}/svg?seed=${address}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt="Avatar"
      className="rounded-full object-cover ring-2 ring-white/30 shadow-lg"
      style={{ width: size, height: size }}
    />
  );
};
