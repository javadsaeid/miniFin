"use client";

import { useState } from "react";
import Link from "next/link";
import { Form, Input, Button, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { apiService } from "@/services/api";

export default function ForgotPasswordContent() {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      await apiService.forgotPassword(values);
      message.success("Reset code sent to your email");
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-title">Reset password</div>
      <div className="auth-form-subtitle">Enter your email and we&apos;ll send you a reset code</div>

      <Form layout="vertical" onFinish={onFinish} size="large">
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Email required" },
            { type: "email", message: "Invalid email" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email address" />
        </Form.Item>
        <Form.Item style={{ marginBottom: 12 }}>
          <Button type="primary" htmlType="submit" block loading={loading} size="large">
            Send Reset Code
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: "center", fontSize: 13, color: "#6b7280" }}>
        <Link href="/reset-password" style={{ color: "#6366f1", fontWeight: 600 }}>
          Have a code?
        </Link>
        {" · "}
        <Link href="/login" style={{ color: "#6366f1", fontWeight: 600 }}>
          Back to login
        </Link>
      </div>
    </div>
  );
}
