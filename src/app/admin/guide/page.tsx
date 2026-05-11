import Link from "next/link";

export default function GuidePage() {
  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { font-size: 12px; }
          .pageBreak { page-break-before: always; }
        }
        .guide { max-width: 800px; margin: 0 auto; padding: 40px 32px 80px; font-family: var(--sans); color: var(--ink); }
        .guide h1 { font: 800 36px var(--serif); color: var(--blue); margin: 0 0 4px; }
        .guide h2 { font: 700 22px var(--serif); color: var(--blue); margin: 40px 0 12px; padding-bottom: 8px; border-bottom: 2px solid var(--blue); }
        .guide h3 { font: 700 16px var(--sans); color: var(--ink); margin: 24px 0 8px; text-transform: uppercase; letter-spacing: .06em; font-size: 12px; }
        .guide p { font: 400 15px var(--sans); line-height: 1.7; margin: 0 0 12px; color: var(--ink-2); }
        .guide ul { margin: 0 0 14px; padding-left: 20px; }
        .guide li { font: 400 14px var(--sans); line-height: 1.7; color: var(--ink-2); margin-bottom: 4px; }
        .guide strong { color: var(--ink); font-weight: 700; }
        .tip { background: #eff6ff; border-left: 3px solid var(--blue); padding: 12px 16px; border-radius: 0 4px 4px 0; margin: 14px 0; }
        .tip p { margin: 0; font-size: 13px; color: #1e40af; }
        .warn { background: #fff7ed; border-left: 3px solid #f97316; padding: 12px 16px; border-radius: 0 4px 4px 0; margin: 14px 0; }
        .warn p { margin: 0; font-size: 13px; color: #9a3412; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 3px; font: 700 11px var(--sans); margin: 0 3px; }
        .step { display: flex; gap: 14px; margin: 10px 0; align-items: flex-start; }
        .stepNum { flex-shrink: 0; width: 26px; height: 26px; background: var(--blue); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font: 700 12px var(--sans); }
        .field { background: #f9f8f5; border: 1px solid var(--rule); border-radius: 4px; padding: 10px 14px; margin: 8px 0; }
        .field-name { font: 700 13px var(--sans); color: var(--ink); }
        .field-desc { font: 400 12px var(--sans); color: var(--ink-2); margin-top: 2px; }
        table { width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 13px; }
        th { background: var(--blue); color: #fff; padding: 8px 12px; text-align: left; font: 600 12px var(--sans); }
        td { padding: 8px 12px; border-bottom: 1px solid var(--rule); color: var(--ink-2); vertical-align: top; }
        tr:nth-child(even) td { background: #f9f8f5; }
        .cover { background: linear-gradient(135deg, var(--blue) 0%, #1a3a6e 100%); color: #fff; padding: 48px 32px; margin: -40px -32px 40px; border-radius: 0; }
      `}</style>

      <div className="guide">
        {/* Cover */}
        <div className="cover">
          <div style={{ font: "500 11px sans-serif", letterSpacing: ".18em", textTransform: "uppercase", opacity: .7, marginBottom: 8 }}>À l'Heure · Documentation</div>
          <h1 style={{ font: "800 42px Georgia,serif", color: "#fff", margin: "0 0 8px" }}>
            <span style={{ color: "#f0c8c5" }}>À</span> l'Heure
          </h1>
          <div style={{ font: "400 18px Georgia,serif", color: "rgba(255,255,255,.85)", marginBottom: 16 }}>
            Guide de l'éditeur — Rédaction &amp; Administration
          </div>
          <div style={{ font: "400 13px sans-serif", color: "rgba(255,255,255,.6)" }}>
            Version 1.0 · Mai 2026 · alheure.info
          </div>
        </div>

        {/* Sommaire */}
        <div className="no-print" style={{ background: "#f9f8f5", border: "1px solid var(--rule)", borderRadius: 6, padding: 20, marginBottom: 32 }}>
          <div style={{ font: "700 12px var(--sans)", textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ink-3)", marginBottom: 10 }}>Sommaire</div>
          {[
            ["1", "Connexion à l'espace rédaction", "#connexion"],
            ["2", "Vue d'ensemble du tableau de bord", "#dashboard"],
            ["3", "Créer un nouvel article", "#creer"],
            ["4", "Description de tous les champs", "#champs"],
            ["5", "Statuts de publication", "#statuts"],
            ["6", "Uploader une image", "#image"],
            ["7", "Modifier ou supprimer un article", "#modifier"],
            ["8", "Gérer les podcasts", "#podcasts"],
            ["9", "Gérer les vidéos", "#videos"],
            ["10", "Mot du jour en wolof", "#wolof"],
            ["11", "Bonnes pratiques éditoriales", "#pratiques"],
          ].map(([num, label, href]) => (
            <div key={num} style={{ display: "flex", gap: 10, padding: "5px 0", borderBottom: "1px solid var(--rule)" }}>
              <span style={{ font: "600 12px var(--sans)", color: "var(--blue)", minWidth: 20 }}>{num}.</span>
              <a href={href} style={{ font: "400 13px var(--sans)", color: "var(--blue)", textDecoration: "none" }}>{label}</a>
            </div>
          ))}
        </div>

        {/* 1. Connexion */}
        <h2 id="connexion">1. Connexion à l'espace rédaction</h2>
        <p>L'espace d'administration est accessible à l'adresse suivante :</p>
        <div className="field">
          <div className="field-name">🔗 https://alheure.info/admin</div>
          <div className="field-desc">Toute visite de cette URL redirige automatiquement vers la page de connexion si vous n'êtes pas connecté.</div>
        </div>
        <h3>Vos identifiants</h3>
        <table>
          <thead><tr><th>Rôle</th><th>Identifiant</th><th>Mot de passe</th><th>Accès</th></tr></thead>
          <tbody>
            <tr><td><strong>Administrateur</strong></td><td>admin</td><td><em>fourni séparément</em></td><td>Accès complet</td></tr>
            <tr><td><strong>Éditeur</strong></td><td>editeur</td><td><em>fourni séparément</em></td><td>Articles, médias</td></tr>
          </tbody>
        </table>
        <div className="warn"><p>⚠️ Ne partagez jamais vos identifiants. Chaque membre de la rédaction doit avoir son propre compte.</p></div>

        {/* 2. Dashboard */}
        <h2 id="dashboard" className="pageBreak">2. Vue d'ensemble du tableau de bord</h2>
        <p>Le tableau de bord affiche en un coup d'œil l'état de votre rédaction :</p>
        <ul>
          <li><strong>5 indicateurs de statistiques</strong> : total articles, publiés, brouillons, planifiés, en vedette</li>
          <li><strong>Liste de tous les articles</strong> avec statut, badge et actions rapides</li>
          <li><strong>Navigation rapide</strong> vers Auteurs, Podcasts, Vidéos, Wolof</li>
        </ul>
        <div className="tip"><p>💡 Cliquez sur <strong>« + Nouvel article »</strong> en haut à droite pour commencer à rédiger.</p></div>

        {/* 3. Créer */}
        <h2 id="creer" className="pageBreak">3. Créer un nouvel article</h2>
        <div className="step"><div className="stepNum">1</div><div><p style={{margin:0}}>Cliquez sur <strong>« + Nouvel article »</strong> depuis le tableau de bord.</p></div></div>
        <div className="step"><div className="stepNum">2</div><div><p style={{margin:0}}>Remplissez tous les champs obligatoires : titre, chapô, rubrique, auteur, date.</p></div></div>
        <div className="step"><div className="stepNum">3</div><div><p style={{margin:0}}>Choisissez le <strong>statut</strong> : Brouillon (sauvegarde), Planifié (publication différée), ou Publié.</p></div></div>
        <div className="step"><div className="stepNum">4</div><div><p style={{margin:0}}>Uploadez une <strong>image</strong> depuis votre ordinateur via le bouton dédié.</p></div></div>
        <div className="step"><div className="stepNum">5</div><div><p style={{margin:0}}>Rédigez le <strong>corps de l'article</strong> dans l'éditeur de texte enrichi.</p></div></div>
        <div className="step"><div className="stepNum">6</div><div><p style={{margin:0}}>Cliquez sur <strong>« Publier »</strong> (ou « Enregistrer le brouillon »).</p></div></div>

        {/* 4. Champs */}
        <h2 id="champs" className="pageBreak">4. Description de tous les champs</h2>

        <h3>Informations principales</h3>
        {[
          ["Titre", "Obligatoire. Le titre principal de l'article. Doit être accrocheur et informatif. Maximum 120 caractères recommandé."],
          ["Chapô (dek)", "Obligatoire. Le sous-titre ou accroche qui résume l'article en 1-2 phrases. Apparaît sous le titre sur l'accueil."],
          ["Rubrique", "Obligatoire. Catégorie de l'article : Sénégal, Afrique, Monde, Politique, Économie, Société, Sport, Culture, Diaspora…"],
          ["Label de rubrique", "Libellé affiché sur l'article (ex. : « Sénégal · Dakar »). Peut être plus précis que la rubrique seule."],
        ].map(([name, desc]) => (
          <div key={name} className="field">
            <div className="field-name">{name}</div>
            <div className="field-desc">{desc}</div>
          </div>
        ))}

        <h3>Auteur</h3>
        {[
          ["Auteur", "Nom complet du journaliste ou correspondant. Utilisez les boutons de sélection rapide pour choisir un auteur connu."],
          ["Bio auteur", "Courte biographie (1-2 lignes) affichée en bas de l'article. Le bouton « Bio auto » la remplit automatiquement."],
        ].map(([name, desc]) => (
          <div key={name} className="field">
            <div className="field-name">{name}</div>
            <div className="field-desc">{desc}</div>
          </div>
        ))}

        <h3>Date et durée</h3>
        {[
          ["Date affichée", "Date lisible pour le lecteur (ex. : « Aujourd'hui · 11h30 » ou « 7 mai 2026 »)."],
          ["Date ISO", "Date technique au format AAAA-MM-JJThh:mm (ex. : 2026-05-07T11:30). Utilisée par les moteurs de recherche."],
          ["Temps de lecture", "Estimation du temps de lecture (ex. : « 5 min »). Laissez vide si non applicable."],
        ].map(([name, desc]) => (
          <div key={name} className="field">
            <div className="field-name">{name}</div>
            <div className="field-desc">{desc}</div>
          </div>
        ))}

        <h3>Options de mise en avant</h3>
        {[
          ["Article mis en avant", "Cocher pour placer cet article en position HERO (grand article principal) sur l'accueil. Un seul article à la fois."],
          ["Badge", "Étiquette spéciale : Grand reportage (enquête longue), Long format, Vidéo, Direct (en cours)."],
          ["Tags", "Mots-clés séparés par des virgules pour faciliter la recherche et le référencement."],
        ].map(([name, desc]) => (
          <div key={name} className="field">
            <div className="field-name">{name}</div>
            <div className="field-desc">{desc}</div>
          </div>
        ))}

        {/* 5. Statuts */}
        <h2 id="statuts" className="pageBreak">5. Statuts de publication</h2>
        <table>
          <thead><tr><th>Statut</th><th>Signification</th><th>Visible sur le site ?</th></tr></thead>
          <tbody>
            <tr>
              <td><span className="badge" style={{background:"#fef9c3",color:"#a16207"}}>Brouillon</span></td>
              <td>Article en cours de rédaction, sauvegardé mais non publié.</td>
              <td>Non</td>
            </tr>
            <tr>
              <td><span className="badge" style={{background:"#dbeafe",color:"#1d4ed8"}}>Planifié</span></td>
              <td>Publication programmée à une date et heure précise.</td>
              <td>À la date choisie</td>
            </tr>
            <tr>
              <td><span className="badge" style={{background:"#dcfce7",color:"#15803d"}}>Publié</span></td>
              <td>Article visible par tous les lecteurs sur le site.</td>
              <td>Oui, immédiatement</td>
            </tr>
          </tbody>
        </table>
        <div className="tip"><p>💡 Utilisez <strong>Brouillon</strong> pour sauvegarder votre travail en cours. Passez à <strong>Publié</strong> quand l'article est relu et validé.</p></div>

        {/* 6. Image */}
        <h2 id="image" className="pageBreak">6. Uploader une image</h2>
        <div className="step"><div className="stepNum">1</div><div><p style={{margin:0}}>Dans le formulaire article, repérez la section <strong>Image</strong>.</p></div></div>
        <div className="step"><div className="stepNum">2</div><div><p style={{margin:0}}>Cliquez sur <strong>« Choisir un fichier »</strong> et sélectionnez une photo depuis votre ordinateur.</p></div></div>
        <div className="step"><div className="stepNum">3</div><div><p style={{margin:0}}>Formats acceptés : <strong>JPG, PNG, WebP</strong>. Taille recommandée : 1200×800 px minimum.</p></div></div>
        <div className="step"><div className="stepNum">4</div><div><p style={{margin:0}}>Une prévisualisation s'affiche. Le champ <strong>Texte alternatif</strong> décrit l'image pour l'accessibilité.</p></div></div>
        <div className="warn"><p>⚠️ Utilisez uniquement des images libres de droits (Pexels, Unsplash) ou dont vous détenez les droits. Toujours créditer le photographe.</p></div>

        {/* 7. Modifier */}
        <h2 id="modifier">7. Modifier ou supprimer un article</h2>
        <h3>Modifier</h3>
        <p>Depuis le tableau de bord, cliquez sur <strong>« Modifier »</strong> à droite de l'article. Le formulaire s'ouvre avec toutes les données existantes. Effectuez vos changements puis cliquez sur <strong>« Mettre à jour »</strong>.</p>
        <h3>Supprimer</h3>
        <p>Cliquez sur <strong>« Supprimer »</strong> (bouton rouge). Une confirmation est demandée. <strong>Cette action est irréversible.</strong></p>
        <div className="warn"><p>⚠️ Préférez passer un article en <strong>Brouillon</strong> plutôt que de le supprimer définitivement.</p></div>

        {/* 8. Podcasts */}
        <h2 id="podcasts" className="pageBreak">8. Gérer les podcasts</h2>
        <p>Accès : <strong>Admin → Podcasts</strong> ou directement <strong>https://alheure.info/admin/podcasts</strong></p>
        <ul>
          <li><strong>+ Nouvel épisode</strong> : crée un nouvel épisode de podcast</li>
          <li><strong>Numéro d'épisode</strong> : numéro séquentiel (12, 13, 14…)</li>
          <li><strong>URL Spotify / Apple</strong> : lien vers l'épisode sur les plateformes</li>
          <li><strong>Invité</strong> : nom et titre de l'invité de l'épisode</li>
          <li>Cochez <strong>Publié</strong> pour le rendre visible sur le site</li>
        </ul>

        {/* 9. Vidéos */}
        <h2 id="videos">9. Gérer les vidéos</h2>
        <p>Accès : <strong>Admin → Vidéos</strong> ou directement <strong>https://alheure.info/admin/videos</strong></p>
        <ul>
          <li><strong>URL vidéo</strong> : lien YouTube, Vimeo ou autre plateforme</li>
          <li><strong>Image miniature</strong> : chemin vers la vignette (ex. : <code>/uploads/mon-image.jpg</code>)</li>
          <li><strong>Catégorie</strong> : Grand reportage, Sport, Culture, Société…</li>
          <li><strong>Durée</strong> : format libre (ex. : « 14:32 »)</li>
        </ul>

        {/* 10. Wolof */}
        <h2 id="wolof">10. Mot du jour en wolof</h2>
        <p>Accès : <strong>Admin → Wolof</strong> ou directement <strong>https://alheure.info/admin/wolof</strong></p>
        <ul>
          <li><strong>Mot</strong> : le mot en wolof</li>
          <li><strong>Prononciation</strong> : transcription phonétique (ex. : /te.ʁaŋ.ɡa/)</li>
          <li><strong>Type</strong> : nature grammaticale (n.f., n.m., v., expr.…)</li>
          <li><strong>Définition</strong> : explication en français</li>
          <li><strong>Exemple</strong> : phrase d'usage ou citation</li>
          <li><strong>⭐ Mot du jour</strong> : cochez pour afficher ce mot en vedette sur la page Wolof</li>
        </ul>
        <div className="tip"><p>💡 Un seul mot peut être « Mot du jour » à la fois. En cocher un nouveau désactive automatiquement le précédent.</p></div>

        {/* 11. Bonnes pratiques */}
        <h2 id="pratiques" className="pageBreak">11. Bonnes pratiques éditoriales</h2>

        <h3>Titre</h3>
        <ul>
          <li>Soyez précis et informatif : qui, quoi, où</li>
          <li>Évitez les titres vagues (« Une situation préoccupante »)</li>
          <li>Maximum 10-12 mots pour une bonne lisibilité</li>
        </ul>

        <h3>Chapô</h3>
        <ul>
          <li>Résumez l'essentiel en 1-2 phrases</li>
          <li>Le lecteur doit comprendre le sujet sans lire l'article</li>
          <li>Évitez de répéter mot pour mot le titre</li>
        </ul>

        <h3>Corps de l'article</h3>
        <ul>
          <li>Commencez par les informations les plus importantes (pyramide inversée)</li>
          <li>Utilisez des intertitres (H2) pour aérer les longs textes</li>
          <li>Les citations importantes peuvent être mises en <strong>blockquote</strong></li>
          <li>Vérifiez les faits avant publication</li>
        </ul>

        <h3>Images</h3>
        <ul>
          <li>Choisissez une image en rapport direct avec le sujet</li>
          <li>Renseignez toujours le texte alternatif (accessibilité + SEO)</li>
          <li>Privilégiez les images horizontales (ratio 16/9 ou 3/2)</li>
          <li>Vérifiez les droits avant d'utiliser une image</li>
        </ul>

        <h3>SEO et référencement</h3>
        <ul>
          <li>Renseignez les <strong>tags</strong> avec les mots-clés principaux</li>
          <li>La date ISO doit être exacte pour le référencement Google</li>
          <li>Un article bien structuré avec intertitres est mieux indexé</li>
        </ul>

        {/* Footer */}
        <div style={{ marginTop: 60, paddingTop: 20, borderTop: "2px solid var(--rule)", display: "flex", justifyContent: "space-between", alignItems: "center", font: "400 12px var(--sans)", color: "var(--ink-3)" }}>
          <span>À l'Heure · Guide de l'éditeur · v1.0</span>
          <span>alheure.info</span>
        </div>

        {/* Print button */}
        <div className="no-print" style={{ textAlign: "center", marginTop: 32 }}>
          <button onClick={() => window.print()}
            style={{ background: "var(--blue)", color: "#fff", border: "none", borderRadius: 4, padding: "12px 28px", font: "700 14px var(--sans)", cursor: "pointer" }}>
            🖨️ Imprimer / Exporter en PDF
          </button>
          <span style={{ display: "block", font: "400 12px var(--sans)", color: "var(--ink-3)", marginTop: 8 }}>
            Dans la boîte de dialogue d'impression, choisissez « Enregistrer en PDF »
          </span>
        </div>
      </div>
    </>
  );
}
