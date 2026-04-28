"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import ProfileSetupForm from "@/components/auth/ProfileSetupForm";

export default function ProfileSetupFormWrapper() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else {
        setReady(true);
      }
    }
  }, [user, loading, router]);

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="skeleton w-full max-w-[500px] h-[420px] rounded-3xl" />
      </div>
    );
  }

  return (
    <ProfileSetupForm
      uid={user!.uid}
      initialName={user!.displayName?.split(" ")[0] ?? ""}
    />
  );
}
