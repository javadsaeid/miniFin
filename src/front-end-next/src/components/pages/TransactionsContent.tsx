"use client";

import { useEffect, useState, useMemo } from "react";
import { Select, Table, Tag, message, Row, Col, Button, Modal, Descriptions, DatePicker, Space } from "antd";
import { EyeOutlined, DownloadOutlined, FilterOutlined } from "@ant-design/icons";
import { apiService } from "@/services/api";
import AuthGuard from "@/components/AuthGuard";
import { useTranslation } from "@/i18n/context";
import dayjs from "dayjs";

const { Option } = Select;

interface Account { id: number; accountNumber: string; balance: number; currency: string; }
interface Transaction { id: number; amount: number; transactionType: string; transactionDateTime: string; description: string; status: string; sourceAccount: string; destinationAccount: string; }

const statusColor: Record<string, string> = { SUCCESS: "green", FAILED: "red", PENDING: "orange" };
const txTypeColor: Record<string, string> = { DEPOSIT: "green", WITHDRAW: "orange", TRANSFER: "blue" };

export default function TransactionsContent() {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filters
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [filterDateRange, setFilterDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // Detail modal
  const [detailTx, setDetailTx] = useState<Transaction | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    apiService.getMyAccounts()
      .then((res) => setAccounts(res.data.data || []))
      .catch(() => message.error("Failed to load accounts"))
      .finally(() => setFetching(false));
  }, []);

  const handleAccountChange = async (accountNumber: string) => {
    setSelectedAccount(accountNumber);
    setLoading(true);
    setPage(1);
    try {
      const res = await apiService.getTransactions(accountNumber, 0, 200);
      setTransactions(res.data.data || []);
    } catch {
      message.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = useMemo(() => {
    let result = transactions;
    if (filterType) result = result.filter(tx => tx.transactionType === filterType);
    if (filterStatus) result = result.filter(tx => tx.status === filterStatus);
    if (filterDateRange && filterDateRange[0] && filterDateRange[1]) {
      const start = filterDateRange[0].startOf("day");
      const end = filterDateRange[1].endOf("day");
      result = result.filter(tx => {
        const d = dayjs(tx.transactionDateTime);
        return d.isAfter(start) && d.isBefore(end);
      });
    }
    return result;
  }, [transactions, filterType, filterStatus, filterDateRange]);

  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, page, pageSize]);

  const handleShowDetail = (tx: Transaction) => {
    setDetailTx(tx);
  };

  const handleExportCsv = () => {
    if (filteredTransactions.length === 0) {
      message.warning(t("common.noData"));
      return;
    }
    const headers = ["ID", t("transactions.type"), t("transactions.amount"), t("transactions.status"), t("transactions.description"), t("transactions.from"), t("transactions.to"), t("transactions.date")];
    const rows = filteredTransactions.map(tx => [
      tx.id,
      tx.transactionType,
      tx.amount,
      tx.status,
      `"${(tx.description || "").replace(/"/g, '""')}"`,
      tx.sourceAccount,
      tx.destinationAccount,
      tx.transactionDateTime?.split("T")[0],
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transactions-${selectedAccount}-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const totalAmount = filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const successCount = filteredTransactions.filter((tx) => tx.status === "SUCCESS").length;

  const columns = [
    {
      title: t("transactions.type"),
      dataIndex: "transactionType",
      key: "transactionType",
      render: (type: string) => <Tag color={txTypeColor[type]}>{type}</Tag>,
    },
    {
      title: t("transactions.amount"),
      dataIndex: "amount",
      key: "amount",
      render: (v: number) => <span style={{ fontWeight: 600 }}>${v.toLocaleString()}</span>,
    },
    {
      title: t("transactions.status"),
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color={statusColor[status] || "default"}>{status}</Tag>,
    },
    { title: t("transactions.description"), dataIndex: "description", key: "description" },
    { title: t("transactions.from"), dataIndex: "sourceAccount", key: "sourceAccount" },
    { title: t("transactions.to"), dataIndex: "destinationAccount", key: "destinationAccount" },
    { title: t("transactions.date"), dataIndex: "transactionDateTime", key: "transactionDateTime", render: (v: string) => v?.split("T")[0] },
    {
      title: "",
      key: "detail",
      width: 48,
      render: (_: any, record: Transaction) => (
        <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => handleShowDetail(record)} />
      ),
    },
  ];

  return (
    <AuthGuard>
      <div className="page-header">
        <h1>{t("transactions.title")}</h1>
        <p>{t("transactions.subtitle")}</p>
      </div>

      <div className="card-elevated" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#6b7280", marginBottom: 8 }}>{t("transactions.selectAccount")}</div>
            <Select placeholder={t("transactions.selectPlaceholder")} style={{ width: "100%" }} onChange={handleAccountChange} loading={fetching} notFoundContent={t("transactions.noData")} size="large">
              {accounts.map((acc) => (
                <Option key={acc.accountNumber} value={acc.accountNumber}>{acc.accountNumber} ({acc.currency})</Option>
              ))}
            </Select>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", paddingTop: 22 }}>
            <Select placeholder={t("filters.allTypes")} style={{ width: 150 }} allowClear value={filterType} onChange={setFilterType}>
              <Option value="DEPOSIT">DEPOSIT</Option>
              <Option value="WITHDRAW">WITHDRAW</Option>
              <Option value="TRANSFER">TRANSFER</Option>
            </Select>
            <Select placeholder={t("filters.allStatuses")} style={{ width: 150 }} allowClear value={filterStatus} onChange={setFilterStatus}>
              <Option value="SUCCESS">SUCCESS</Option>
              <Option value="FAILED">FAILED</Option>
              <Option value="PENDING">PENDING</Option>
            </Select>
            <DatePicker.RangePicker value={filterDateRange as any} onChange={(dates) => setFilterDateRange(dates as any)} />
            {(filterType || filterStatus || filterDateRange) && (
              <Button size="small" onClick={() => { setFilterType(undefined); setFilterStatus(undefined); setFilterDateRange(null); }}>
                {t("common.resetFilters")}
              </Button>
            )}
          </div>
          {selectedAccount && (
            <div style={{ paddingTop: 22 }}>
              <Button icon={<DownloadOutlined />} onClick={handleExportCsv}>
                {t("common.exportCsv")}
              </Button>
            </div>
          )}
        </div>
      </div>

      {transactions.length > 0 && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={8}><div className="stat-card"><div className="stat-card-value">{filteredTransactions.length}</div><div className="stat-card-label">{t("transactions.totalTransactions")}</div></div></Col>
          <Col xs={8}><div className="stat-card"><div className="stat-card-value">${totalAmount.toLocaleString()}</div><div className="stat-card-label">{t("transactions.totalAmount")}</div></div></Col>
          <Col xs={8}><div className="stat-card"><div className="stat-card-value">{successCount}</div><div className="stat-card-label">{t("transactions.successful")}</div></div></Col>
        </Row>
      )}

      <div className="card-elevated" style={{ overflow: "hidden" }}>
        <Table
          columns={columns}
          dataSource={paginatedTransactions}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: filteredTransactions.length,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
            showTotal: (total, range) => t("common.page", { current: range[0] + "-" + range[1], total }),
            onChange: (p, ps) => { setPage(p); setPageSize(ps); },
          }}
          locale={{ emptyText: t("transactions.noData") }}
        />
      </div>

      <Modal
        title={t("transactionDetail.title")}
        open={!!detailTx}
        onCancel={() => setDetailTx(null)}
        footer={null}
        width={600}
      >
        {detailTx && (
          <Descriptions column={2} bordered size="small" style={{ marginTop: 16 }}>
            <Descriptions.Item label={t("transactionDetail.id")}>{detailTx.id}</Descriptions.Item>
            <Descriptions.Item label={t("transactionDetail.type")}><Tag color={txTypeColor[detailTx.transactionType]}>{detailTx.transactionType}</Tag></Descriptions.Item>
            <Descriptions.Item label={t("transactionDetail.amount")}><span style={{ fontWeight: 700 }}>${detailTx.amount.toLocaleString()}</span></Descriptions.Item>
            <Descriptions.Item label={t("transactionDetail.status")}><Tag color={statusColor[detailTx.status]}>{detailTx.status}</Tag></Descriptions.Item>
            <Descriptions.Item label={t("transactionDetail.sourceAccount")}>{detailTx.sourceAccount}</Descriptions.Item>
            <Descriptions.Item label={t("transactionDetail.destAccount")}>{detailTx.destinationAccount}</Descriptions.Item>
            <Descriptions.Item label={t("transactionDetail.description")} span={2}>{detailTx.description || "—"}</Descriptions.Item>
            <Descriptions.Item label={t("transactionDetail.date")} span={2}>{detailTx.transactionDateTime}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </AuthGuard>
  );
}
