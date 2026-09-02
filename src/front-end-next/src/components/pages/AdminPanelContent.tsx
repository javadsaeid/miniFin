"use client";

import { useEffect, useState, useMemo } from "react";
import { Tabs, Table, Tag, message, Row, Col, Button, Modal, Form, Input, Popconfirm, Space, Select, DatePicker } from "antd";
import {
  UserOutlined,
  BankOutlined,
  TransactionOutlined,
  SafetyCertificateOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { apiService } from "@/services/api";
import AuthGuard from "@/components/AuthGuard";
import { useTranslation } from "@/i18n/context";
import dayjs from "dayjs";

interface UserData { id: number; firstName: string; lastName: string; email: string; phoneNumber: string; active: boolean; roles: { id: number; name: string }[]; createdAt: string; }
interface AccountData { id: number; accountNumber: string; balance: number; accountType: string; currency: string; user?: { firstName: string; lastName: string; email: string }; }
interface TransactionData { id: number; amount: number; transactionType: string; transactionDateTime: string; description: string; status: string; sourceAccount: string; destinationAccount: string; }
interface RoleData { id: number; name: string; }

const roleColors: Record<string, string> = { ADMIN: "red", CUSTOMER: "blue", AUDITOR: "green" };
const statusColors: Record<string, string> = { SUCCESS: "green", FAILED: "red", PENDING: "orange" };
const txTypeColors: Record<string, string> = { DEPOSIT: "green", WITHDRAW: "orange", TRANSFER: "blue" };

export default function AdminPanelContent() {
  const { t } = useTranslation();
  const [totals, setTotals] = useState<Record<string, number>>({});
  const [users, setUsers] = useState<UserData[]>([]);
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(true);

  // Role CRUD
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleData | null>(null);
  const [roleForm] = Form.useForm();

  // User search
  const [userSearch, setUserSearch] = useState("");

  // Transaction filters
  const [txFilterType, setTxFilterType] = useState<string | undefined>(undefined);
  const [txFilterStatus, setTxFilterStatus] = useState<string | undefined>(undefined);
  const [txFilterDateRange, setTxFilterDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  const fetchData = () => {
    setLoading(true);
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
  };

  useEffect(() => { fetchData(); }, []);

  // Filtered users
  const filteredUsers = useMemo(() => {
    if (!userSearch) return users;
    const q = userSearch.toLowerCase();
    return users.filter(u =>
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  }, [users, userSearch]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    let result = transactions;
    if (txFilterType) result = result.filter(tx => tx.transactionType === txFilterType);
    if (txFilterStatus) result = result.filter(tx => tx.status === txFilterStatus);
    if (txFilterDateRange && txFilterDateRange[0] && txFilterDateRange[1]) {
      const start = txFilterDateRange[0].startOf("day");
      const end = txFilterDateRange[1].endOf("day");
      result = result.filter(tx => {
        const d = dayjs(tx.transactionDateTime);
        return d.isAfter(start) && d.isBefore(end);
      });
    }
    return result;
  }, [transactions, txFilterType, txFilterStatus, txFilterDateRange]);

  // Role handlers
  const handleCreateRole = () => {
    setEditingRole(null);
    roleForm.resetFields();
    setRoleModalOpen(true);
  };

  const handleEditRole = (role: RoleData) => {
    setEditingRole(role);
    roleForm.setFieldsValue({ name: role.name });
    setRoleModalOpen(true);
  };

  const handleSaveRole = async () => {
    try {
      const values = await roleForm.validateFields();
      if (editingRole) {
        await apiService.updateRole({ id: editingRole.id, name: values.name });
        message.success(t("roles.updated"));
      } else {
        await apiService.createRole({ name: values.name });
        message.success(t("roles.created"));
      }
      setRoleModalOpen(false);
      fetchData();
    } catch (err: any) {
      if (err.response?.data?.message) message.error(err.response.data.message);
    }
  };

  const handleDeleteRole = async (id: number) => {
    try {
      await apiService.deleteRole(id);
      message.success(t("roles.deleted"));
      fetchData();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to delete role");
    }
  };

  const userColumns = [
    { title: t("admin.id"), dataIndex: "id", key: "id", width: 60 },
    { title: t("admin.firstName"), dataIndex: "firstName", key: "firstName" },
    { title: t("admin.lastName"), dataIndex: "lastName", key: "lastName" },
    { title: t("admin.email"), dataIndex: "email", key: "email" },
    { title: t("admin.phone"), dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: t("admin.roles"), dataIndex: "roles", key: "roles", render: (roles: { name: string }[]) => roles?.map((r) => <Tag key={r.name} color={roleColors[r.name] || "default"}>{r.name}</Tag>) },
    { title: t("admin.status"), dataIndex: "active", key: "active", render: (active: boolean) => <Tag color={active ? "green" : "red"}>{active ? t("admin.active") : t("admin.inactive")}</Tag> },
    { title: t("admin.created"), dataIndex: "createdAt", key: "createdAt", render: (v: string) => v?.split("T")[0] },
  ];

  const accountColumns = [
    { title: t("admin.id"), dataIndex: "id", key: "id", width: 60 },
    { title: t("admin.accountNumber"), dataIndex: "accountNumber", key: "accountNumber" },
    { title: t("admin.owner"), key: "owner", render: (_: any, record: AccountData) => record.user ? `${record.user.firstName} ${record.user.lastName}` : "—" },
    { title: t("admin.ownerEmail"), key: "ownerEmail", render: (_: any, record: AccountData) => record.user?.email || "—" },
    { title: t("admin.balance"), dataIndex: "balance", key: "balance", render: (v: number) => <span style={{ fontWeight: 600 }}>${v.toLocaleString()}</span> },
    { title: t("admin.type"), dataIndex: "accountType", key: "accountType", render: (v: string) => <Tag>{v}</Tag> },
    { title: t("admin.currency"), dataIndex: "currency", key: "currency" },
  ];

  const txColumns = [
    { title: t("admin.id"), dataIndex: "id", key: "id", width: 60 },
    { title: t("admin.type"), dataIndex: "transactionType", key: "transactionType", render: (v: string) => <Tag color={txTypeColors[v]}>{v}</Tag> },
    { title: t("admin.balance"), dataIndex: "amount", key: "amount", render: (v: number) => <span style={{ fontWeight: 600 }}>${v.toLocaleString()}</span> },
    { title: t("admin.status"), dataIndex: "status", key: "status", render: (v: string) => <Tag color={statusColors[v]}>{v}</Tag> },
    { title: t("admin.from"), dataIndex: "sourceAccount", key: "sourceAccount" },
    { title: t("admin.to"), dataIndex: "destinationAccount", key: "destinationAccount" },
    { title: t("admin.description"), dataIndex: "description", key: "description" },
    { title: t("admin.date"), dataIndex: "transactionDateTime", key: "transactionDateTime", render: (v: string) => v?.split("T")[0] },
  ];

  const roleColumns = [
    { title: t("admin.id"), dataIndex: "id", key: "id", width: 60 },
    { title: t("admin.name"), dataIndex: "name", key: "name", render: (v: string) => <Tag color={roleColors[v] || "default"}>{v}</Tag> },
    {
      title: t("common.actions"),
      key: "actions",
      width: 120,
      render: (_: any, record: RoleData) => (
        <Space size="small">
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEditRole(record)} />
          <Popconfirm title={t("roles.deleteConfirm")} onConfirm={() => handleDeleteRole(record.id)} okText={t("common.confirm")} cancelText={t("common.cancel")}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: "users",
      label: <span><UserOutlined /> {t("admin.users")} ({filteredUsers.length})</span>,
      children: (
        <>
          <div style={{ marginBottom: 16 }}>
            <Input
              placeholder={t("common.search") + "..."}
              prefix={<SearchOutlined />}
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              style={{ maxWidth: 300 }}
              allowClear
            />
          </div>
          <Table columns={userColumns} dataSource={filteredUsers} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} size="small" />
        </>
      ),
    },
    {
      key: "accounts",
      label: <span><BankOutlined /> {t("admin.accounts")} ({accounts.length})</span>,
      children: <Table columns={accountColumns} dataSource={accounts} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} size="small" />,
    },
    {
      key: "transactions",
      label: <span><TransactionOutlined /> {t("admin.transactions")} ({filteredTransactions.length})</span>,
      children: (
        <>
          <div style={{ marginBottom: 16, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <Select placeholder={t("filters.allTypes")} style={{ width: 160 }} allowClear value={txFilterType} onChange={setTxFilterType}>
              <Select.Option value="DEPOSIT">DEPOSIT</Select.Option>
              <Select.Option value="WITHDRAW">WITHDRAW</Select.Option>
              <Select.Option value="TRANSFER">TRANSFER</Select.Option>
            </Select>
            <Select placeholder={t("filters.allStatuses")} style={{ width: 160 }} allowClear value={txFilterStatus} onChange={setTxFilterStatus}>
              <Select.Option value="SUCCESS">SUCCESS</Select.Option>
              <Select.Option value="FAILED">FAILED</Select.Option>
              <Select.Option value="PENDING">PENDING</Select.Option>
            </Select>
            <DatePicker.RangePicker
              value={txFilterDateRange as any}
              onChange={(dates) => setTxFilterDateRange(dates as any)}
            />
            {(txFilterType || txFilterStatus || txFilterDateRange) && (
              <Button size="small" onClick={() => { setTxFilterType(undefined); setTxFilterStatus(undefined); setTxFilterDateRange(null); }}>
                {t("common.resetFilters")}
              </Button>
            )}
          </div>
          <Table columns={txColumns} dataSource={filteredTransactions} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} size="small" />
        </>
      ),
    },
    {
      key: "roles",
      label: <span><SafetyCertificateOutlined /> {t("admin.roles")} ({roles.length})</span>,
      children: (
        <>
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateRole}>
              {t("roles.createRole")}
            </Button>
          </div>
          <Table columns={roleColumns} dataSource={roles} rowKey="id" loading={loading} pagination={false} size="small" />
        </>
      ),
    },
  ];

  const statCards = [
    { label: t("admin.users"), value: totals.totalUsers || 0, icon: <UserOutlined />, colorClass: "purple" },
    { label: t("admin.accounts"), value: totals.totalAccounts || 0, icon: <BankOutlined />, colorClass: "green" },
    { label: t("admin.transactions"), value: totals.totalTransactions || 0, icon: <TransactionOutlined />, colorClass: "orange" },
    { label: t("admin.roles"), value: roles.length, icon: <SafetyCertificateOutlined />, colorClass: "rose" },
  ];

  return (
    <AuthGuard>
      <div className="page-header">
        <h1>{t("admin.title")}</h1>
        <p>{t("admin.subtitle")}</p>
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

      <Modal
        title={editingRole ? t("roles.editRole") : t("roles.createRole")}
        open={roleModalOpen}
        onOk={handleSaveRole}
        onCancel={() => setRoleModalOpen(false)}
        okText={t("common.save")}
        cancelText={t("common.cancel")}
      >
        <Form form={roleForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label={t("roles.roleName")} rules={[{ required: true, message: t("auth.required") }]}>
            <Input placeholder="e.g. MANAGER" />
          </Form.Item>
        </Form>
      </Modal>
    </AuthGuard>
  );
}
