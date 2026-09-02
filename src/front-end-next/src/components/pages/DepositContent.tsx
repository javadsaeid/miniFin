"use client";

import { useEffect, useState } from "react";
import { Form, Select, InputNumber, Input, Button, message, Row, Col } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { apiService } from "@/services/api";
import AuthGuard from "@/components/AuthGuard";
import { useTranslation } from "@/i18n/context";

const { Option } = Select;

interface Account {
  id: number;
  accountNumber: string;
  balance: number;
  currency: string;
}

export default function DepositContent() {
  const { t } = useTranslation();
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
      await apiService.createTransaction({ ...values, transactionType: "DEPOSIT" });
      message.success(t("deposit.submitBtn"));
    } catch (err: any) {
      message.error(err.response?.data?.message || "Deposit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="page-header">
        <h1>{t("deposit.title")}</h1>
        <p>{t("deposit.subtitle")}</p>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <div className="card-elevated" style={{ padding: 32 }}>
            <Form layout="vertical" onFinish={onFinish} size="large">
              <Form.Item name="accountNumber" label={t("deposit.toAccount")} rules={[{ required: true }]}>
                <Select placeholder={t("deposit.selectAccount")} loading={fetching} notFoundContent={t("deposit.noAccounts")}>
                  {accounts.map((acc) => (
                    <Option key={acc.accountNumber} value={acc.accountNumber}>
                      {acc.accountNumber} ({acc.currency}) — ${acc.balance.toLocaleString()}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="amount" label={t("deposit.amount")} rules={[{ required: true }]}>
                <InputNumber min={0.01} step={0.01} style={{ width: "100%" }} placeholder="0.00" prefix="$" />
              </Form.Item>

              <Form.Item name="description" label={t("deposit.description")}>
                <Input.TextArea placeholder={t("deposit.descriptionPlaceholder")} rows={3} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading} icon={<PlusCircleOutlined />}>
                  {t("deposit.submitBtn")}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <div className="card-elevated" style={{ padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1f2937", marginBottom: 16 }}>
              {t("deposit.yourAccounts")}
            </div>
            {fetching ? (
              <div style={{ color: "#9ca3af", fontSize: 13 }}>{t("common.loading")}</div>
            ) : accounts.length === 0 ? (
              <div style={{ color: "#9ca3af", fontSize: 13 }}>{t("deposit.noAccounts")}</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {accounts.map((acc) => (
                  <div key={acc.id} style={{ padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>{acc.accountNumber}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#1f2937" }}>${acc.balance.toLocaleString()}</div>
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
