import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DogFlow",
  description: "Plano de treino personalizado para o seu cão.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
