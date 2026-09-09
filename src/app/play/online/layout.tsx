import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Main Game Kartu & Truth or Dare Multiplayer Online - ObrolanSeru",
  description: "Main game kartu obrolan dan Truth or Dare multiplayer online jarak jauh! Buat kode room dan undang teman-temanmu bermain bersama secara real-time.",
  keywords: ["game kartu online multiplayer", "truth or dare online jarak jauh", "game room online indonesia", "mabar game kartu"],
};

export default function OnlineLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
