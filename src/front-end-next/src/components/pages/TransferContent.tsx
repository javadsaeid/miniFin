"use client";

import { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  message,
  Row,
  Col,
} from "antd";
import {
  SwapOutlined,
  DollarOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { apiService } from "@/services/api";
import AuthGuard from "@/components/AuthGuard";

const { Option } = Select;

interface Account {
  id: number;
  accountNumber: string;
  balance: number;
  accountType: string;
  currency: string;
}

export default function TransferContent() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    apiService
      .getMyAccounts()
      .then((res) => setAccounts(res.data.data || []))
      .catch(() => message.error("Failed to load accounts"))
      .finally(() => setFetching(false));
  }, []);

  const onFinish = async (values: {
    transactionType: string;
    accountNumber: string;
    destinationAccountNumber?: string;
    amount: number;
    description?: string;
  }) => {
    setLoading(true);
    try {
      await apiService.createTransaction(values);
      message.success("Transaction created successfully");
    } catch (err: any) {
      message.error(err.response?.data?.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="page-header">
        <h1>Transfer</h1>
        <p>Send money or make a withdrawal</p>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <div className="card-elevated" style={{ padding: 32 }}>
            <Form layout="vertical" onFinish={onFinish} size="large">
              <Form.Item
                name="transactionType"
                label="Transaction Type"
                rules={[{ required: true, message: "Select a type" }]}
              >
                <Select placeholder="Select type">
                  <Option value="TRANSFER">
                    <SwapOutlined /> Transfer
                  </Option>
                  <Option value="WITHDRAW">
                    <DollarOutlined /> Withdraw
                  </Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="accountNumber"
                label="From Account"
                rules={[{ required: true, message: "Select an account" }]}
              >
                <Select
                  placeholder="Select account"
                  loading={fetching}
                  notFoundContent="No accounts found"
                >
                  {accounts.map((acc) => (
                    <Option key={acc.accountNumber} value={acc.accountNumber}>
                      {acc.accountNumber} ({acc.currency}) — ${acc.balance.toLocaleString()}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="destinationAccountNumber"
                label="Destination Account"
                dependencies={["transactionType"]}
              >
                <Input placeholder="Destination account number" />
              </Form.Item>

              <Form.Item
                name="amount"
                label="Amount"
                rules={[{ required: true, message: "Amount required" }]}
              >
                <InputNumber
                  min={0.01}
                  step={0.01}
                  style={{ width: "100%" }}
                  placeholder="0.00"
                  prefix="$"
                />
              </Form.Item>

              <Form.Item name="description" label="Description">
                <Input.TextArea placeholder="Optional description" rows={3} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading} icon={<SendOutlined />}>
                  Submit Transaction
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <div className="card-elevated" style={{ padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1f2937", marginBottom: 16 }}>
              Your Accounts
            </div>
            {fetching ? (
              <div style={{ color: "#9ca3af", fontSize: 13 }}>Loading...</div>
            ) : accounts.length === 0 ? (
              <div style={{ color: "#9ca3af", fontSize: 13 }}>No accounts found</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {accounts.map((acc) => (
                  <div key={acc.id} style={{ padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>{acc.accountNumber}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#1f2937" }}>
                      ${acc.balance.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{acc.accountType} · {acc.currency}</div>
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
