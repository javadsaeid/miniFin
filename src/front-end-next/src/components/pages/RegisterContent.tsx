"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined } from "@ant-design/icons";
import { apiService } from "@/services/api";

export default function RegisterContent() {
  const router = useRouter();
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
      message.success("Account created successfully");
      router.push("/login");
    } catch (err: any) {
      message.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-title">Create account</div>
      <div className="auth-form-subtitle">Get started with your free account</div>

      <Form layout="vertical" onFinish={onFinish} size="large">
        <div style={{ display: "flex", gap: 12 }}>
          <Form.Item
            name="firstName"
            rules={[{ required: true, message: "Required" }]}
            style={{ flex: 1 }}
          >
            <Input prefix={<UserOutlined />} placeholder="First name" />
          </Form.Item>
          <Form.Item
            name="lastName"
            rules={[{ required: true, message: "Required" }]}
            style={{ flex: 1 }}
          >
            <Input prefix={<UserOutlined />} placeholder="Last name" />
          </Form.Item>
        </div>
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
          name="phoneNumber"
          rules={[{ required: true, message: "Phone required" }]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="Phone number" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Password required" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item style={{ marginBottom: 12 }}>
          <Button type="primary" htmlType="submit" block loading={loading} size="large">
            Create Account
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: "center", fontSize: 13, color: "#6b7280" }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "#6366f1", fontWeight: 600 }}>
          Sign in
        </Link>
      </div>
    </div>
  );
}
