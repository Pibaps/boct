"use client";

import { useLang } from "@/context/LangContext";
import { isMobileBuild } from "@/config/buildMode";
import GrimoireClient from "./GrimoireClient";

export default function GrimoirePage() {
  const { t } = useLang();

  return (
    <div className="grimoire-page overflow-x-hidden" style={{ background: "#0a0506", minHeight: "100dvh" }}>
      {/* Header */}
      <div
        className={`text-center relative overflow-hidden ${isMobileBuild ? "pt-24 pb-10 px-4" : "pt-32 pb-12 px-6"}`}
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(139,0,0,0.07) 0%, transparent 70%)",
        }}
      >
        <p className="text-xs tracking-widest uppercase text-cinzel mb-4" style={{ color: "#8B0000" }}>
          {t("Outil du Conteur", "Storyteller Tool")}
        </p>
        <h1
          className="text-cinzel font-black mb-4"
          style={{ fontSize: "clamp(1.8rem, 4vw, 3.5rem)", color: "#f4ebd0" }}
        >
          {t("Le Grimoire", "The Grimoire")}
        </h1>
        <p className="text-baskerville max-w-xl mx-auto" style={{ color: "#c9b891" }}>
          {t(
            "Gérez votre partie en temps réel — composition, rôles, états, jetons et journal de jeu.",
            "Manage your game in real time — composition, roles, states, tokens and game journal."
          )}
        </p>
      </div>

      {/* Content */}
      <div className={`md:px-8 ${isMobileBuild ? "px-5 pb-28" : "px-5 pb-24"}`}>
        <div className="max-w-5xl mx-auto">
          <GrimoireClient />
        </div>
      </div>
    </div>
  );
}
