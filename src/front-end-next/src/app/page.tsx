"use client";

import dynamic from "next/dynamic";

const HomeContent = dynamic(() => import("@/components/pages/HomeContent"), {
  ssr: false,
  loading: () => <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>,
});

export default function Home() {
  return <HomeContent />;
}
