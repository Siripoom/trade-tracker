import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  Dropdown,
  Menu,
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
} from "antd";
import {
  DownOutlined,
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const Reports = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  // Fetch data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reports"));
        const fetchedData = [];
        querySnapshot.forEach((doc) => {
          fetchedData.push({ id: doc.id, ...doc.data() });
        });
        setTableData(fetchedData);
        setChartData(
          fetchedData.map((item) => ({
            zone: item.zone,
            buy: item.buy,
          }))
        );
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      const docRef = await addDoc(collection(db, "reports"), values);
      const newEntry = { id: docRef.id, ...values };
      setTableData((prev) => [...prev, newEntry]); // อัปเดตข้อมูลในตาราง
      setChartData((prev) => [...prev, { zone: values.zone, buy: values.buy }]); // อัปเดตข้อมูลใน Chart
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "reports", id));
      setTableData((prev) => {
        const updatedData = prev.filter((item) => item.id !== id);
        setChartData(
          updatedData.map((item) => ({
            zone: item.zone,
            buy: item.buy,
          }))
        ); // อัปเดตข้อมูลใน Chart
        return updatedData;
      });
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleRowClick = (record) => {
    navigate("/transactions", { state: { zone: record.zone } });
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

  const columns = [
    {
      title: "ZONE",
      dataIndex: "zone",
      key: "zone",
      render: (zone, record) => (
        <Button
          type="link"
          onClick={() => handleRowClick(record)}
          className="text-blue-500 hover:text-blue-700"
        >
          {zone}
        </Button>
      ),
    },
    {
      title: "BUY",
      dataIndex: "buy",
      key: "buy",
    },
    {
      title: "ACTIONS",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this item?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" icon={<DeleteOutlined />} danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50">
      {/* Chart Section */}
      <div className="bg-white shadow-md rounded-lg mt-6 p-6">
        <h2 className="font-bold text-gray-800 mb-4">Total Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="zone" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="buy" fill="#4caf50" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-md rounded-lg mt-6 p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <select className="px-4 py-2 border rounded-md text-gray-600">
              <option>Top</option>
              <option>Bottom</option>
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
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={showModal}
            >
              Create
            </Button>
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
