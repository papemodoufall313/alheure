export const dynamic = "force-dynamic";

import TopBar from "@/components/TopBar";
import Masthead from "@/components/Masthead";
import Nav from "@/components/Nav";
import Ticker from "@/components/Ticker";
import Hero from "@/components/sections/Hero";
import AlaUne from "@/components/sections/AlaUne";
import Senegal from "@/components/sections/Senegal";
import Direct from "@/components/sections/Direct";
import Afrique from "@/components/sections/Afrique";
import Monde from "@/components/sections/Monde";
import Tribune from "@/components/sections/Tribune";
import SportCulture from "@/components/sections/SportCulture";
import Dossiers from "@/components/sections/Dossiers";
import NewsletterMot from "@/components/sections/NewsletterMot";
import AdSlot from "@/components/AdSlot";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <TopBar />
      <Masthead />
      <Nav activeRubrique="À la une" />
      <Ticker />
      <main>
        <Hero />
        <AlaUne />

        {/* Pub bandeau après À la une */}
        <div className="wrap" style={{ padding: "8px 20px" }}>
          <AdSlot format="leaderboard" />
        </div>

        <Senegal />
        <Direct />
        <Afrique />

        {/* Pub rectangle entre sections */}
        <div className="wrap" style={{ padding: "4px 20px 20px" }}>
          <AdSlot format="halfpage" label="Publicité · Demi-page" />
        </div>

        <Monde />
        <Tribune />
        <SportCulture />
        <Dossiers />
        <NewsletterMot />
      </main>
      <Footer />
    </>
  );
}
