"use client";

import dynamic from "next/dynamic";

const RegisterContent = dynamic(
  () => import("@/components/pages/RegisterContent"),
  {
    ssr: false,
    loading: () => <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>,
  }
);

export default function RegisterPage() {
  return <RegisterContent />;
}
