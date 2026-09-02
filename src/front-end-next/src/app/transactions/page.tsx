"use client";

import dynamic from "next/dynamic";

const TransactionsContent = dynamic(
  () => import("@/components/pages/TransactionsContent"),
  {
    ssr: false,
    loading: () => <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>,
  }
);

export default function TransactionsPage() {
  return <TransactionsContent />;
}
