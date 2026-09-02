"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Modal, Button, message } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  SwapOutlined,
  HistoryOutlined,
  DollarOutlined,
  DashboardOutlined,
  SettingOutlined,
  LogoutOutlined,
  AuditOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import {
  isAuthenticated,
  isAdmin,
  isAuditor,
  logout,
  getToken,
} from "@/lib/auth";
import { apiService } from "@/services/api";
import { useTranslation, Locale } from "@/i18n/context";

const ADMIN_EMAILS = ["admin@minifin.com"];

function parseJwt(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { t, locale, setLocale } = useTranslation();
  const [auth, setAuth] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [auditor, setAuditor] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const isAuth = isAuthenticated();
    setAuth(isAuth);
    setAdmin(isAdmin());
    setAuditor(isAuditor());

    if (isAuth) {
      const token = getToken();
      if (token) {
        const payload = parseJwt(token);
        if (payload?.email) {
          if (ADMIN_EMAILS.includes(payload.email)) {
            setUserRole("ADMIN");
          } else {
            apiService
              .getMyProfile()
              .then((res) => {
                const profile = res.data?.data;
                if (profile) {
                  setUserName(`${profile.firstName} ${profile.lastName}`);
                  const roles = profile.roles || [];
                  const roleNames = roles.map((r: any) => r.name);
                  if (roleNames.includes("ADMIN")) setUserRole("ADMIN");
                  else if (roleNames.includes("AUDITOR")) setUserRole("AUDITOR");
                  else setUserRole("CUSTOMER");
                }
              })
              .catch(() => {});
          }
        }
      }
    }
  }, [pathname]);

  const handleLogout = () => setShowModal(true);

  const confirmLogout = () => {
    logout();
    setShowModal(false);
    message.success(locale === "fa" ? "با موفقیت خارج شدید" : "Logged out successfully");
    router.push("/login");
  };

  const toggleLocale = () => {
    setLocale(locale === "en" ? "fa" : "en");
  };

  const navItems = [
    { key: "/", icon: <HomeOutlined />, label: t("nav.home") },
    ...(auth
      ? [
          { key: "/profile", icon: <UserOutlined />, label: t("nav.profile") },
          { key: "/transfer", icon: <SwapOutlined />, label: t("nav.transfer") },
          { key: "/transactions", icon: <HistoryOutlined />, label: t("nav.transactions") },
        ]
      : []),
    ...(admin || auditor
      ? [
          { key: "/deposit", icon: <DollarOutlined />, label: t("nav.deposit") },
          { key: "/auditor-dashboard", icon: <DashboardOutlined />, label: t("nav.auditor") },
        ]
      : []),
    ...(admin
      ? [{ key: "/admin", icon: <SettingOutlined />, label: t("nav.admin") }]
      : []),
  ];

  const guestItems = [
    { key: "/login", icon: <AuditOutlined />, label: t("nav.login") },
    { key: "/register", icon: <UserOutlined />, label: t("nav.register") },
  ];

  const items = auth ? navItems : guestItems;

  return (
    <>
      <aside className="app-sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">M</div>
          <span className="sidebar-logo-text">MiniFin</span>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-nav-section">{t("nav.navigation")}</div>
          {items.map((item) => (
            <Link
              key={item.key}
              href={item.key}
              className={`sidebar-nav-item ${pathname === item.key ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          {auth && (
            <div className="sidebar-user">
              <div className="sidebar-user-avatar">
                {userName ? userName.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">
                  {userName || (locale === "fa" ? "کاربر" : "User")}
                </div>
                <div className="sidebar-user-role">
                  {userRole || (locale === "fa" ? "کاربر" : "User")}
                </div>
              </div>
            </div>
          )}

          <button className="lang-switch" onClick={toggleLocale}>
            <GlobalOutlined className="lang-switch-icon" />
            <span>{locale === "en" ? "فارسی" : "English"}</span>
          </button>

          {auth && (
            <button className="sidebar-nav-item" onClick={handleLogout} style={{ marginTop: 8 }}>
              <span className="nav-icon"><LogoutOutlined /></span>
              <span>{t("nav.logout")}</span>
            </button>
          )}
        </div>
      </aside>

      <Modal
        title={t("common.confirmLogout")}
        open={showModal}
        onOk={confirmLogout}
        onCancel={() => setShowModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowModal(false)}>
            {t("common.cancel")}
          </Button>,
          <Button key="confirm" type="primary" danger onClick={confirmLogout}>
            {t("common.logoutBtn")}
          </Button>,
        ]}
      >
        <p>{t("common.logoutMessage")}</p>
      </Modal>
    </>
  );
}
