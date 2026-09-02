"use client";

import { useState, useEffect } from "react";
import { Button, Space, Row, Col } from "antd";
import {
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  LockOutlined,
  ArrowRightOutlined,
  BankOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { useTranslation } from "@/i18n/context";
import { apiService } from "@/services/api";

interface Account {
  id: number;
  accountNumber: string;
  balance: number;
  accountType: string;
  currency: string;
}

export default function HomeContent() {
  const { t } = useTranslation();
  const [auth, setAuth] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    const isAuth = isAuthenticated();
    setAuth(isAuth);
    if (isAuth) {
      apiService.getMyAccounts()
        .then((res) => setAccounts(res.data.data || []))
        .catch(() => {});
    }
  }, []);

  const features = [
    {
      icon: <LockOutlined style={{ fontSize: 24 }} />,
      title: t("home.feature1Title"),
      desc: t("home.feature1Desc"),
      color: "#6366f1",
      bg: "rgba(99,102,241,0.1)",
    },
    {
      icon: <ThunderboltOutlined style={{ fontSize: 24 }} />,
      title: t("home.feature2Title"),
      desc: t("home.feature2Desc"),
      color: "#10b981",
      bg: "rgba(16,185,129,0.1)",
    },
    {
      icon: <CheckCircleOutlined style={{ fontSize: 24 }} />,
      title: t("home.feature3Title"),
      desc: t("home.feature3Desc"),
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.1)",
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 48 }}>
        <div style={{ maxWidth: 600 }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: "#1f2937", letterSpacing: "-1px", marginBottom: 12, lineHeight: 1.1 }}>
            {t("home.title")}
            <br />
            <span style={{ color: "#6366f1" }}>{t("home.titleHighlight")}</span>
          </h1>
          <p style={{ fontSize: 16, color: "#6b7280", lineHeight: 1.6, marginBottom: 28 }}>
            {t("home.subtitle")}
          </p>
          <Space size="middle">
            {auth ? (
              <Link href="/profile">
                <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
                  {t("home.goToDashboard")}
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
                    {t("home.getStarted")}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="large">{t("home.createAccount")}</Button>
                </Link>
              </>
            )}
          </Space>
        </div>
      </div>

      {auth && accounts.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#1f2937", marginBottom: 16 }}>
            {t("accounts.title")}
          </div>
          <Row gutter={[16, 16]}>
            {accounts.map((acc) => (
              <Col xs={24} sm={8} key={acc.id}>
                <div className="stat-card" style={{ cursor: "default" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div className="stat-card-icon purple" style={{ marginBottom: 0 }}>
                      <BankOutlined />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, color: "#6b7280" }}>{acc.accountNumber}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{acc.accountType} · {acc.currency}</div>
                    </div>
                  </div>
                  <div className="stat-card-value">${acc.balance.toLocaleString()}</div>
                  <div className="stat-card-label">{t("accounts.balance")}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      )}

      <Row gutter={[20, 20]}>
        {features.map((f, i) => (
          <Col xs={24} sm={8} key={i}>
            <div
              className={`stat-card animate-in animate-in-delay-${i + 1}`}
              style={{ height: "100%" }}
            >
              <div className="stat-card-icon" style={{ background: f.bg, color: f.color }}>
                {f.icon}
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#1f2937", marginBottom: 8 }}>
                {f.title}
              </div>
              <div style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>
                {f.desc}
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <div
        className="stat-card animate-in animate-in-delay-3"
        style={{
          marginTop: 32,
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "20px 24px",
          background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
          border: "1px solid #bbf7d0",
        }}
      >
        <CheckCircleOutlined style={{ fontSize: 20, color: "#16a34a" }} />
        <div>
          <div style={{ fontWeight: 600, color: "#15803d", fontSize: 14 }}>
            {t("home.trusted")}
          </div>
          <div style={{ color: "#166534", fontSize: 13 }}>
            {t("home.trustedDesc")}
          </div>
        </div>
      </div>
    </div>
  );
}
