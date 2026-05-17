interface AdSlotProps {
  format: "leaderboard" | "rectangle" | "halfpage";
  label?: string;
}

const FORMATS = {
  leaderboard: { w: "100%", h: 90,  maxW: 728, tag: "728×90"  },
  rectangle:   { w: "100%", h: 250, maxW: 300, tag: "300×250" },
  halfpage:    { w: "100%", h: 300, maxW: "100%", tag: "Demi-page" },
};

export default function AdSlot({ format, label }: AdSlotProps) {
  const f = FORMATS[format];
  return (
    <div
      style={{
        width: f.w,
        maxWidth: typeof f.maxW === "number" ? f.maxW : undefined,
        height: f.h,
        margin: "0 auto",
        background: "#f3f4f6",
        border: "1px dashed #c8d0dc",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        borderRadius: 2,
      }}
      aria-hidden="true"
    >
      <span style={{ font: "700 9px var(--sans)", letterSpacing: ".14em", textTransform: "uppercase", color: "#9ca3af" }}>
        Publicité
      </span>
      <span style={{ font: "400 10px var(--sans)", color: "#c8d0dc" }}>
        {label ?? f.tag}
      </span>
    </div>
  );
}
