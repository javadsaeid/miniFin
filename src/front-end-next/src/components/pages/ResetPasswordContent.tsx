"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, Input, Button, message } from "antd";
import { LockOutlined, KeyOutlined, MailOutlined } from "@ant-design/icons";
import { apiService } from "@/services/api";
import { useTranslation } from "@/i18n/context";

export default function ResetPasswordContent() {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: {
    email: string;
    code: string;
    newPassword: string;
  }) => {
    setLoading(true);
    try {
      await apiService.resetPassword(values);
      message.success(t("auth.resetBtn"));
      router.push("/login");
    } catch (err: any) {
      message.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-title">{t("auth.setNewPassword")}</div>
      <div className="auth-form-subtitle">{t("auth.resetFormSubtitle")}</div>

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
          name="code"
          rules={[{ required: true, message: t("auth.required") }]}
        >
          <Input prefix={<KeyOutlined />} placeholder={t("auth.resetCode")} />
        </Form.Item>
        <Form.Item
          name="newPassword"
          rules={[{ required: true, message: t("auth.required") }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder={t("auth.newPassword")} />
        </Form.Item>
        <Form.Item style={{ marginBottom: 12 }}>
          <Button type="primary" htmlType="submit" block loading={loading} size="large">
            {t("auth.resetBtn")}
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: "center", fontSize: 13 }}>
        <Link href="/login" style={{ color: "#6366f1", fontWeight: 600 }}>
          {t("auth.backToLogin")}
        </Link>
      </div>
    </div>
  );
}
