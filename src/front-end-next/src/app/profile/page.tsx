"use client";

import dynamic from "next/dynamic";

const ProfileContent = dynamic(
  () => import("@/components/pages/ProfileContent"),
  {
    ssr: false,
    loading: () => <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>,
  }
);

export default function ProfilePage() {
  return <ProfileContent />;
}
