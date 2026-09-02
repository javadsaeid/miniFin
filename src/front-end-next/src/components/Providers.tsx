"use client";

import dynamic from "next/dynamic";
import { ConfigProvider } from "antd";
import { usePathname } from "next/navigation";
import { I18nProvider, useTranslation } from "@/i18n/context";

const Sidebar = dynamic(() => import("@/components/Sidebar"), { ssr: false });

const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];

function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { dir } = useTranslation();
  const isAuthPage = AUTH_ROUTES.includes(pathname);

  return (
    <ConfigProvider
      direction={dir}
      theme={{
        token: {
          colorPrimary: "#6366f1",
          borderRadius: 8,
          fontFamily: "'Inter', 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          colorBgContainer: "#ffffff",
          colorBgLayout: "#f0f2f5",
          colorText: "#1f2937",
          colorTextSecondary: "#6b7280",
          colorBorder: "#e5e7eb",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        },
        components: {
          Table: {
            borderRadius: 12,
            headerBg: "#f9fafb",
            headerColor: "#6b7280",
            rowHoverBg: "#f9fafb",
            cellPaddingBlock: 14,
          },
          Card: {
            borderRadiusLG: 12,
            paddingLG: 24,
          },
          Button: {
            borderRadius: 8,
            controlHeight: 40,
            fontWeight: 600,
          },
          Input: {
            borderRadius: 8,
            controlHeight: 42,
          },
          Select: {
            borderRadius: 8,
            controlHeight: 42,
          },
        },
      }}
    >
      {isAuthPage ? (
        <div className="auth-layout">
          <div className="auth-left">
            <div className="auth-left-content">
              <div className="auth-left-title">MiniFin</div>
              <div className="auth-left-subtitle">
                <span dir="ltr">Secure, modern banking at your fingertips.</span>
              </div>
              <div className="auth-features">
                <div className="auth-feature">
                  <div className="auth-feature-icon">🔒</div>
                  <span>Bank-grade security with JWT authentication</span>
                </div>
                <div className="auth-feature">
                  <div className="auth-feature-icon">⚡</div>
                  <span>Instant transfers and real-time updates</span>
                </div>
                <div className="auth-feature">
                  <div className="auth-feature-icon">📊</div>
                  <span>Complete audit trail and transaction history</span>
                </div>
              </div>
            </div>
          </div>
          <div className="auth-right">
            {children}
          </div>
        </div>
      ) : (
        <div className="app-layout">
          <Sidebar />
          <div className="app-main">
            <div className="app-content">{children}</div>
          </div>
        </div>
      )}
    </ConfigProvider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <AppLayout>{children}</AppLayout>
    </I18nProvider>
  );
}
