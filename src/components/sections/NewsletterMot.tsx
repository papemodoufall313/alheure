import Link from "next/link";

const WA = "https://wa.me/221761652210?text=Je%20souhaite%20recevoir%20les%20newsletters%20d%27%C3%80%20l%27Heure";

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
  return (
    <div className="nlCard" style={{ flex: 1 }}>
      <span className="lab">Newsletter · WhatsApp</span>
      <h4>Le Brief de Dakar, chaque matin à 7h</h4>
      <p>L&apos;essentiel de l&apos;actualité sénégalaise et africaine, en 5 minutes. Recevez-la directement sur WhatsApp.</p>
      <Link href={WA} target="_blank" rel="noopener noreferrer" className="waBtn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.138.564 4.14 1.542 5.874L.057 23.887a.5.5 0 0 0 .608.61l6.174-1.617A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.878 9.878 0 0 1-5.031-1.374l-.36-.214-3.733.979.998-3.648-.236-.374A9.865 9.865 0 0 1 2.106 12C2.106 6.533 6.533 2.106 12 2.106S21.894 6.533 21.894 12 17.467 21.894 12 21.894z"/>
        </svg>
        S&apos;abonner sur WhatsApp
      </Link>
      <p style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 8 }}>
        Gratuit · Désabonnement à tout moment
      </p>
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
