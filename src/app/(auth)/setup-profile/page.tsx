import type { Metadata } from "next";
import { Suspense } from "react";
import ProfileSetupFormWrapper from "@/components/auth/ProfileSetupFormWrapper";

export const metadata: Metadata = { title: "Lengkapi Profil" };

export default function SetupProfilePage() {
  return (
    <Suspense>
      <ProfileSetupFormWrapper />
    </Suspense>
  );
}
