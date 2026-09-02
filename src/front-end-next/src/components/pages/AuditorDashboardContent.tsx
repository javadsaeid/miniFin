"use client";

import { useEffect, useState } from "react";
import {
  Input,
  Button,
  Table,
  Tag,
  message,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  BankOutlined,
  TransactionOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { apiService } from "@/services/api";
import AuthGuard from "@/components/AuthGuard";

export default function AuditorDashboardContent() {
  const [totals, setTotals] = useState<Record<string, number>>({});
  const [user, setUser] = useState<any>(null);
  const [account, setAccount] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiService
      .getSystemTotals()
      .then((res) => setTotals(res.data))
      .catch(() => message.error("Failed to load totals"));
  }, []);

  const searchUser = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await apiService.findUserByEmail(email);
      setUser(res.data);
    } catch {
      message.error("User not found");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const searchAccount = async () => {
    if (!accountNumber) return;
    setLoading(true);
    try {
      const res = await apiService.findAccountByNumber(accountNumber);
      setAccount(res.data);
    } catch {
      message.error("Account not found");
      setAccount(null);
    } finally {
      setLoading(false);
    }
  };

  const searchTransactions = async () => {
    if (!accountNumber) return;
    setLoading(true);
    try {
      const res = await apiService.getTransactionsByAccountNumber(accountNumber);
      setTransactions(res.data || []);
    } catch {
      message.error("No transactions found");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const txColumns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Type", dataIndex: "transactionType", key: "transactionType", render: (v: string) => <Tag>{v}</Tag> },
    { title: "Amount", dataIndex: "amount", key: "amount", render: (v: number) => <span style={{ fontWeight: 600 }}>${v.toLocaleString()}</span> },
    { title: "Status", dataIndex: "status", key: "status", render: (v: string) => <Tag color={v === "SUCCESS" ? "green" : v === "FAILED" ? "red" : "orange"}>{v}</Tag> },
    { title: "From", dataIndex: "sourceAccount", key: "sourceAccount" },
    { title: "To", dataIndex: "destinationAccount", key: "destinationAccount" },
    { title: "Date", dataIndex: "transactionDateTime", key: "transactionDateTime", render: (v: string) => v?.split("T")[0] },
  ];

  const statCards = [
    { label: "Total Users", value: totals.totalUsers || 0, icon: <UserOutlined />, colorClass: "purple" },
    { label: "Total Accounts", value: totals.totalAccounts || 0, icon: <BankOutlined />, colorClass: "green" },
    { label: "Total Transactions", value: totals.totalTransactions || 0, icon: <TransactionOutlined />, colorClass: "orange" },
  ];

  return (
    <AuthGuard>
      <div className="page-header">
        <h1>Auditor Dashboard</h1>
        <p>Search and audit system data</p>
      </div>

      <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
        {statCards.map((s, i) => (
          <Col xs={24} sm={8} key={i}>
            <div className={`stat-card animate-in animate-in-delay-${i + 1}`}>
              <div className={`stat-card-icon ${s.colorClass}`}>{s.icon}</div>
              <div className="stat-card-value">{s.value}</div>
              <div className="stat-card-label">{s.label}</div>
            </div>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <div className="card-elevated" style={{ padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1f2937", marginBottom: 16 }}>
              Find User by Email
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Input
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ flex: 1 }}
                size="large"
              />
              <Button type="primary" icon={<SearchOutlined />} onClick={searchUser} loading={loading} size="large">
                Search
              </Button>
            </div>
            {user && (
              <div style={{ marginTop: 20, padding: 16, background: "#f9fafb", borderRadius: 8 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <InfoRow label="Name" value={`${user.firstName} ${user.lastName}`} />
                  <InfoRow label="Email" value={user.email} />
                  <InfoRow label="Phone" value={user.phoneNumber} />
                  <InfoRow label="Active" value={user.active ? "Yes" : "No"} />
                </div>
              </div>
            )}
          </div>
        </Col>

        <Col xs={24} lg={12}>
          <div className="card-elevated" style={{ padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1f2937", marginBottom: 16 }}>
              Find Account & Transactions
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Input
                placeholder="Account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                style={{ flex: 1 }}
                size="large"
              />
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => { searchAccount(); searchTransactions(); }}
                loading={loading}
                size="large"
              >
                Search
              </Button>
            </div>
            {account && (
              <div style={{ marginTop: 20, padding: 16, background: "#f9fafb", borderRadius: 8 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <InfoRow label="Account Number" value={account.accountNumber} />
                  <InfoRow label="Balance" value={`$${account.balance?.toLocaleString()}`} />
                  <InfoRow label="Type" value={account.accountType} />
                  <InfoRow label="Currency" value={account.currency} />
                </div>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {transactions.length > 0 && (
        <div className="card-elevated" style={{ marginTop: 24, overflow: "hidden" }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #f3f4f6" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1f2937" }}>
              Transactions for {accountNumber}
            </div>
          </div>
          <Table
            columns={txColumns}
            dataSource={transactions}
            rowKey="id"
            pagination={false}
            size="small"
          />
        </div>
      )}
    </AuthGuard>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ color: "#6b7280", fontSize: 13 }}>{label}</span>
      <span style={{ color: "#1f2937", fontSize: 14, fontWeight: 500 }}>{value}</span>
    </div>
  );
}
