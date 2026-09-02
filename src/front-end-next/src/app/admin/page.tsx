"use client";

import dynamic from "next/dynamic";

const AdminPanelContent = dynamic(
  () => import("@/components/pages/AdminPanelContent"),
  {
    ssr: false,
    loading: () => <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>,
  }
);

export default function AdminPanelPage() {
  return <AdminPanelContent />;
}
