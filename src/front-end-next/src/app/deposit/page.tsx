"use client";

import dynamic from "next/dynamic";

const DepositContent = dynamic(
  () => import("@/components/pages/DepositContent"),
  {
    ssr: false,
    loading: () => <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>,
  }
);

export default function DepositPage() {
  return <DepositContent />;
}
