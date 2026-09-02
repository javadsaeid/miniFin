"use client";

import { useEffect, useState } from "react";
import { Form, Select, InputNumber, Input, Button, message, Row, Col } from "antd";
import { DollarOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { apiService } from "@/services/api";
import AuthGuard from "@/components/AuthGuard";

const { Option } = Select;

interface Account {
  id: number;
  accountNumber: string;
  balance: number;
  currency: string;
}

export default function DepositContent() {
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
    accountNumber: string;
    amount: number;
    description?: string;
  }) => {
    setLoading(true);
    try {
      await apiService.createTransaction({
        ...values,
        transactionType: "DEPOSIT",
      });
      message.success("Deposit successful");
    } catch (err: any) {
      message.error(err.response?.data?.message || "Deposit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="page-header">
        <h1>Deposit</h1>
        <p>Add funds to your account</p>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <div className="card-elevated" style={{ padding: 32 }}>
            <Form layout="vertical" onFinish={onFinish} size="large">
              <Form.Item
                name="accountNumber"
                label="To Account"
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
                <Button type="primary" htmlType="submit" block loading={loading} icon={<PlusCircleOutlined />}>
                  Make Deposit
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
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{acc.currency}</div>
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
