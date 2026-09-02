"use client";

import { useEffect, useState } from "react";
import { Form, Input, InputNumber, Select, Button, message, Row, Col } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { apiService } from "@/services/api";
import AuthGuard from "@/components/AuthGuard";
import { useTranslation } from "@/i18n/context";

const { Option } = Select;

interface Account {
  id: number;
  accountNumber: string;
  balance: number;
  accountType: string;
  currency: string;
}

export default function TransferContent() {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form] = Form.useForm();
  const [txType, setTxType] = useState<string>("");

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
      message.success(t("transfer.submitBtn"));
      form.resetFields();
      setTxType("");
    } catch (err: any) {
      message.error(err.response?.data?.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  const selectedAccount = Form.useWatch("accountNumber", form);

  const otherAccounts = accounts.filter((a) => a.accountNumber !== selectedAccount);

  return (
    <AuthGuard>
      <div className="page-header">
        <h1>{t("transfer.title")}</h1>
        <p>{t("transfer.subtitle")}</p>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <div className="card-elevated" style={{ padding: 32 }}>
            <Form form={form} layout="vertical" onFinish={onFinish} size="large">
              <Form.Item name="transactionType" label={t("transfer.transactionType")} rules={[{ required: true }]}>
                <Select placeholder={t("transfer.selectType")} onChange={(v) => setTxType(v)}>
                  <Option value="TRANSFER">{t("transfer.transfer")}</Option>
                  <Option value="WITHDRAW">{t("transfer.withdraw")}</Option>
                </Select>
              </Form.Item>

              <Form.Item name="accountNumber" label={t("transfer.fromAccount")} rules={[{ required: true }]}>
                <Select placeholder={t("transfer.selectAccount")} loading={fetching} notFoundContent={t("transfer.noAccounts")}>
                  {accounts.map((acc) => (
                    <Option key={acc.accountNumber} value={acc.accountNumber}>
                      {acc.accountNumber} ({acc.currency}) — ${acc.balance.toLocaleString()}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {txType === "TRANSFER" && (
                <Form.Item name="destinationAccountNumber" label={t("transfer.destinationAccount")} rules={[{ required: true }]}>
                  <Select placeholder={t("transfer.selectAccount")} notFoundContent={t("transfer.noAccounts")}>
                    {otherAccounts.map((acc) => (
                      <Option key={acc.accountNumber} value={acc.accountNumber}>
                        {acc.accountNumber} ({acc.currency}) — ${acc.balance.toLocaleString()}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}

              {txType === "WITHDRAW" && (
                <Form.Item name="destinationAccountNumber" label={t("transfer.destinationAccount")}>
                  <Input placeholder={t("transfer.destinationPlaceholder")} />
                </Form.Item>
              )}

              <Form.Item name="amount" label={t("transfer.amount")} rules={[{ required: true }]}>
                <InputNumber min={0.01} step={0.01} style={{ width: "100%" }} placeholder="0.00" prefix="$" />
              </Form.Item>

              <Form.Item name="description" label={t("transfer.description")}>
                <Input.TextArea placeholder={t("transfer.descriptionPlaceholder")} rows={3} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading} icon={<SendOutlined />}>
                  {t("transfer.submitBtn")}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <div className="card-elevated" style={{ padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1f2937", marginBottom: 16 }}>
              {t("transfer.yourAccounts")}
            </div>
            {fetching ? (
              <div style={{ color: "#9ca3af", fontSize: 13 }}>{t("transfer.loading")}</div>
            ) : accounts.length === 0 ? (
              <div style={{ color: "#9ca3af", fontSize: 13 }}>{t("transfer.noAccounts")}</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {accounts.map((acc) => (
                  <div key={acc.id} style={{ padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>{acc.accountNumber}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#1f2937" }}>${acc.balance.toLocaleString()}</div>
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
