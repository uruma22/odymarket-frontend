"use client";

import type { AvatarComponent } from "@rainbow-me/rainbowkit";

// Приятные пастельные цвета
const PASTEL_COLORS = [
  "#b8d4e8", // голубой
  "#e8d4b8", // песочный
  "#d4e8d4", // мятный
  "#e8d4e8", // лавандовый
  "#d4d4e8", // сиреневый
  "#e8e8d4", // кремовый
  "#d8e8f0", // небесный
  "#f0e8d8", // персиковый
];

function getColorFromAddress(address: string): string {
  const hash = address
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return PASTEL_COLORS[hash % PASTEL_COLORS.length];
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

  const color = getColorFromAddress(address);

  return (
    <div
      className="rounded-full ring-2 ring-white/20 flex items-center justify-center text-slate-600 text-xs font-medium"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
    >
      {address.slice(2, 4).toUpperCase()}
    </div>
  );
};
