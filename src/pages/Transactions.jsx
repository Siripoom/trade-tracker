import React from "react";
import { Table, Button } from "antd";

const Transactions = () => {
  const dataSource = [
    { key: "1", name: "John Doe", weight: "1.5", price: "3000" },
    { key: "2", name: "Jane Smith", weight: "2.0", price: "4000" },
  ];

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Weight", dataIndex: "weight", key: "weight" },
    { title: "Price", dataIndex: "price", key: "price" },
    {
      title: "Action",
      key: "action",
      render: () => <Button type="primary">Edit</Button>,
    },
  ];

  return (
    <div>
      <Button type="primary" style={{ marginBottom: "20px" }}>
        Add Transaction
      </Button>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
};

export default Transactions;
