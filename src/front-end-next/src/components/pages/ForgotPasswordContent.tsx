"use client";

import { useState } from "react";
import Link from "next/link";
import { Form, Input, Button, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { apiService } from "@/services/api";
import { useTranslation } from "@/i18n/context";

export default function ForgotPasswordContent() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      await apiService.forgotPassword(values);
      message.success(t("auth.sendResetCode"));
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-title">{t("auth.resetPassword")}</div>
      <div className="auth-form-subtitle">{t("auth.resetSubtitle")}</div>

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
        <Form.Item style={{ marginBottom: 12 }}>
          <Button type="primary" htmlType="submit" block loading={loading} size="large">
            {t("auth.sendResetCode")}
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: "center", fontSize: 13, color: "#6b7280" }}>
        <Link href="/reset-password" style={{ color: "#6366f1", fontWeight: 600 }}>
          {t("auth.haveCode")}
        </Link>
        {" · "}
        <Link href="/login" style={{ color: "#6366f1", fontWeight: 600 }}>
          {t("auth.backToLogin")}
        </Link>
      </div>
    </div>
  );
}
