"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined } from "@ant-design/icons";
import { apiService } from "@/services/api";
import { useTranslation } from "@/i18n/context";

export default function RegisterContent() {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      await apiService.register(values);
      message.success(t("auth.welcomeBack"));
      router.push("/login");
    } catch (err: any) {
      message.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-title">{t("auth.createAccount")}</div>
      <div className="auth-form-subtitle">{t("auth.signUpSubtitle")}</div>

      <Form layout="vertical" onFinish={onFinish} size="large">
        <div style={{ display: "flex", gap: 12 }}>
          <Form.Item
            name="firstName"
            rules={[{ required: true, message: t("auth.required") }]}
            style={{ flex: 1 }}
          >
            <Input prefix={<UserOutlined />} placeholder={t("auth.firstName")} />
          </Form.Item>
          <Form.Item
            name="lastName"
            rules={[{ required: true, message: t("auth.required") }]}
            style={{ flex: 1 }}
          >
            <Input prefix={<UserOutlined />} placeholder={t("auth.lastName")} />
          </Form.Item>
        </div>
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
          name="phoneNumber"
          rules={[{ required: true, message: t("auth.required") }]}
        >
          <Input prefix={<PhoneOutlined />} placeholder={t("auth.phoneNumber")} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: t("auth.required") }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder={t("auth.password")} />
        </Form.Item>
        <Form.Item style={{ marginBottom: 12 }}>
          <Button type="primary" htmlType="submit" block loading={loading} size="large">
            {t("auth.createAccount")}
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: "center", fontSize: 13, color: "#6b7280" }}>
        {t("auth.alreadyHaveAccount")}{" "}
        <Link href="/login" style={{ color: "#6366f1", fontWeight: 600 }}>
          {t("auth.signIn")}
        </Link>
      </div>
    </div>
  );
}
