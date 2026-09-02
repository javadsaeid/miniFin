"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, Input, Button, Typography, message } from "antd";
import { MailOutlined, LockOutlined, SafetyCertificateOutlined, UserOutlined, AuditOutlined } from "@ant-design/icons";
import { apiService } from "@/services/api";
import { saveAuthData } from "@/lib/auth";
import { useTranslation } from "@/i18n/context";

const { Text } = Typography;

export default function LoginContent() {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const demoAccounts = [
    { label: "Admin", email: "admin@minifin.com", password: "admin123", icon: <SafetyCertificateOutlined />, className: "admin", desc: t("auth.fullAccess") },
    { label: "Customer", email: "customer@minifin.com", password: "customer123", icon: <UserOutlined />, className: "customer", desc: t("auth.standardAccess") },
    { label: "Auditor", email: "auditor@minifin.com", password: "auditor123", icon: <AuditOutlined />, className: "auditor", desc: t("auth.readOnlyAccess") },
  ];

  const doLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await apiService.login({ email, password });
      const { token, roles } = res.data.data;
      saveAuthData(token, roles);
      message.success(t("auth.welcomeBack"));
      router.push("/");
    } catch (err: any) {
      message.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: { email: string; password: string }) => {
    await doLogin(values.email, values.password);
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-title">{t("auth.welcomeBack")}</div>
      <div className="auth-form-subtitle">{t("auth.signInSubtitle")}</div>

      <Form layout="vertical" onFinish={onFinish} size="large">
        <Form.Item
          name="email"
          rules={[
            { required: true, message: t("auth.required") },
            { type: "email", message: "Invalid email" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder={t("auth.email")} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: t("auth.required") }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder={t("auth.password")} />
        </Form.Item>
        <Form.Item style={{ marginBottom: 12 }}>
          <Button type="primary" htmlType="submit" block loading={loading} size="large">
            {t("auth.signIn")}
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Link href="/forgot-password" style={{ color: "#6366f1", fontSize: 13 }}>
          {t("auth.forgotPassword")}
        </Link>
        <div style={{ marginTop: 8, fontSize: 13, color: "#6b7280" }}>
          {t("auth.dontHaveAccount")}{" "}
          <Link href="/register" style={{ color: "#6366f1", fontWeight: 600 }}>
            {t("auth.signUp")}
          </Link>
        </div>
      </div>

      <div style={{ marginBottom: 12, fontSize: 12, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, textAlign: "center" }}>
        {t("auth.quickDemo")}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {demoAccounts.map((acc) => (
          <div
            key={acc.label}
            className={`demo-card ${acc.className}`}
            onClick={() => !loading && doLogin(acc.email, acc.password)}
          >
            <div className={`demo-card-icon ${acc.className}`}>
              {acc.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div className="demo-card-label">{t("auth.loginAs", { role: acc.label })}</div>
              <div className="demo-card-email">{acc.email}</div>
            </div>
            <Text type="secondary" style={{ fontSize: 11 }}>{acc.desc}</Text>
          </div>
        ))}
      </div>
    </div>
  );
}
