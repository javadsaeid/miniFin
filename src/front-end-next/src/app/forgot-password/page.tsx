"use client";

import dynamic from "next/dynamic";

const ForgotPasswordContent = dynamic(
  () => import("@/components/pages/ForgotPasswordContent"),
  {
    ssr: false,
    loading: () => <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>,
  }
);

export default function ForgotPasswordPage() {
  return <ForgotPasswordContent />;
}
