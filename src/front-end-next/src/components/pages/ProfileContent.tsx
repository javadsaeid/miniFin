"use client";

import { useEffect, useState } from "react";
import {
  Upload,
  Button,
  Form,
  Input,
  message,
  Row,
  Col,
  Popconfirm,
  Divider,
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
  DeleteOutlined,
} from "@ant-design/icons";
import { apiService } from "@/services/api";
import AuthGuard from "@/components/AuthGuard";
import { useTranslation } from "@/i18n/context";

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

interface Account {
  id: number;
  accountNumber: string;
  balance: number;
  accountType: string;
  currency: string;
}

export default function ProfileContent() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiService.getMyProfile(),
      apiService.getMyAccounts(),
    ])
      .then(([profileRes, accountsRes]) => {
        setProfile(profileRes.data.data);
        setAccounts(accountsRes.data.data || []);
      })
      .catch(() => message.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handlePasswordUpdate = async (values: {
    oldPass: string;
    newPass: string;
  }) => {
    try {
      await apiService.updatePassword(values);
      message.success(t("profile.updateBtn"));
    } catch (err: any) {
      message.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleUpload = async (file: File) => {
    try {
      await apiService.uploadProfilePicture(file);
      message.success(t("profile.changePhoto"));
      const res = await apiService.getMyProfile();
      setProfile(res.data.data);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Upload failed");
    }
    return false;
  };

  const handleCloseAccount = async (accountNumber: string) => {
    try {
      await apiService.closeAccount(accountNumber);
      message.success(t("account.closed"));
      setAccounts(prev => prev.filter(a => a.accountNumber !== accountNumber));
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to close account");
    }
  };

  return (
    <AuthGuard>
      <div className="page-header">
        <h1>{t("profile.title")}</h1>
        <p>{t("profile.subtitle")}</p>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <div className="card-elevated" style={{ padding: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1, #a78bfa)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: 28, fontWeight: 700, flexShrink: 0,
              }}>
                {profile?.firstName?.charAt(0) || "U"}
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#1f2937" }}>
                  {profile?.firstName} {profile?.lastName}
                </div>
                <div style={{ color: "#6b7280", fontSize: 14 }}>{profile?.email}</div>
                <div style={{ marginTop: 4 }}>
                  {profile?.active ? (
                    <span style={{ color: "#16a34a", fontSize: 12, fontWeight: 600 }}>
                      <CheckCircleOutlined /> {t("profile.active")}
                    </span>
                  ) : (
                    <span style={{ color: "#dc2626", fontSize: 12, fontWeight: 600 }}>
                      <CloseCircleOutlined /> {t("profile.inactive")}
                    </span>
                  )}
                </div>
              </div>
              <Upload
                showUploadList={false}
                beforeUpload={(file) => { handleUpload(file); return false; }}
                style={{ marginLeft: "auto" }}
              >
                <Button icon={<UploadOutlined />}>{t("profile.changePhoto")}</Button>
              </Upload>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <InfoRow icon={<UserOutlined />} label={t("profile.fullName")} value={`${profile?.firstName} ${profile?.lastName}`} />
              <InfoRow icon={<MailOutlined />} label={t("profile.email")} value={profile?.email} />
              <InfoRow icon={<PhoneOutlined />} label={t("profile.phone")} value={profile?.phoneNumber} />
              <InfoRow icon={<CheckCircleOutlined />} label={t("profile.status")} value={profile?.active ? t("profile.active") : t("profile.inactive")} />
              <InfoRow icon={<ClockCircleOutlined />} label={t("profile.memberSince")} value={profile?.createdAt?.split("T")[0]} />
            </div>
          </div>
        </Col>

        <Col xs={24} lg={10}>
          <div className="card-elevated" style={{ padding: 32, marginBottom: 24 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#1f2937", marginBottom: 24 }}>
              {t("profile.updatePassword")}
            </div>
            <Form layout="vertical" onFinish={handlePasswordUpdate} size="large">
              <Form.Item name="oldPass" rules={[{ required: true, message: t("auth.required") }]}>
                <Input.Password prefix={<KeyOutlined />} placeholder={t("profile.currentPassword")} />
              </Form.Item>
              <Form.Item name="newPass" rules={[{ required: true, message: t("auth.required") }]}>
                <Input.Password prefix={<KeyOutlined />} placeholder={t("profile.newPassword")} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block size="large">
                  {t("profile.updateBtn")}
                </Button>
              </Form.Item>
            </Form>
          </div>

          <div className="card-elevated" style={{ padding: 32 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#1f2937", marginBottom: 8 }}>
              {t("account.closeAccount")}
            </div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
              {t("account.closeWarning")}
            </div>
            {accounts.length === 0 ? (
              <div style={{ color: "#9ca3af", fontSize: 13 }}>{t("account.noAccounts")}</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {accounts.map((acc) => (
                  <div key={acc.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#f9fafb", borderRadius: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#1f2937" }}>{acc.accountNumber}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>{acc.accountType} · {acc.currency} · ${acc.balance.toLocaleString()}</div>
                    </div>
                    <Popconfirm
                      title={t("account.closeAccount")}
                      description={t("account.closeConfirm")}
                      onConfirm={() => handleCloseAccount(acc.accountNumber)}
                      okText={t("common.confirm")}
                      cancelText={t("common.cancel")}
                      okButtonProps={{ danger: true }}
                    >
                      <Button danger size="small" icon={<DeleteOutlined />}>
                        {t("accounts.close")}
                      </Button>
                    </Popconfirm>
                  </div>
                ))}
              </div>
            )}
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
