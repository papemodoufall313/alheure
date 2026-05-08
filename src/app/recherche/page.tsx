import TopBar from "@/components/TopBar";
import Masthead from "@/components/Masthead";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getAllArticles } from "@/lib/articles";
import SearchClient from "./SearchClient";

export default function RecherchePage() {
  const articles = getAllArticles();
  return (
    <>
      <TopBar />
      <Masthead />
      <Nav />
      <main>
        <div className="wrap">
          <SearchClient articles={articles} />
        </div>
      </main>
      <Footer />
    </>
  );
}
