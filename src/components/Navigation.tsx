"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/context/LangContext";

type NavMode = "immersive" | "doc";

const navLinks = [
  { href: "/characters", labelFr: "Personnages", labelEn: "Characters" },
  { href: "/rules", labelFr: "Règles", labelEn: "Rules" },
  { href: "/storyteller", labelFr: "Conteur", labelEn: "Storyteller" },
  { href: "/strategy", labelFr: "Stratégie", labelEn: "Strategy" },
  { href: "/glossary", labelFr: "Glossaire", labelEn: "Glossary" },
];

export default function Navigation() {
  const { lang, toggle, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [navMode, setNavMode] = useState<NavMode>("immersive");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDoc = navMode === "doc";

  return (
    <>
      {/* ── Sidebar (doc mode) ─────────────────────────────── */}
      {isDoc && (
        <aside
          className="fixed left-0 top-0 h-dvh w-64 z-40 flex flex-col border-r"
          style={{
            background: "rgba(10,5,6,0.97)",
            borderColor: "rgba(139,0,0,0.3)",
          }}
        >
          <div className="p-6 border-b" style={{ borderColor: "rgba(139,0,0,0.2)" }}>
            <Link href="/" className="block">
              <div
                className="text-cinzel text-sm font-bold tracking-widest uppercase"
                style={{ color: "#c9a84c" }}
              >
                ☽ BOTC
              </div>
              <div
                className="text-cinzel text-xs tracking-wider mt-0.5 opacity-60"
                style={{ color: "#c9b891" }}
              >
                {t("Guide du Jeu", "Game Guide")}
              </div>
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            {navLinks.map(({ href, labelFr, labelEn }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-6 py-3 text-sm transition-all duration-200 group"
                style={{ color: "#c9b891" }}
              >
                <span
                  className="w-1 h-5 rounded-full transition-all duration-300 group-hover:h-7"
                  style={{ background: "rgba(139,0,0,0.6)" }}
                />
                <span className="nav-link group-hover:translate-x-1 transition-transform duration-200 text-cinzel tracking-wide text-xs uppercase">
                  {t(labelFr, labelEn)}
                </span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t flex items-center justify-between" style={{ borderColor: "rgba(139,0,0,0.2)" }}>
            <ModeToggle navMode={navMode} setNavMode={setNavMode} t={t} />
            <LangButton lang={lang} toggle={toggle} />
          </div>
        </aside>
      )}

      {/* ── Topbar (immersive mode) ────────────────────────── */}
      {!isDoc && (
        <header
          className="fixed top-0 left-0 right-0 z-40 transition-all duration-500"
          style={{
            background: scrolled
              ? "rgba(10,5,6,0.92)"
              : "transparent",
            backdropFilter: scrolled ? "blur(12px)" : "none",
            borderBottom: scrolled
              ? "1px solid rgba(139,0,0,0.25)"
              : "none",
          }}
        >
          <div
            className="mx-auto flex items-center justify-between px-6 py-4"
            style={{ maxWidth: "1320px" }}
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300 group-hover:scale-110"
                style={{
                  background: "radial-gradient(circle, #8B0000 0%, #3d0000 100%)",
                  boxShadow: "0 0 15px rgba(139,0,0,0.5)",
                }}
              >
                ☽
              </div>
              <span
                className="text-cinzel font-bold text-sm tracking-[0.15em] uppercase hidden sm:block"
                style={{ color: "#c9a84c" }}
              >
                Blood on the Clocktower
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, labelFr, labelEn }) => (
                <Link
                  key={href}
                  href={href}
                  className="nav-link text-cinzel text-xs tracking-widest uppercase px-4 py-2 rounded transition-colors duration-200"
                  style={{ color: "#c9b891" }}
                >
                  {t(labelFr, labelEn)}
                </Link>
              ))}
            </nav>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <ModeToggle navMode={navMode} setNavMode={setNavMode} t={t} />
              <LangButton lang={lang} toggle={toggle} />

              {/* Mobile menu */}
              <button
                className="md:hidden flex flex-col gap-1.5 p-2"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={t("Ouvrir le menu", "Open menu")}
              >
                <span
                  className="w-5 h-0.5 block transition-all duration-300"
                  style={{
                    background: "#c9b891",
                    transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none",
                  }}
                />
                <span
                  className="w-5 h-0.5 block transition-all duration-300"
                  style={{
                    background: "#c9b891",
                    opacity: menuOpen ? 0 : 1,
                  }}
                />
                <span
                  className="w-5 h-0.5 block transition-all duration-300"
                  style={{
                    background: "#c9b891",
                    transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none",
                  }}
                />
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          {menuOpen && (
            <div
              className="md:hidden border-t"
              style={{
                background: "rgba(10,5,6,0.97)",
                borderColor: "rgba(139,0,0,0.25)",
              }}
            >
              {navLinks.map(({ href, labelFr, labelEn }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-3 text-cinzel text-xs tracking-widest uppercase transition-colors duration-200"
                  style={{ color: "#c9b891", borderBottom: "1px solid rgba(139,0,0,0.1)" }}
                >
                  {t(labelFr, labelEn)}
                </Link>
              ))}
            </div>
          )}
        </header>
      )}
    </>
  );
}

function LangButton({ lang, toggle }: { lang: string; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      className="text-cinzel text-xs font-bold tracking-widest px-3 py-1.5 rounded transition-all duration-200 border"
      style={{
        color: "#c9a84c",
        borderColor: "rgba(201,168,76,0.3)",
        background: "rgba(201,168,76,0.07)",
      }}
      aria-label={lang === "fr" ? "Switch to English" : "Passer en français"}
    >
      {lang === "fr" ? "EN" : "FR"}
    </button>
  );
}

function ModeToggle({
  navMode,
  setNavMode,
  t,
}: {
  navMode: NavMode;
  setNavMode: (m: NavMode) => void;
  t: (fr: string, en: string) => string;
}) {
  return (
    <button
      onClick={() => setNavMode(navMode === "immersive" ? "doc" : "immersive")}
      title={t(
        navMode === "immersive" ? "Mode documentation" : "Mode immersif",
        navMode === "immersive" ? "Documentation mode" : "Immersive mode"
      )}
      className="text-xs px-3 py-1.5 rounded border transition-all duration-200"
      style={{
        color: "#9ca8b5",
        borderColor: "rgba(107,122,141,0.3)",
        background: "rgba(107,122,141,0.07)",
      }}
      aria-label={t("Changer le mode de navigation", "Toggle navigation mode")}
    >
      {navMode === "immersive" ? "☰" : "✦"}
    </button>
  );
}
