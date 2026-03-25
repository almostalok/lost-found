interface BadgeProps {
  variant?: "lost" | "found" | "claimed" | "returned";
  children: React.ReactNode;
}

const variants = {
  lost: "bg-red-500/10 text-red-400 border border-red-500/20",
  found: "bg-green-500/10 text-green-400 border border-green-500/20",
  claimed: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  returned: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
};

export function Badge({ variant = "lost", children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${variants[variant]}`}>
      {children}
    </span>
  );
}
