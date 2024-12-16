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
        // ดึงข้อมูล reports
        const reportsSnapshot = await getDocs(collection(db, "reports"));
        const reportsData = reportsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // ดึงข้อมูล users และ transactions
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const transactionsSnapshot = await getDocs(
          collection(db, "transactions")
        );
        const transactionsData = transactionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // คำนวณยอดรวม BUY แต่ละ zone
        const zoneSummary = reportsData.map((report) => {
          const usersInZone = usersData.filter(
            (user) => user.zone === report.zone
          );
          const totalBuy = usersInZone.reduce((sum, user) => {
            const userTransactions = transactionsData.filter(
              (transaction) => transaction.user === user.id
            );
            const userTotal = userTransactions.reduce(
              (acc, transaction) => acc + (transaction.buy || 0),
              0
            );
            return sum + userTotal;
          }, 0);

          return {
            ...report,
            buy: totalBuy,
          };
        });

        setTableData(zoneSummary);
        setChartData(
          zoneSummary.map((item) => ({
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

  const showModal = () => setIsModalVisible(true);

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      const docRef = await addDoc(collection(db, "reports"), values);
      setTableData((prev) => [...prev, { id: docRef.id, ...values }]);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "reports", id));
      setTableData((prev) => prev.filter((item) => item.id !== id));
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleRowClick = (record) => {
    navigate("/transactions", { state: { zone: record.zone } });
  };

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
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={showModal}
          >
            Create
          </Button>
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
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Reports;
