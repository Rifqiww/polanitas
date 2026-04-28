"use client";
import { useAuth } from "@/components/auth/AuthProvider";

export function UserChip() {
  const { user, loading } = useAuth();
  if (loading) return <div className="skeleton w-20 h-7 rounded-full" />;
  const name = user?.displayName?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "Pengguna";
  const defaultAvatar = name.length % 2 === 0 ? "/profile/boy.svg" : "/profile/girl.svg";
  
  return (
    <div className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-border bg-surface text-[0.8125rem] font-bold text-secondary shadow-sm">
      <div className="w-[26px] h-[26px] rounded-full overflow-hidden bg-surface-2">
        <img
          src={user?.photoURL || defaultAvatar}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <span className="hidden sm:inline">{name}</span>
    </div>
  );
}
