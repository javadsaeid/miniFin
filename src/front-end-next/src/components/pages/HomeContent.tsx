"use client";

import { useState, useEffect } from "react";
import { Button, Space, Row, Col } from "antd";
import {
  BankOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  LockOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";

const features = [
  {
    icon: <LockOutlined style={{ fontSize: 24 }} />,
    title: "Bank-Grade Security",
    desc: "JWT authentication with role-based access control keeps your assets safe.",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.1)",
  },
  {
    icon: <ThunderboltOutlined style={{ fontSize: 24 }} />,
    title: "Instant Transfers",
    desc: "Move money between accounts in real-time with instant confirmation.",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
  },
  {
    icon: <CheckCircleOutlined style={{ fontSize: 24 }} />,
    title: "Full Audit Trail",
    desc: "Every transaction is logged with complete details for full transparency.",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
  },
];

export default function HomeContent() {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    setAuth(isAuthenticated());
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 48 }}>
        <div style={{ maxWidth: 600 }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: "#1f2937", letterSpacing: "-1px", marginBottom: 12, lineHeight: 1.1 }}>
            Your finances,
            <br />
            <span style={{ color: "#6366f1" }}>simplified.</span>
          </h1>
          <p style={{ fontSize: 16, color: "#6b7280", lineHeight: 1.6, marginBottom: 28 }}>
            Manage accounts, make transfers, and track every transaction — all in one place.
          </p>
          <Space size="middle">
            {auth ? (
              <Link href="/profile">
                <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
                    Get Started
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="large">Create Account</Button>
                </Link>
              </>
            )}
          </Space>
        </div>
      </div>

      <Row gutter={[20, 20]}>
        {features.map((f, i) => (
          <Col xs={24} sm={8} key={i}>
            <div
              className={`stat-card animate-in animate-in-delay-${i + 1}`}
              style={{ height: "100%" }}
            >
              <div
                className="stat-card-icon"
                style={{ background: f.bg, color: f.color }}
              >
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
        <ClockCircleOutlined style={{ fontSize: 20, color: "#16a34a" }} />
        <div>
          <div style={{ fontWeight: 600, color: "#15803d", fontSize: 14 }}>
            Trusted by users worldwide
          </div>
          <div style={{ color: "#166534", fontSize: 13 }}>
            Secure, reliable, and always available when you need it.
          </div>
        </div>
      </div>
    </div>
  );
}
