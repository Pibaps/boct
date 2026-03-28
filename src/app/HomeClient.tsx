"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/context/LangContext";
import { isMobileBuild } from "@/config/buildMode";
import { editionMeta } from "@/data/characters";
import { allCharacters } from "@/data/characters";
import { editionArtwork } from "@/data/characterArtwork";
import CharacterCard from "@/components/CharacterCard";

// Deterministic pseudo-random based on seed (for hydration consistency)
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Mist particles for hero
function Particles() {
  const particleCount = isMobileBuild ? 6 : 12;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: particleCount }).map((_, i) => {
        const rand1 = seededRandom(i * 1.1);
        const rand2 = seededRandom(i * 2.3);
        const rand3 = seededRandom(i * 3.7);
        const rand4 = seededRandom(i * 4.9);
        
        return (
          <div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: `${rand1 * 300 + 100}px`,
              height: `${rand2 * 300 + 100}px`,
              left: `${rand3 * 100}%`,
              top: `${rand4 * 100}%`,
              background: `radial-gradient(circle, ${
                i % 3 === 0
                  ? "rgba(139,0,0,0.3)"
                  : i % 3 === 1
                  ? "rgba(26,10,46,0.4)"
                  : "rgba(201,168,76,0.1)"
              } 0%, transparent 70%)`,
              animation: `drift-up ${6 + i * 0.8}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        );
      })}
    </div>
  );
}

// Animated section reveal on scroll
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

function RevealSection({
  children,
  className,
  style,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// Decorative divider
function BloodDivider() {
  return (
    <div className="flex items-center gap-4 my-2">
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(139,0,0,0.4))" }} />
      <span style={{ color: "#8B0000", fontSize: "1.2rem" }}>✦</span>
      <div className="w-2 h-2 rotate-45" style={{ background: "#8B0000", opacity: 0.6 }} />
      <span style={{ color: "#c9a84c", fontSize: "0.8rem" }}>✦</span>
      <div className="w-2 h-2 rotate-45" style={{ background: "#8B0000", opacity: 0.6 }} />
      <span style={{ color: "#8B0000", fontSize: "1.2rem" }}>✦</span>
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(139,0,0,0.4))" }} />
    </div>
  );
}

export default function HomeClient() {
  const { t } = useLang();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const featuredChars = allCharacters.slice(0, 6);

  return (
    <div style={{ background: "#0a0506" }}>

      {/* ══════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-dvh flex items-center justify-center overflow-hidden"
        style={{ paddingTop: isMobileBuild ? "5rem" : "80px" }}
      >
        {/* Real hero background image - slowest parallax layer */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ transform: `translateY(${scrollY * 0.25}px) scale(1.15)` }}
        >
          <Image
            src="/assets/botc/bloodontheclocktower.com/hero_bg-min-9fd1b4097f.jpg"
            alt=""
            fill
            className="object-cover object-center"
            style={{ opacity: 0.28 }}
            priority
            loading="eager"
          />
        </div>

        {/* Parallax background layers */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 20% 50%, rgba(139,0,0,0.18) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, rgba(26,10,46,0.35) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 100%, rgba(92,0,0,0.25) 0%, transparent 60%),
              linear-gradient(to bottom, rgba(10,5,6,0.3) 0%, rgba(10,5,6,0.1) 50%, rgba(10,5,6,0.85) 100%)
            `,
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(201,168,76,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(201,168,76,0.3) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            transform: `translateY(${scrollY * 0.15}px)`,
          }}
        />

        {/* Floating particles */}
        <Particles />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Pre-title badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs tracking-widest uppercase mb-8"
            style={{
              background: "rgba(139,0,0,0.12)",
              border: "1px solid rgba(139,0,0,0.3)",
              color: "#e87777",
              animation: "fadeInUp 0.6s ease both",
            }}
          >
            <span style={{ color: "#8B0000" }}>●</span>
            {t("Guide Complet du Jeu", "Complete Game Guide")}
          </div>

          {/* Main title */}
          <div
            style={{
              animation: "fadeInUp 0.7s cubic-bezier(0.25,0.46,0.45,0.94) 0.1s both",
            }}
          >
            <h1
              className="text-cinzel font-black leading-none tracking-tight"
              style={{
                fontSize: "clamp(2.5rem, 8vw, 7rem)",
                color: "#f4ebd0",
                textShadow: "0 0 80px rgba(139,0,0,0.3), 0 4px 20px rgba(0,0,0,0.8)",
              }}
            >
              Blood on the
            </h1>
            <h1
              className="text-cinzel font-black leading-none tracking-tight"
              style={{
                fontSize: "clamp(2.5rem, 8vw, 7rem)",
                background: "linear-gradient(135deg, #c9a84c 0%, #f4ebd0 40%, #e8c870 60%, #c9a84c 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "shimmer 4s linear infinite",
                textShadow: "none",
              }}
            >
              Clocktower
            </h1>
          </div>

          {/* Divider */}
          <div
            style={{
              animation: "fadeInUp 0.7s ease 0.25s both",
            }}
          >
            <BloodDivider />
          </div>

          {/* Subtitle */}
          <p
            className="text-baskerville text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mt-6"
            style={{
              color: "#c9b891",
              animation: "fadeInUp 0.7s ease 0.35s both",
            }}
          >
            {t(
              "Un jeu de déduction sociale où les bons cherchent à identifier le Démon, et les maléfiques cherchent à rester cachés jusqu'à la fin.",
              "A social deduction game where the good team races to identify the Demon, and the evil team conspires to stay hidden until only darkness remains."
            )}
          </p>

          {/* CTA buttons */}
          <div
            className="flex flex-wrap justify-center gap-4 mt-10"
            style={{ animation: "fadeInUp 0.7s ease 0.45s both" }}
          >
            <Link
              href="/rules"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #8B0000, #5c0000)",
                color: "#f4ebd0",
                boxShadow: "0 4px 20px rgba(139,0,0,0.4), 0 0 0 1px rgba(201,168,76,0.2)",
                fontFamily: "var(--font-cinzel-var), serif",
              }}
            >
              {t("Commencer à Jouer", "Start Playing")}
            </Link>
            <Link
              href="/characters"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
              style={{
                background: "transparent",
                color: "#c9a84c",
                border: "1px solid rgba(201,168,76,0.35)",
                boxShadow: "0 4px 20px rgba(201,168,76,0.1)",
                fontFamily: "var(--font-cinzel-var), serif",
              }}
            >
              {t("Explorer les Personnages", "Explore Characters")}
            </Link>
          </div>
        </div>

        {/* Atmospheric character art — parallax foreground */}
        <div
          className="absolute right-0 bottom-0 w-56 md:w-80 lg:w-96 pointer-events-none select-none hidden sm:block"
          style={{
            transform: `translateY(${scrollY * 0.1}px)`,
            maskImage: "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.5) 20%, black 55%)",
            WebkitMaskImage: "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.5) 20%, black 55%)",
            opacity: 0.55,
          }}
        >
          <Image
            src="/assets/botc/bloodontheclocktower.com/splashpage_mayor_1-a3bdbf7aa7.webp"
            alt=""
            width={420}
            height={620}
            className="w-full h-auto object-contain object-bottom"
            priority
            loading="eager"
          />
        </div>

        {/* Atmospheric djinn art on the left — slowest foreground layer */}
        <div
          className="absolute left-0 bottom-0 w-40 md:w-60 pointer-events-none select-none hidden lg:block"
          style={{
            transform: `translateY(${scrollY * 0.05}px)`,
            maskImage: "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.3) 30%, black 65%)",
            WebkitMaskImage: "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.3) 30%, black 65%)",
            opacity: 0.4,
          }}
        >
          <Image
            src="/assets/botc/bloodontheclocktower.com/wow-image_Picture_splashpage_djinn_1_png-ba6c944234.png"
            alt=""
            width={320}
            height={480}
            className="w-full h-auto object-contain object-bottom"
            priority
            loading="eager"
          />
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: "#6b7a8d", animation: "float 3s ease-in-out infinite" }}
        >
          <span className="text-xs tracking-widest uppercase text-cinzel">
            {t("Défiler", "Scroll")}
          </span>
          <div
            className="w-5 h-8 rounded-full border flex items-start justify-center pt-1.5"
            style={{ borderColor: "rgba(107,122,141,0.4)" }}
          >
            <div
              className="w-1 h-2 rounded-full"
              style={{
                background: "#8B0000",
                animation: "driftUp 1.5s ease-in-out infinite alternate",
              }}
            />
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          WHAT IS THIS GAME?
      ══════════════════════════════════════════════════════ */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <RevealSection className="text-center mb-16">
            <p className="text-xs tracking-widest uppercase text-cinzel mb-4" style={{ color: "#8B0000" }}>
              {t("Le Jeu", "The Game")}
            </p>
            <h2
              className="text-cinzel font-bold"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)", color: "#f4ebd0" }}
            >
              {t("Qu'est-ce que Blood on the Clocktower ?", "What is Blood on the Clocktower?")}
            </h2>
            <BloodDivider />
          </RevealSection>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <RevealSection>
              <div className="prose-botc space-y-4">
                <p>
                  {t(
                    "Blood on the Clocktower est un jeu de déduction sociale pour 5 à 20 joueurs, conçu par Steven Medway. La partie se déroule dans une ville imaginaire où un Démon se cache parmi les habitants.",
                    "Blood on the Clocktower is a social deduction game for 5–20 players, designed by Steven Medway. The game takes place in a fictional town where a Demon lurks among the residents."
                  )}
                </p>
                <p>
                  {t(
                    "Contrairement à d'autres jeux du genre, les joueurs morts restent actifs et peuvent participer aux discussions. Et surtout : le Conteur peut ressusciter des joueurs, corriger des erreurs narratives et rendre chaque partie unique.",
                    "Unlike similar games, dead players remain active participants. And uniquely: the Storyteller can resurrect players, correct narrative errors, and make every game feel handcrafted."
                  )}
                </p>
                <p>
                  {t(
                    "Chaque personnage possède une capacité spéciale qui s'active la nuit ou le jour. Les bons joueurs reçoivent des informations — vraies ou fausses — et doivent déduire qui est le Démon avant qu'il ne soit trop tard.",
                    "Every character has a special ability that activates at night or day. Good players receive information — true or false — and must deduce the Demon before time runs out."
                  )}
                </p>
              </div>
            </RevealSection>

            <RevealSection delay={0.15}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    icon: "/assets/botc/wiki.bloodontheclocktower.com/Icon_monk-0e97ff394c.png",
                    titleFr: "Phase de Nuit",
                    titleEn: "Night Phase",
                    descFr: "Les joueurs ferment les yeux. Le Conteur réveille les personnages pour collecter des informations ou effectuer des actions.",
                    descEn: "Players close their eyes. The Storyteller wakes characters to gather information or take actions.",
                    accent: "rgba(42,95,168,0.3)",
                  },
                  {
                    icon: "/assets/botc/wiki.bloodontheclocktower.com/Icon_mayor-37b17a5ea8.png",
                    titleFr: "Phase de Jour",
                    titleEn: "Day Phase",
                    descFr: "Discussion libre. Chaque joueur peut nommer un suspect pour le soumettre au vote de la communauté.",
                    descEn: "Open discussion. Players nominate suspects and vote to execute the most dangerous threat.",
                    accent: "rgba(201,168,76,0.2)",
                  },
                  {
                    icon: "/assets/botc/wiki.bloodontheclocktower.com/Icon_librarian-e466eb38b4.png",
                    titleFr: "Le Grimoire",
                    titleEn: "The Grimoire",
                    descFr: "Le livre secret du Conteur — contient tous les jetons et états actuels. Jamais montré aux joueurs.",
                    descEn: "The Storyteller's secret book — holds all tokens and states. Never shown to players.",
                    accent: "rgba(107,63,160,0.2)",
                  },
                  {
                    icon: "/assets/botc/wiki.bloodontheclocktower.com/Icon_investigator-3bc3af9bb4.png",
                    titleFr: "Le Vote",
                    titleEn: "The Vote",
                    descFr: "Les joueurs morts gardent un vote fantôme. En cas d'égalité, personne n'est exécuté.",
                    descEn: "Dead players keep one ghost vote. On a tie, no one is executed.",
                    accent: "rgba(139,0,0,0.25)",
                  },
                ].map(({ icon, titleFr, titleEn, descFr, descEn, accent }) => (
                  <div
                    key={titleEn}
                    className="p-4 rounded-xl relative overflow-hidden"
                    style={{
                      background: `linear-gradient(145deg, ${accent}, rgba(20,8,13,0.9))`,
                      border: "1px solid rgba(201,168,76,0.1)",
                    }}
                  >
                    {/* Token icon */}
                    <div className="relative w-10 h-10 rounded-full mb-3 overflow-hidden shrink-0"
                      style={{ border: "1px solid rgba(201,168,76,0.25)", background: "rgba(10,5,6,0.6)" }}
                    >
                      <Image src={icon} alt="" fill sizes="40px" className="object-cover" />
                    </div>
                    <h4 className="text-cinzel text-sm font-semibold mb-1.5" style={{ color: "#c9a84c" }}>
                      {t(titleFr, titleEn)}
                    </h4>
                    <p className="text-xs leading-relaxed" style={{ color: "#6b7a8d" }}>
                      {t(descFr, descEn)}
                    </p>
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          THE EDITIONS
      ══════════════════════════════════════════════════════ */}
      <section
        className="py-32 px-6"
        style={{
          background: "linear-gradient(180deg, #0a0506 0%, rgba(20,8,13,0.95) 50%, #0a0506 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <RevealSection className="text-center mb-16">
            <p className="text-xs tracking-widest uppercase text-cinzel mb-4" style={{ color: "#8B0000" }}>
              {t("Les Éditions", "Editions")}
            </p>
            <h2
              className="text-cinzel font-bold"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)", color: "#f4ebd0" }}
            >
              {t("Trois Éditions, Trois Expériences", "Three Editions, Three Experiences")}
            </h2>
            <BloodDivider />
            <p className="text-baskerville max-w-xl mx-auto mt-4" style={{ color: "#c9b891" }}>
              {t(
                "Chaque édition propose un ensemble de personnages et une atmosphère distincte, du débutant au vétéran.",
                "Each edition offers a distinct character roster and atmosphere, from newcomer-friendly to veteran complexity."
              )}
            </p>
          </RevealSection>

          <div className="grid md:grid-cols-3 gap-6">
            {(["trouble-brewing", "bad-moon-rising", "sects-and-violets"] as const).map((edId, i) => {
              const ed = editionMeta[edId];
              return (
                <RevealSection key={edId} delay={i * 0.12}>
                  <Link href={`/characters/${edId}`} className="block card-botc h-full group">
                    <div
                      className="h-full flex flex-col p-6"
                      style={{
                        background: `linear-gradient(145deg, rgba(20,8,13,0.97) 0%, rgba(10,5,6,1) 100%)`,
                        border: `1px solid ${ed.color}40`,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {/* Glow background */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: `radial-gradient(ellipse at 50% 0%, ${ed.color}20 0%, transparent 70%)`,
                        }}
                      />

                      <div className="relative z-10">
                        <div className="mb-4">
                          <Image
                            src={editionArtwork[edId]}
                            alt={t(ed.nameFr, ed.nameEn)}
                            width={64}
                            height={64}
                            className="h-16 w-auto"
                          />
                        </div>
                        <h3
                          className="text-cinzel font-bold text-xl mb-1"
                          style={{ color: ed.colorAccent }}
                        >
                          {t(ed.nameFr, ed.nameEn)}
                        </h3>
                        <p
                          className="text-xs tracking-widest uppercase mb-4 text-cinzel"
                          style={{ color: ed.color }}
                        >
                          {t(ed.taglineFr, ed.tagline)}
                        </p>
                        <div className="h-px mb-4" style={{ background: `linear-gradient(to right, ${ed.color}60, transparent)` }} />
                        <p className="text-sm leading-relaxed" style={{ color: "#9ca8b5" }}>
                          {t(ed.synopsisFr, ed.synopsis)}
                        </p>
                        <div className="mt-6 flex items-center gap-2 text-xs font-semibold tracking-wide" style={{ color: ed.colorAccent }}>
                          <span className="text-cinzel uppercase tracking-widest">{t("Explorer", "Explore")}</span>
                          <span className="transition-transform group-hover:translate-x-1 duration-200">→</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </RevealSection>
              );
            })}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          FEATURED CHARACTERS
      ══════════════════════════════════════════════════════ */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <RevealSection className="text-center mb-16">
            <p className="text-xs tracking-widest uppercase text-cinzel mb-4" style={{ color: "#8B0000" }}>
              {t("Personnages", "Characters")}
            </p>
            <h2
              className="text-cinzel font-bold"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)", color: "#f4ebd0" }}
            >
              {t("Les Habitants de la Ville", "The Town's Inhabitants")}
            </h2>
            <BloodDivider />
          </RevealSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredChars.map((char, i) => (
              <RevealSection key={char.id} delay={i * 0.08}>
                <CharacterCard character={char} />
              </RevealSection>
            ))}
          </div>

          <RevealSection className="text-center mt-12">
            <Link
              href="/characters"
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-105"
              style={{
                background: "transparent",
                color: "#c9a84c",
                border: "1px solid rgba(201,168,76,0.35)",
                fontFamily: "var(--font-cinzel-var), serif",
              }}
            >
              {t("Voir tous les personnages", "View all characters")}
              <span>→</span>
            </Link>
          </RevealSection>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          GAME ATMOSPHERE GALLERY
      ══════════════════════════════════════════════════════ */}
      {isMobileBuild ? (
        <section className="px-4 py-12">
          <div className="max-w-3xl mx-auto rounded-3xl border px-5 py-6" style={{ background: "rgba(20,8,13,0.65)", borderColor: "rgba(201,168,76,0.14)" }}>
            <p className="text-xs tracking-widest uppercase text-cinzel mb-3" style={{ color: "#8B0000" }}>
              {t("L'Atmosphère du Jeu", "The Game Atmosphere")}
            </p>
            <h2 className="text-cinzel font-bold mb-3" style={{ fontSize: "clamp(1.45rem, 4vw, 2rem)", color: "#f4ebd0" }}>
              {t("Un univers sombre, lisible en mobilité", "A dark world designed for mobile clarity")}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#c9b891" }}>
              {t(
                "Sur mobile, l’accueil garde l’essentiel et retire les galeries les plus lourdes pour rester rapide, lisible et confortable hors ligne.",
                "On mobile, the home keeps the essentials and removes the heaviest galleries to stay fast, readable, and offline-friendly."
              )}
            </p>
          </div>
        </section>
      ) : (
      <section className="relative overflow-hidden py-0 my-0">
        {/* Section label */}
        <div className="relative z-10 py-10 text-center">
          <p className="text-xs tracking-widest uppercase text-cinzel" style={{ color: "rgba(201,168,76,0.4)" }}>
            {t("L'Atmosphère du Jeu", "The Game Atmosphere")}
          </p>
        </div>

        {/* Scrolling reel gallery — two rows, opposite directions */}
        <div
          className="overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        >
          {/* Row 1 — scrolls left */}
          <div
            className="flex gap-3 mb-3"
            style={{ animation: "marqueeLeft 35s linear infinite", width: "max-content" }}
          >
            {[
              "/assets/botc/bloodontheclocktower.com/clocktower_reel_1-e5f5653717.webp",
              "/assets/botc/bloodontheclocktower.com/clocktower_reel_2-f9ae64e53b.webp",
              "/assets/botc/bloodontheclocktower.com/clocktower_reel_3-daf97ce31d.webp",
              "/assets/botc/bloodontheclocktower.com/clocktower_reel_4-aad7f20c3d.webp",
              "/assets/botc/bloodontheclocktower.com/clocktower_reel_5-686b9245ff.webp",
              "/assets/botc/bloodontheclocktower.com/clocktower_reel_6-eb7ea0e80d.webp",
              "/assets/botc/bloodontheclocktower.com/clocktower_reel_7-0055138da7.webp",
              "/assets/botc/bloodontheclocktower.com/clocktower_reel_10-4c3c93cffd.jpg",
              // Duplicate for seamless loop
              "/assets/botc/bloodontheclocktower.com/clocktower_reel_1-e5f5653717.webp",
              "/assets/botc/bloodontheclocktower.com/clocktower_reel_2-f9ae64e53b.webp",
              "/assets/botc/bloodontheclocktower.com/clocktower_reel_3-daf97ce31d.webp",
              "/assets/botc/bloodontheclocktower.com/clocktower_reel_4-aad7f20c3d.webp",
            ].map((src, i) => (
              <div
                key={i}
                className="relative overflow-hidden shrink-0 rounded-lg"
                style={{ width: "280px", height: "170px", border: "1px solid rgba(139,0,0,0.2)" }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="280px"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "rgba(10,5,6,0.3)" }}
                />
              </div>
            ))}
          </div>

          {/* Row 2 — scrolls right */}
          <div
            className="flex gap-3"
            style={{ animation: "marqueeRight 45s linear infinite", width: "max-content" }}
          >
            {[
              "/assets/botc/bloodontheclocktower.com/clocktower_reel_10-4c3c93cffd.jpg",
              "/assets/botc/bloodontheclocktower.com/clocktower_reel_7-0055138da7.webp",
              "/assets/botc/bloodontheclocktower.com/clocktower_reel_6-eb7ea0e80d.webp",
              "/assets/botc/bloodontheclocktower.com/clocktower_reel_5-686b9245ff.webp",
              "/assets/botc/bloodontheclocktower.com/clocktower_reel_4-aad7f20c3d.webp",
              "/assets/botc/bloodontheclocktower.com/clocktower_reel_3-daf97ce31d.webp",
              "/assets/botc/bloodontheclocktower.com/clocktower_reel_2-f9ae64e53b.webp",
              "/assets/botc/bloodontheclocktower.com/clocktower_reel_1-e5f5653717.webp",
              // Duplicate for seamless loop
              "/assets/botc/bloodontheclocktower.com/clocktower_reel_10-4c3c93cffd.jpg",
              "/assets/botc/bloodontheclocktower.com/clocktower_reel_7-0055138da7.webp",
              "/assets/botc/bloodontheclocktower.com/clocktower_reel_6-eb7ea0e80d.webp",
              "/assets/botc/bloodontheclocktower.com/clocktower_reel_5-686b9245ff.webp",
            ].map((src, i) => (
              <div
                key={i}
                className="relative overflow-hidden shrink-0 rounded-lg"
                style={{ width: "280px", height: "170px", border: "1px solid rgba(201,168,76,0.12)" }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="280px"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "rgba(10,5,6,0.25)" }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="py-10" />
      </section>
      )}


      {/* ══════════════════════════════════════════════════════
          GUIDE SECTIONS GRID
      ══════════════════════════════════════════════════════ */}
      <section
        className="py-32 px-6"
        style={{ background: "linear-gradient(180deg, #0a0506, rgba(26,10,46,0.15), #0a0506)" }}
      >
        <div className="max-w-6xl mx-auto">
          <RevealSection className="text-center mb-16">
            <p className="text-xs tracking-widest uppercase text-cinzel mb-4" style={{ color: "#8B0000" }}>
              {t("Le Guide", "The Guide")}
            </p>
            <h2
              className="text-cinzel font-bold"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)", color: "#f4ebd0" }}
            >
              {t("Tout ce qu'il faut savoir", "Everything You Need to Know")}
            </h2>
            <BloodDivider />
          </RevealSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                href: "/rules",
                icon: "/assets/botc/parchemin.png",
                iconAlt: "Règles",
                titleFr: "Règles",
                titleEn: "Rules",
                descFr: "La boucle de jeu, les victoires, les nominations, l'ordre de nuit — tout en détail.",
                descEn: "The game loop, win conditions, nominations, night order — explained in full.",
                accent: "#8B0000",
              },
              {
                href: "/characters",
                icon: "/assets/botc/personnage.png",
                iconAlt: "Personnages",
                titleFr: "Personnages",
                titleEn: "Characters",
                descFr: "Tous les rôles des trois éditions avec leurs capacités complètes.",
                descEn: "Every role across all three editions with full abilities.",
                accent: "#2a5fa8",
              },
              {
                href: "/storyteller",
                icon: "/assets/botc/guide.png",
                iconAlt: "Guide du Conteur",
                titleFr: "Guide du Conteur",
                titleEn: "Storyteller Guide",
                descFr: "Conseils pour animer une partie mémorable : équilibre, rythme, narration.",
                descEn: "Advice for running a memorable game: balance, pacing, storytelling.",
                accent: "#c9a84c",
              },
              {
                href: "/strategy",
                icon: "/assets/botc/cible.png",
                iconAlt: "Stratégie",
                titleFr: "Stratégie",
                titleEn: "Strategy",
                descFr: "Tactiques pour l'équipe bonne et l'équipe maléfique. Bluff, déduction, vote.",
                descEn: "Tactics for both teams. Bluffing, deduction, vote manipulation.",
                accent: "#6b3fa0",
              },
              {
                href: "/glossary",
                icon: "/assets/botc/glossaire.png",
                iconAlt: "Glossaire",
                titleFr: "Glossaire",
                titleEn: "Glossary",
                descFr: "Définitions de tous les termes, états et mécaniques du jeu.",
                descEn: "Definitions of all terms, states, and game mechanics.",
                accent: "#2e7d32",
              },
              {
                href: "/rules#setup",
                icon: "/assets/botc/de.png",
                iconAlt: "Mise en Place",
                titleFr: "Mise en Place",
                titleEn: "Setup",
                descFr: "Comment préparer une partie de A à Z selon le nombre de joueurs.",
                descEn: "How to set up a game from scratch based on player count.",
                accent: "#5c8a5c",
              }
            ].map(({ href, icon, iconAlt, titleFr, titleEn, descFr, descEn, accent }, i) => (
              <RevealSection key={href} delay={i * 0.08}>
                <Link
                  href={href}
                  className="group flex flex-col gap-3 p-6 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: "rgba(20,8,13,0.5)",
                    border: `1px solid ${accent}30`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-7 h-7">
                      <Image src={icon} alt={iconAlt} fill sizes="28px" className="object-contain" />
                    </div>
                    <h3
                      className="text-cinzel font-semibold text-sm tracking-wide"
                      style={{ color: accent }}
                    >
                      {t(titleFr, titleEn)}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#6b7a8d" }}>
                    {t(descFr, descEn)}
                  </p>
                  <div
                    className="flex items-center gap-1 text-xs font-medium mt-auto pt-2 transition-all duration-200 group-hover:gap-2"
                    style={{ color: accent }}
                  >
                    <span className="text-cinzel uppercase tracking-widest text-xs">
                      {t("Lire", "Read")}
                    </span>
                    <span>→</span>
                  </div>
                </Link>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          QUICK RECAP — TEAM GOALS
      ══════════════════════════════════════════════════════ */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <RevealSection className="text-center mb-16">
            <h2
              className="text-cinzel font-bold"
              style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)", color: "#f4ebd0" }}
            >
              {t("Deux Camps, Une Seule Victoire", "Two Sides, One Victory")}
            </h2>
            <BloodDivider />
          </RevealSection>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Good team */}
            <RevealSection>
              <div
                className="p-8 rounded-2xl h-full"
                style={{
                  background: "linear-gradient(145deg, rgba(42,95,168,0.07), rgba(10,5,6,0.95))",
                  border: "1px solid rgba(42,95,168,0.25)",
                }}
              >
                <div
                  className="text-cinzel text-xs tracking-widest uppercase mb-4"
                  style={{ color: "#7fb3e8" }}
                >
                  {t("L'Équipe Bonne", "The Good Team")}
                </div>
                <h3
                  className="text-cinzel text-2xl font-bold mb-2"
                  style={{ color: "#a8ccf0" }}
                >
                  {t("Villageois & Étrangers", "Townsfolk & Outsiders")}
                </h3>
                <div className="h-px mb-6" style={{ background: "rgba(42,95,168,0.3)" }} />
                <ul className="space-y-3">
                  {[
                    t("Recevez des informations la nuit grâce à vos capacités", "Receive information at night through your abilities"),
                    t("Discutez, partagez et déduisez qui est le Démon", "Discuss, share info, and deduce who the Demon is"),
                    t("Nominéz et votez pour exécuter les suspects", "Nominate and vote to execute suspects"),
                    t("Victoire : exécuter le Démon !", "Victory: execute the Demon!"),
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "#9ca8b5" }}>
                      <span style={{ color: "#2a5fa8", marginTop: "2px" }}>◆</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealSection>

            {/* Evil team */}
            <RevealSection delay={0.12}>
              <div
                className="p-8 rounded-2xl h-full"
                style={{
                  background: "linear-gradient(145deg, rgba(139,0,0,0.1), rgba(10,5,6,0.97))",
                  border: "1px solid rgba(139,0,0,0.3)",
                }}
              >
                <div
                  className="text-cinzel text-xs tracking-widest uppercase mb-4"
                  style={{ color: "#e87777" }}
                >
                  {t("L'Équipe Maléfique", "The Evil Team")}
                </div>
                <h3
                  className="text-cinzel text-2xl font-bold mb-2"
                  style={{ color: "#f08080" }}
                >
                  {t("Démon & Sbires", "Demon & Minions")}
                </h3>
                <div className="h-px mb-6" style={{ background: "rgba(139,0,0,0.4)" }} />
                <ul className="space-y-3">
                  {[
                    t("Vous vous connaissez mutuellement dès le début", "You know each other's identities from the start"),
                    t("Mentez, manipulez, bluffez des rôles de Villageois", "Lie, manipulate, bluff Townsfolk identities"),
                    t("Le Démon tue une personne chaque nuit", "The Demon kills one person each night"),
                    t("Victoire : n'être que 2 joueurs vivants, Démon inclus", "Victory: only 2 players alive, Demon among them"),
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "#9ca8b5" }}>
                      <span style={{ color: "#8B0000", marginTop: "2px" }}>◆</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════ */}
      <footer
        className="py-12 px-6 border-t"
        style={{ borderColor: "rgba(139,0,0,0.15)" }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <div
            className="text-cinzel text-xs tracking-widest uppercase mb-2"
            style={{ color: "#c9a84c" }}
          >
            Blood on the Clocktower
          </div>
          <p className="text-xs" style={{ color: "#3d3030" }}>
            {t(
              "Guide non officiel. Blood on the Clocktower est une marque déposée de The Pandemonium Institute.",
              "Unofficial guide. Blood on the Clocktower is a trademark of The Pandemonium Institute."
            )}
          </p>
        </div>
      </footer>

    </div>
  );
}
