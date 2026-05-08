import TopBar from "@/components/TopBar";
import Masthead from "@/components/Masthead";
import Nav from "@/components/Nav";
import Ticker from "@/components/Ticker";
import Hero from "@/components/sections/Hero";
import AlaUne from "@/components/sections/AlaUne";
import Senegal from "@/components/sections/Senegal";
import Direct from "@/components/sections/Direct";
import Afrique from "@/components/sections/Afrique";
import Tribune from "@/components/sections/Tribune";
import SportCulture from "@/components/sections/SportCulture";
import Dossiers from "@/components/sections/Dossiers";
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
        <Senegal />
        <Direct />
        <Afrique />
        <Tribune />
        <SportCulture />
        <Dossiers />
      </main>
      <Footer />
    </>
  );
}
