import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Table, Dropdown, Menu, Button, Modal, Form, Input } from "antd";
import { DownOutlined, SearchOutlined, PlusOutlined } from "@ant-design/icons";

const data = [
  { day: "Monday", buy: 10, sell: 20 },
  { day: "Tuesday", buy: 15, sell: 25 },
  { day: "Wednesday", buy: 20, sell: 30 },
  { day: "Thursday", buy: 18, sell: 28 },
  { day: "Friday", buy: 22, sell: 32 },
  { day: "Saturday", buy: 25, sell: 35 },
  { day: "Sunday", buy: 30, sell: 40 },
];

const tableData = [
  { id: 59217, name: "A", buy: 50000, sell: 80000 },
  { id: 59213, name: "B", buy: 65000, sell: 60000 },
  { id: 59219, name: "C", buy: 65000, sell: 85000 },
];

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "NAME",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "BUY",
    dataIndex: "buy",
    key: "buy",
  },
  {
    title: "SELL",
    dataIndex: "sell",
    key: "sell",
  },
];

const Reports = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    console.log("Form Values:", values);
    setIsModalVisible(false);
    form.resetFields();
  };

  const dropdownMenu = (
    <Menu>
      <Menu.Item key="1">
        <a href="#">Buy</a>
      </Menu.Item>
      <Menu.Item key="2">
        <a href="#">Sell</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="p-6 bg-gray-50">
      {/* Chart Section */}
      <div className="bg-white shadow-md rounded-lg mt-6 p-6">
        <h2 className="font-bold text-gray-800 mb-4">Total Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="buy" fill="#4caf50" />
            <Bar dataKey="sell" fill="#2196f3" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-md rounded-lg mt-6 p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <select className="px-4 py-2 border rounded-md text-gray-600">
              <option>User name</option>
            </select>
            <div className="flex items-center border rounded-md px-4 py-2">
              <SearchOutlined className="text-gray-600" />
              <input
                type="text"
                placeholder="Search"
                className="outline-none ml-2"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            {/* Create Button */}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={showModal}
            >
              Create
            </Button>

            {/* Dropdown Button */}
            <Dropdown overlay={dropdownMenu}>
              <Button>
                Actions <DownOutlined />
              </Button>
            </Dropdown>
          </div>
        </div>
        <Table
          dataSource={tableData}
          columns={columns}
          pagination={{ pageSize: 10 }}
          rowKey="id"
        />
      </div>

      {/* Modal Section */}
      <Modal
        title="Create New Entry"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item
            name="zone"
            label="Zone"
            rules={[{ required: true, message: "Please enter a zone" }]}
          >
            <Input placeholder="Enter zone" />
          </Form.Item>
          <Form.Item
            name="buy"
            label="Buy"
            rules={[{ required: true, message: "Please enter a buy value" }]}
          >
            <Input placeholder="Enter buy value" type="number" />
          </Form.Item>
          <Form.Item
            name="weight"
            label="Weight"
            rules={[{ required: true, message: "Please enter weight" }]}
          >
            <Input placeholder="Enter weight" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-black text-white"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Reports;
