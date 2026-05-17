import type { Metadata } from "next";
import { Newsreader, Manrope } from "next/font/google";
import "./globals.css";
import AbsaChat from "@/components/AbsaChat";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "À l'Heure — L'information du Sénégal et de l'Afrique",
    template: "%s — À l'Heure",
  },
  description:
    "Quotidien d'information indépendant. Sénégal — Afrique — Monde. Édité depuis Dakar.",
};

const WA_HREF = "https://wa.me/221761652210?text=Bonjour%2C%20je%20souhaite%20m%27abonner%20%C3%A0%20la%20newsletter%20d%27%C3%80%20l%27Heure";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${newsreader.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <AbsaChat />
        {/* Bulle WhatsApp flottante */}
        <a
          href={WA_HREF}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nous contacter sur WhatsApp"
          style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 999,
            width: 56, height: 56, borderRadius: "50%",
            background: "#25D366", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(0,0,0,.22)",
            transition: "transform .2s, box-shadow .2s",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.138.564 4.14 1.542 5.874L.057 23.887a.5.5 0 0 0 .608.61l6.174-1.617A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.878 9.878 0 0 1-5.031-1.374l-.36-.214-3.733.979.998-3.648-.236-.374A9.865 9.865 0 0 1 2.106 12C2.106 6.533 6.533 2.106 12 2.106S21.894 6.533 21.894 12 17.467 21.894 12 21.894z"/>
          </svg>
        </a>
      </body>
    </html>
  );
}
