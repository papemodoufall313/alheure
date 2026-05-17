"use client";
import { useState } from "react";

function WolofCard() {
  return (
    <div className="wolofCard" style={{ flex: 1 }}>
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

function NewsletterCard() {
  const [email, setEmail] = useState("");
  return (
    <div className="nlCard" style={{ flex: 1 }}>
      <span className="lab">Newsletter</span>
      <h4>Le Brief de Dakar, chaque matin à 7h</h4>
      <p>L&apos;essentiel de l&apos;actualité sénégalaise et africaine, en 5 minutes de lecture.</p>
      <form className="nlForm" onSubmit={(e) => e.preventDefault()}>
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

export default function NewsletterMot() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "stretch" }}>
          <NewsletterCard />
          <WolofCard />
        </div>
      </div>
    </section>
  );
}
