import type { Metadata } from "next";
import LandingClient from "@/components/landing/LandingClient";

export const metadata: Metadata = {
  title: "POLANITAS",
  description:
    "POLANITAS: Platform edukasi dan AI Agent Data Analyst dengan 3 agen AI spesialis (Researcher, Strategist, dan Analyst) untuk riset tren dan strategi konten digital.",
};

export default function LandingPage() {
  return <LandingClient />;
}
