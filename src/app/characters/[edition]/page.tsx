"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import CharacterCard from "@/components/CharacterCard";
import { useLang } from "@/context/LangContext";
import { editionArtwork } from "@/data/characterArtwork";
import { charactersByEdition, charactersByType, editionMeta, type Edition } from "@/data/characters";

interface Props {
  params: Promise<{ edition: string }>;
}

export default function EditionPage({ params }: Props) {
  const { edition } = use(params);
  const editionId = edition as Edition;

  const { t } = useLang();
  const ed = editionMeta[editionId];
  if (!ed) notFound();

  const chars = charactersByEdition[editionId] ?? [];
  const grouped = charactersByType(chars);

  const sections: Array<{ key: keyof typeof grouped; labelFr: string; labelEn: string }> = [
    { key: "townsfolk", labelFr: "Villageois", labelEn: "Townsfolk" },
    { key: "outsider", labelFr: "Étrangers", labelEn: "Outsiders" },
    { key: "minion", labelFr: "Sbires", labelEn: "Minions" },
    { key: "demon", labelFr: "Démons", labelEn: "Demons" },
  ];

  return (
    <div style={{ background: "#0a0506", minHeight: "100dvh" }}>
      {/* Hero */}
      <div
        className="pt-32 pb-20 px-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${ed.color}18 0%, transparent 60%)`,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${ed.color}25 0%, transparent 70%)`,
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {editionArtwork[editionId] ? (
            <Image
              src={editionArtwork[editionId]}
              alt={t(ed.nameFr, ed.nameEn)}
              width={80}
              height={80}
              className="w-20 h-20 rounded-xl object-cover mx-auto mb-6"
            />
          ) : (
            <div className="text-5xl mb-6">{ed.icon}</div>
          )}
          <h1
            className="text-cinzel font-black mb-3"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: ed.colorAccent }}
          >
            {t(ed.nameFr, ed.nameEn)}
          </h1>
          <p className="text-xs tracking-widest uppercase text-cinzel mb-6" style={{ color: ed.color }}>
            {t(ed.taglineFr, ed.tagline)}
          </p>
          <div className="h-px max-w-xs mx-auto mb-6" style={{ background: `linear-gradient(to right, transparent, ${ed.color}, transparent)` }} />
          <p className="text-baskerville text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: "#c9b891" }}>
            {t(ed.synopsisFr, ed.synopsis)}
          </p>
          <div className="flex justify-center gap-6 mt-8">
            <div className="text-center">
              <div className="text-cinzel text-2xl font-bold" style={{ color: ed.colorAccent }}>{chars.length}</div>
              <div className="text-xs text-cinzel tracking-widest uppercase" style={{ color: "#6b7a8d" }}>{t("Personnages", "Characters")}</div>
            </div>
            {sections.map(({ key, labelFr, labelEn }) => (
              <div key={key} className="text-center">
                <div className="text-cinzel text-2xl font-bold" style={{ color: ed.colorAccent }}>{grouped[key].length}</div>
                <div className="text-xs text-cinzel tracking-widest uppercase" style={{ color: "#6b7a8d" }}>{t(labelFr, labelEn)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Characters by type */}
      <div className="px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-16">
          {sections.map(({ key, labelFr, labelEn }) => {
            const list = grouped[key];
            if (!list.length) return null;
            return (
              <section key={key}>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-cinzel font-bold text-xl" style={{ color: "#f4ebd0" }}>
                    {t(labelFr, labelEn)}
                  </h2>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full text-cinzel"
                    style={{ background: "rgba(20,8,13,0.7)", color: "#6b7a8d", border: "1px solid rgba(107,122,141,0.2)" }}
                  >
                    {list.length}
                  </span>
                  <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, rgba(139,0,0,0.3), transparent)" }} />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {list.map((char) => (
                    <CharacterCard key={char.id} character={char} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
