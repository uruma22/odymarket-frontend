"use client";

const PALETTE = [
  "from-rose-500 to-pink-600",
  "from-violet-500 to-purple-600",
  "from-indigo-500 to-blue-600",
  "from-cyan-500 to-teal-600",
  "from-emerald-500 to-green-600",
  "from-amber-500 to-orange-600",
  "from-fuchsia-500 to-pink-600",
  "from-sky-500 to-indigo-600",
];

function hashAddress(addr: string): number {
  let h = 0;
  for (let i = 0; i < addr.length; i++) {
    h = ((h << 5) - h) + addr.charCodeAt(i);
    h = h & h;
  }
  return Math.abs(h);
}

type Props = {
  address: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function AddressAvatar({ address, size = "md", className = "" }: Props) {
  const colorIndex = hashAddress(address) % PALETTE.length;
  const gradient = PALETTE[colorIndex];
  const char = address.slice(2, 3).toUpperCase(); // first hex digit after 0x

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl",
  };

  return (
    <div
      className={`
        rounded-full flex items-center justify-center font-bold text-white
        bg-gradient-to-br ${gradient} shadow-lg ring-2 ring-white/20
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {char}
    </div>
  );
}
