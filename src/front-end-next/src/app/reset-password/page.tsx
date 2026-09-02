"use client";

import dynamic from "next/dynamic";

const ResetPasswordContent = dynamic(
  () => import("@/components/pages/ResetPasswordContent"),
  {
    ssr: false,
    loading: () => <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>,
  }
);

export default function ResetPasswordPage() {
  return <ResetPasswordContent />;
}
