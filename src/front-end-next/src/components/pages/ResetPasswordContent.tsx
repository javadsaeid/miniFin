"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, Input, Button, message } from "antd";
import { LockOutlined, KeyOutlined, MailOutlined } from "@ant-design/icons";
import { apiService } from "@/services/api";

export default function ResetPasswordContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: {
    email: string;
    code: string;
    newPassword: string;
  }) => {
    setLoading(true);
    try {
      await apiService.resetPassword(values);
      message.success("Password reset successful");
      router.push("/login");
    } catch (err: any) {
      message.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-title">Set new password</div>
      <div className="auth-form-subtitle">Enter the code from your email and your new password</div>

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
        <Form.Item
          name="code"
          rules={[{ required: true, message: "Reset code required" }]}
        >
          <Input prefix={<KeyOutlined />} placeholder="Reset code" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          rules={[{ required: true, message: "New password required" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="New password" />
        </Form.Item>
        <Form.Item style={{ marginBottom: 12 }}>
          <Button type="primary" htmlType="submit" block loading={loading} size="large">
            Reset Password
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: "center", fontSize: 13 }}>
        <Link href="/login" style={{ color: "#6366f1", fontWeight: 600 }}>
          Back to login
        </Link>
      </div>
    </div>
  );
}
