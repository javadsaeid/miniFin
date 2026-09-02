"use client";

import { useEffect, useState } from "react";
import { Select, Table, Tag, message, Row, Col } from "antd";
import { apiService } from "@/services/api";
import AuthGuard from "@/components/AuthGuard";

const { Option } = Select;

interface Account {
  id: number;
  accountNumber: string;
  balance: number;
  currency: string;
}

interface Transaction {
  id: number;
  amount: number;
  transactionType: string;
  transactionDateTime: string;
  description: string;
  status: string;
  sourceAccount: string;
  destinationAccount: string;
}

const statusColor: Record<string, string> = {
  SUCCESS: "green",
  FAILED: "red",
  PENDING: "orange",
};

const txTypeColor: Record<string, string> = {
  DEPOSIT: "green",
  WITHDRAW: "orange",
  TRANSFER: "blue",
};

export default function TransactionsContent() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    apiService
      .getMyAccounts()
      .then((res) => setAccounts(res.data.data || []))
      .catch(() => message.error("Failed to load accounts"))
      .finally(() => setFetching(false));
  }, []);

  const handleAccountChange = async (accountNumber: string) => {
    setLoading(true);
    try {
      const res = await apiService.getTransactions(accountNumber);
      setTransactions(res.data.data || []);
    } catch {
      message.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Type",
      dataIndex: "transactionType",
      key: "transactionType",
      render: (type: string) => <Tag color={txTypeColor[type]}>{type}</Tag>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (v: number) => (
        <span style={{ fontWeight: 600 }}>${v.toLocaleString()}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={statusColor[status] || "default"}>{status}</Tag>
      ),
    },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "From", dataIndex: "sourceAccount", key: "sourceAccount" },
    { title: "To", dataIndex: "destinationAccount", key: "destinationAccount" },
    {
      title: "Date",
      dataIndex: "transactionDateTime",
      key: "transactionDateTime",
      render: (v: string) => v?.split("T")[0],
    },
  ];

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const successCount = transactions.filter((t) => t.status === "SUCCESS").length;

  return (
    <AuthGuard>
      <div className="page-header">
        <h1>Transactions</h1>
        <p>View your transaction history</p>
      </div>

      <div className="card-elevated" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#6b7280", marginBottom: 12 }}>
          Select Account
        </div>
        <Select
          placeholder="Select an account to view transactions"
          style={{ width: "100%", maxWidth: 400 }}
          onChange={handleAccountChange}
          loading={fetching}
          notFoundContent="No accounts found"
          size="large"
        >
          {accounts.map((acc) => (
            <Option key={acc.accountNumber} value={acc.accountNumber}>
              {acc.accountNumber} ({acc.currency})
            </Option>
          ))}
        </Select>
      </div>

      {transactions.length > 0 && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={8}>
            <div className="stat-card">
              <div className="stat-card-value">{transactions.length}</div>
              <div className="stat-card-label">Total Transactions</div>
            </div>
          </Col>
          <Col xs={8}>
            <div className="stat-card">
              <div className="stat-card-value">${totalAmount.toLocaleString()}</div>
              <div className="stat-card-label">Total Amount</div>
            </div>
          </Col>
          <Col xs={8}>
            <div className="stat-card">
              <div className="stat-card-value">{successCount}</div>
              <div className="stat-card-label">Successful</div>
            </div>
          </Col>
        </Row>
      )}

      <div className="card-elevated" style={{ overflow: "hidden" }}>
        <Table
          columns={columns}
          dataSource={transactions}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showTotal: (total) => `${total} transactions` }}
          locale={{ emptyText: "Select an account to view transactions" }}
        />
      </div>
    </AuthGuard>
  );
}
