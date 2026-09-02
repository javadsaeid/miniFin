"use client";

import { useEffect, useState } from "react";
import { Tabs, Table, Tag, message, Row, Col } from "antd";
import {
  UserOutlined,
  BankOutlined,
  TransactionOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { apiService } from "@/services/api";
import AuthGuard from "@/components/AuthGuard";

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  active: boolean;
  roles: { id: number; name: string }[];
  createdAt: string;
}

interface AccountData {
  id: number;
  accountNumber: string;
  balance: number;
  accountType: string;
  currency: string;
  user?: { firstName: string; lastName: string; email: string };
}

interface TransactionData {
  id: number;
  amount: number;
  transactionType: string;
  transactionDateTime: string;
  description: string;
  status: string;
  sourceAccount: string;
  destinationAccount: string;
}

interface RoleData {
  id: number;
  name: string;
}

const roleColors: Record<string, string> = {
  ADMIN: "red",
  CUSTOMER: "blue",
  AUDITOR: "green",
};

const statusColors: Record<string, string> = {
  SUCCESS: "green",
  FAILED: "red",
  PENDING: "orange",
};

const txTypeColors: Record<string, string> = {
  DEPOSIT: "green",
  WITHDRAW: "orange",
  TRANSFER: "blue",
};

export default function AdminPanelContent() {
  const [totals, setTotals] = useState<Record<string, number>>({});
  const [users, setUsers] = useState<UserData[]>([]);
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiService.getSystemTotals(),
      apiService.getAllUsers(),
      apiService.getAllAccounts(),
      apiService.getAllTransactions(),
      apiService.getAllRoles(),
    ])
      .then(([totalsRes, usersRes, accountsRes, txRes, rolesRes]) => {
        setTotals(totalsRes.data);
        setUsers(usersRes.data);
        setAccounts(accountsRes.data);
        setTransactions(txRes.data);
        setRoles(rolesRes.data?.data || rolesRes.data);
      })
      .catch(() => message.error("Failed to load admin data"))
      .finally(() => setLoading(false));
  }, []);

  const userColumns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "First Name", dataIndex: "firstName", key: "firstName" },
    { title: "Last Name", dataIndex: "lastName", key: "lastName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phoneNumber", key: "phoneNumber" },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
      render: (roles: { name: string }[]) =>
        roles?.map((r) => (
          <Tag key={r.name} color={roleColors[r.name] || "default"}>
            {r.name}
          </Tag>
        )),
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      render: (active: boolean) => (
        <Tag color={active ? "green" : "red"}>{active ? "Active" : "Inactive"}</Tag>
      ),
    },
    { title: "Created", dataIndex: "createdAt", key: "createdAt", render: (v: string) => v?.split("T")[0] },
  ];

  const accountColumns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "Account Number", dataIndex: "accountNumber", key: "accountNumber" },
    {
      title: "Owner",
      key: "owner",
      render: (_: any, record: AccountData) =>
        record.user ? `${record.user.firstName} ${record.user.lastName}` : "—",
    },
    {
      title: "Owner Email",
      key: "ownerEmail",
      render: (_: any, record: AccountData) => record.user?.email || "—",
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (v: number) => <span style={{ fontWeight: 600 }}>${v.toLocaleString()}</span>,
    },
    { title: "Type", dataIndex: "accountType", key: "accountType", render: (v: string) => <Tag>{v}</Tag> },
    { title: "Currency", dataIndex: "currency", key: "currency" },
  ];

  const txColumns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    {
      title: "Type",
      dataIndex: "transactionType",
      key: "transactionType",
      render: (v: string) => <Tag color={txTypeColors[v]}>{v}</Tag>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (v: number) => <span style={{ fontWeight: 600 }}>${v.toLocaleString()}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (v: string) => <Tag color={statusColors[v]}>{v}</Tag>,
    },
    { title: "From", dataIndex: "sourceAccount", key: "sourceAccount" },
    { title: "To", dataIndex: "destinationAccount", key: "destinationAccount" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Date", dataIndex: "transactionDateTime", key: "transactionDateTime", render: (v: string) => v?.split("T")[0] },
  ];

  const roleColumns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (v: string) => <Tag color={roleColors[v] || "default"}>{v}</Tag>,
    },
  ];

  const tabItems = [
    {
      key: "users",
      label: <span><UserOutlined /> Users ({users.length})</span>,
      children: (
        <Table columns={userColumns} dataSource={users} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} size="small" />
      ),
    },
    {
      key: "accounts",
      label: <span><BankOutlined /> Accounts ({accounts.length})</span>,
      children: (
        <Table columns={accountColumns} dataSource={accounts} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} size="small" />
      ),
    },
    {
      key: "transactions",
      label: <span><TransactionOutlined /> Transactions ({transactions.length})</span>,
      children: (
        <Table columns={txColumns} dataSource={transactions} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} size="small" />
      ),
    },
    {
      key: "roles",
      label: <span><SafetyCertificateOutlined /> Roles ({roles.length})</span>,
      children: (
        <Table columns={roleColumns} dataSource={roles} rowKey="id" loading={loading} pagination={false} size="small" />
      ),
    },
  ];

  const statCards = [
    { label: "Users", value: totals.totalUsers || 0, icon: <UserOutlined />, colorClass: "purple" },
    { label: "Accounts", value: totals.totalAccounts || 0, icon: <BankOutlined />, colorClass: "green" },
    { label: "Transactions", value: totals.totalTransactions || 0, icon: <TransactionOutlined />, colorClass: "orange" },
    { label: "Roles", value: roles.length, icon: <SafetyCertificateOutlined />, colorClass: "rose" },
  ];

  return (
    <AuthGuard>
      <div className="page-header">
        <h1>Admin Panel</h1>
        <p>System overview and management</p>
      </div>

      <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
        {statCards.map((s, i) => (
          <Col xs={12} sm={6} key={i}>
            <div className={`stat-card animate-in animate-in-delay-${i + 1}`}>
              <div className={`stat-card-icon ${s.colorClass}`}>{s.icon}</div>
              <div className="stat-card-value">{s.value}</div>
              <div className="stat-card-label">{s.label}</div>
            </div>
          </Col>
        ))}
      </Row>

      <div className="card-elevated" style={{ overflow: "hidden" }}>
        <Tabs items={tabItems} style={{ padding: "0 4px" }} />
      </div>
    </AuthGuard>
  );
}
