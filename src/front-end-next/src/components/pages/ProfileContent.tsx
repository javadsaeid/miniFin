"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Upload,
  Button,
  Form,
  Input,
  message,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  UploadOutlined,
  KeyOutlined,
  MailOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { apiService } from "@/services/api";
import AuthGuard from "@/components/AuthGuard";

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePictureUrl: string;
  active: boolean;
  createdAt: string;
}

export default function ProfileContent() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService
      .getMyProfile()
      .then((res) => setProfile(res.data.data))
      .catch(() => message.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handlePasswordUpdate = async (values: {
    oldPass: string;
    newPass: string;
  }) => {
    try {
      await apiService.updatePassword(values);
      message.success("Password updated");
    } catch (err: any) {
      message.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleUpload = async (file: File) => {
    try {
      await apiService.uploadProfilePicture(file);
      message.success("Profile picture updated");
      const res = await apiService.getMyProfile();
      setProfile(res.data.data);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Upload failed");
    }
    return false;
  };

  return (
    <AuthGuard>
      <div className="page-header">
        <h1>Profile</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <div className="card-elevated" style={{ padding: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
              <Avatar
                size={72}
                src={profile?.profilePictureUrl}
                icon={<UserOutlined />}
                style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa)" }}
              />
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#1f2937" }}>
                  {profile?.firstName} {profile?.lastName}
                </div>
                <div style={{ color: "#6b7280", fontSize: 14 }}>{profile?.email}</div>
                <div style={{ marginTop: 4 }}>
                  {profile?.active ? (
                    <span style={{ color: "#16a34a", fontSize: 12, fontWeight: 600 }}>
                      <CheckCircleOutlined /> Active
                    </span>
                  ) : (
                    <span style={{ color: "#dc2626", fontSize: 12, fontWeight: 600 }}>
                      <CloseCircleOutlined /> Inactive
                    </span>
                  )}
                </div>
              </div>
              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  handleUpload(file);
                  return false;
                }}
                style={{ marginLeft: "auto" }}
              >
                <Button icon={<UploadOutlined />}>Change Photo</Button>
              </Upload>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <InfoRow icon={<UserOutlined />} label="Full Name" value={`${profile?.firstName} ${profile?.lastName}`} />
              <InfoRow icon={<MailOutlined />} label="Email" value={profile?.email} />
              <InfoRow icon={<PhoneOutlined />} label="Phone" value={profile?.phoneNumber} />
              <InfoRow icon={<CheckCircleOutlined />} label="Status" value={profile?.active ? "Active" : "Inactive"} />
              <InfoRow icon={<ClockCircleOutlined />} label="Member Since" value={profile?.createdAt?.split("T")[0]} />
            </div>
          </div>
        </Col>

        <Col xs={24} lg={10}>
          <div className="card-elevated" style={{ padding: 32 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#1f2937", marginBottom: 24 }}>
              Update Password
            </div>
            <Form layout="vertical" onFinish={handlePasswordUpdate} size="large">
              <Form.Item
                name="oldPass"
                rules={[{ required: true, message: "Current password required" }]}
              >
                <Input.Password prefix={<KeyOutlined />} placeholder="Current password" />
              </Form.Item>
              <Form.Item
                name="newPass"
                rules={[{ required: true, message: "New password required" }]}
              >
                <Input.Password prefix={<KeyOutlined />} placeholder="New password" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block size="large">
                  Update Password
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </AuthGuard>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}>
      <span style={{ color: "#9ca3af", fontSize: 16, width: 20, textAlign: "center" }}>{icon}</span>
      <span style={{ color: "#6b7280", fontSize: 13, minWidth: 100 }}>{label}</span>
      <span style={{ color: "#1f2937", fontSize: 14, fontWeight: 500, marginLeft: "auto" }}>{value || "—"}</span>
    </div>
  );
}
