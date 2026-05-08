"use client";
import { useState } from "react";

const TOP_LUS = [
  { title: "« Nous sommes fatigués » : à Mbour, la colère des familles de migrants disparus", meta: "Société · 12 min" },
  { title: "Modou Lô vs Siteu : pourquoi cette revanche divise les arènes", meta: "Lutte · 6 min" },
  { title: "Pourquoi le Sénégal ne produit toujours pas son propre riz", meta: "Économie · Enquête" },
  { title: "Diomaye Faye à Paris : ce que prévoit l'agenda du président", meta: "Politique · 4 min" },
  { title: "Bouba Ndour réagit aux critiques sur le festival de Saint-Louis", meta: "Culture · 5 min" },
];

export function TopLus() {
  return (
    <div className="sidebar">
      <h3>Les + lus</h3>
      <ol className="topList">
        {TOP_LUS.map((item) => (
          <li key={item.title}>
            <div>
              <div className="ti">{item.title}</div>
              <div className="meta">{item.meta}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function WolofCard() {
  return (
    <div className="wolofCard">
      <span className="lab">Mot du jour · Wolof</span>
      <span className="word">Téranga</span>
      <span className="pron">/te.ʁaŋ.ɡa/ · n.f.</span>
      <span className="def">
        Hospitalité, art de bien recevoir. Valeur cardinale de la société sénégalaise —
        partager le repas, l&apos;ombre, le silence.
      </span>
    </div>
  );
}

export function NewsletterCard() {
  const [email, setEmail] = useState("");
  return (
    <div className="nlCard">
      <span className="lab">Newsletter</span>
      <h4>Le Brief de Dakar, chaque matin à 7h</h4>
      <p>L&apos;essentiel de l&apos;actualité sénégalaise et africaine, en 5 minutes de lecture.</p>
      <form
        className="nlForm"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="email"
          placeholder="votre@email.sn"
          aria-label="Votre adresse e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Je m&apos;inscris</button>
      </form>
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="sideStack">
      <TopLus />
      <WolofCard />
      <NewsletterCard />
    </aside>
  );
}
