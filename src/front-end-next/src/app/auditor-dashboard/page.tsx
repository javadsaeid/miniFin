"use client";

import dynamic from "next/dynamic";

const AuditorDashboardContent = dynamic(
  () => import("@/components/pages/AuditorDashboardContent"),
  {
    ssr: false,
    loading: () => <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>,
  }
);

export default function AuditorDashboardPage() {
  return <AuditorDashboardContent />;
}
