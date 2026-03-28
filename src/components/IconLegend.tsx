"use client";

import Image from "next/image";
import { useLang } from "@/context/LangContext";

export interface IconLegendItem {
  labelFr: string;
  labelEn: string;
  descriptionFr: string;
  descriptionEn: string;
  color: string;
  icon?: { src: string; alt: string };
  badge?: string;
}

interface Props {
  titleFr: string;
  titleEn: string;
  items: IconLegendItem[];
}

export default function IconLegend({ titleFr, titleEn, items }: Props) {
  const { t } = useLang();

  return (
    <section
      className="rounded-2xl p-5 md:p-6"
      style={{
        background: "rgba(20,8,13,0.5)",
        border: "1px solid rgba(201,168,76,0.14)",
      }}
    >
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <p className="text-xs tracking-widest uppercase text-cinzel mb-2" style={{ color: "#8B0000" }}>
            {t("Référence", "Reference")}
          </p>
          <h3 className="text-cinzel font-bold text-lg" style={{ color: "#f4ebd0" }}>
            {t(titleFr, titleEn)}
          </h3>
        </div>
        <div className="text-xs text-cinzel uppercase tracking-widest" style={{ color: "#6b7a8d" }}>
          {items.length} {t("élément(s)", "item(s)")}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.labelEn}
            className="flex items-start gap-3 rounded-xl p-3"
            style={{
              background: "rgba(10,5,6,0.7)",
              border: `1px solid ${item.color}22`,
            }}
          >
            <div
              className="relative w-11 h-11 shrink-0 overflow-hidden rounded-full flex items-center justify-center p-1"
              style={{
                background: `radial-gradient(circle at 35% 35%, ${item.color}33, rgba(10,5,6,0.95))`,
                border: `1px solid ${item.color}55`,
                overflow: "visible",
              }}
            >
              {item.icon ? (
                <Image
                  src={item.icon.src}
                  alt={item.icon.alt}
                  fill
                  sizes={item.icon?.src?.includes("/couteau.png") || item.icon?.src?.includes("/coeur.png") ? "58px" : "44px"}
                  className="object-contain"
                  style={item.icon?.src?.includes("/couteau.png") || item.icon?.src?.includes("/coeur.png") ? { transform: "scale(1.5)", transformOrigin: "center" } : undefined}
                />
              ) : (
                <span className="text-cinzel text-sm font-bold" style={{ color: item.color }}>
                  {item.badge ?? "•"}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-cinzel font-semibold text-sm" style={{ color: "#f4ebd0" }}>
                  {t(item.labelFr, item.labelEn)}
                </p>
                <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: `${item.color}16`, color: item.color }}>
                  {item.badge ?? t("Icône", "Icon")}
                </span>
              </div>
              <p className="text-xs leading-relaxed mt-1" style={{ color: "#9ca8b5" }}>
                {t(item.descriptionFr, item.descriptionEn)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}