'use client'

import { EmblaCarousel } from "./ui/carousel";

export default function Landing() {
  return (
    <>
      <div>
        <EmblaCarousel/>
      </div>

      <div style={{
        width: "100%",
        maxWidth: "1024px", 
        margin: "0 auto",
        border: "2px solid var(--dark-brown)",
        padding: "16px",
        textAlign: "center",
        borderRadius: "8px",
        marginTop: "24px"
      }}>
        Our mission: 
      </div>
    </>
  );
}