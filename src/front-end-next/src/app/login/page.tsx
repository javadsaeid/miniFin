"use client";

import dynamic from "next/dynamic";

const LoginContent = dynamic(() => import("@/components/pages/LoginContent"), {
  ssr: false,
  loading: () => <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>,
});

export default function LoginPage() {
  return <LoginContent />;
}
