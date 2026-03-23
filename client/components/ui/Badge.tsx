interface BadgeProps {
  variant?: "lost" | "found" | "claimed" | "returned";
  children: React.ReactNode;
}

const variants = {
  lost: "bg-red-100 text-red-700",
  found: "bg-green-100 text-green-700",
  claimed: "bg-yellow-100 text-yellow-700",
  returned: "bg-blue-100 text-blue-700",
};

export function Badge({ variant = "lost", children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}
