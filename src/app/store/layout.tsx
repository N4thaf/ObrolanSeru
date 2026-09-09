import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Toko Pass VIP & Koin AI - ObrolanSeru",
  description: "Beli Pass ObrolanSeru murah & cepat via DOKU QRIS! Dapatkan akses penuh ke seluruh topik kartu obrolan eksklusif, Truth or Dare, dan racikan AI tanpa batas.",
  keywords: ["beli pass obrolanseru", "vip obrolanseru", "qris doku obrolanseru", "pass game kartu indonesia"],
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
