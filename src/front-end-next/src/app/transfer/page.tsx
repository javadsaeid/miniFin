"use client";

import dynamic from "next/dynamic";

const TransferContent = dynamic(
  () => import("@/components/pages/TransferContent"),
  {
    ssr: false,
    loading: () => <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>,
  }
);

export default function TransferPage() {
  return <TransferContent />;
}
