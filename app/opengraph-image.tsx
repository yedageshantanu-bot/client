import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #faf8f5 0%, #f5f0e8 52%, #efe2ca 100%)",
          padding: 64,
          color: "#1a1a1a",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 640 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div
              style={{
                width: 160,
                height: 160,
                borderRadius: 42,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(160deg, #fff 0%, #f8f2e6 100%)",
                border: "1px solid rgba(232,224,208,0.95)",
                color: "#3a312c",
                fontSize: 96,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              A
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.02 }}>Alaira Half Saree House</div>
              <div style={{ fontSize: 24, letterSpacing: 6, textTransform: "uppercase", color: "#a0843a" }}>
                Crafted For Grace
              </div>
            </div>
          </div>
          <div style={{ fontSize: 30, lineHeight: 1.35, color: "#5f5850", maxWidth: 560 }}>
            Premium Indian half sarees, elegant styling, and a refined luxury ecommerce experience.
          </div>
        </div>
        <div
          style={{
            width: 280,
            height: 280,
            borderRadius: 56,
            background: "rgba(255,255,255,0.72)",
            border: "1px solid rgba(232,224,208,0.95)",
            boxShadow: "0 24px 80px rgba(26,26,26,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#3a312c",
            fontSize: 120,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          A
        </div>
      </div>
    ),
    size,
  );
}