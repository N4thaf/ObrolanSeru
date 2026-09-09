import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Main Game Kartu & Truth or Dare Offline - ObrolanSeru",
  description: "Main game kartu obrolan dan Truth or Dare offline langsung di 1 HP bareng teman, pasangan, atau keluarga. Pilih dari 10+ topik seru!",
  keywords: ["game kartu offline", "truth or dare offline HP", "game nongkrong offline", "game icebreaker offline"],
};

export default function OfflineLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
