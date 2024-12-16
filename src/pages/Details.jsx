import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Table, Modal, Form, Input, Tooltip, DatePicker } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import dayjs from "dayjs";
import "../styles/global.css";

const Details = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { zone, zoneId } = location.state || {}; // zone and zoneId from Transactions
  const { id } = useParams(); // Get the dynamic ID from the URL

  const [transactions, setTransactions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentRecord, setCurrentRecord] = useState(null);
  const [user, setUser] = useState([]);

  // Fetch transactions for the current zone from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transactions for the current zone
        const transactionSnapshot = await getDocs(
          collection(db, "transactions")
        );
        const transactionsData = transactionSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter transactions by zone ID
        const filteredTransactions = transactionsData.filter(
          (item) => item.zone === zoneId
        );
        const filteredTransactions1 = transactionsData.filter(
          (item) => item.user === id
        );
        setTransactions(filteredTransactions1);

        // Fetch user data for the associated transactions
        if (filteredTransactions.length > 0) {
          const userSnapshot = await getDocs(collection(db, "users"));
          const userData = userSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Map user data to the transaction user IDs
          const user = userData.find((user) => user.id === id);

          setUser(user || {});
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [zoneId]);
  const handleCreate = () => {
    setCurrentRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    const formattedRecord = {
      ...record,
      date: record.date ? dayjs(record.date.toDate()) : null, // แปลง date ให้เข้ากันกับ DatePicker
    };
    setCurrentRecord(record);
    form.setFieldsValue(formattedRecord);
    setIsModalVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      await deleteDoc(doc(db, "transactions", record.id));
      setTransactions((prevData) =>
        prevData.filter((item) => item.id !== record.id)
      );
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSave = async (values) => {
    try {
      const formattedValues = {
        ...values,
        date: values.date.toDate(), // Convert Ant Design DatePicker value to a JavaScript Date object
        buy: Number(values.buy), // แปลง buy เป็นตัวเลข
        weight: Number(values.weight), // แปลง weight เป็นตัวเลข
        pricePerUnit: Number(values.pricePerUnit), // แปลง pricePerUnit เป็นตัวเลข
      };

      if (currentRecord) {
        // Update logic (Firebase update is not implemented in this example)
        const updatedData = transactions.map((item) =>
          item.id === currentRecord.id ? { ...item, ...formattedValues } : item
        );
        setTransactions(updatedData);
      } else {
        // Add new transaction
        const newRecord = {
          ...formattedValues,
          user: id, // Link the record to the current user
        };
        const docRef = await addDoc(collection(db, "transactions"), newRecord);
        setTransactions((prevData) => [
          ...prevData,
          { id: docRef.id, ...newRecord },
        ]);
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "DATE",
      dataIndex: "date",
      key: "date",
      render: (text) =>
        text ? new Date(text.seconds * 1000).toLocaleDateString() : "",
    },
    {
      title: "BUY",
      dataIndex: "buy",
      key: "buy",
    },
    {
      title: "WEIGHT",
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: "ACTIONS",
      key: "actions",
      render: (_, record) => (
        <div className="ok flex space-x-2">
          <Tooltip title="Edit Record">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              className="text-orange-500 hover:text-orange-700"
            />
          </Tooltip>
          <Tooltip title="Delete Record">
            <Button
              type="link"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              className="text-red-500 hover:text-red-700"
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className=" p-6 bg-gray-50 ">
      {/* Back Button */}
      <Button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-700"
      >
        Back
      </Button>

      {/* Visualization Section */}
      <div className=" bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">
          Summary Visualization
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={transactions}>
            <XAxis dataKey="date" />
            <YAxis />
            <RechartsTooltip />
            <Bar dataKey="buy" fill="#4caf50" />
            <Bar dataKey="weight" fill="#2196f3" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* User Details */}
      <div className="ok bg-white shadow-md rounded-lg p-4 mb-6 flex flex-col items-center">
        <div className="ok w-24 h-24 rounded-full border-2 border-gray-300 flex items-center justify-center">
          <span className="text-gray-500 text-4xl">👤</span>
        </div>
        <h1 className="text-lg text-center font-bold text-gray-800 mt-4">
          {user ? (
            <>
              <div className="text-sm">Name: {user.name}</div>
              <div className="text-sm">Surname: {user.surname}</div>
              <div className="text-sm">Nickname: {user.nickname}</div>
              <div className="text-sm">Phone: {user.phone}</div>
            </>
          ) : (
            "User Not Found"
          )}
        </h1>
      </div>

      {/* Transactions Table */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="ok flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            Detailed Transactions
          </h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="bg-green-500 hover:bg-green-600 text-white mt-2 sm:mt-0"
            onClick={handleCreate}
          >
            Create
          </Button>
        </div>
        <Table
          dataSource={transactions}
          columns={columns}
          pagination={{ pageSize: 10 }}
          rowKey="id"
          className="overflow-x-auto"
        />
      </div>

      {/* Modal for Create/Edit */}
      <Modal
        title={currentRecord ? "Edit Transaction" : "Create Transaction"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select the date" }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            name="pricePerUnit"
            label="Price Per Unit"
            rules={[
              { required: true, message: "Please enter the price per unit" },
            ]}
          >
            <Input
              type="number"
              onChange={() => {
                const weight = form.getFieldValue("weight") || 0;
                const pricePerUnit = form.getFieldValue("pricePerUnit") || 0;
                form.setFieldsValue({
                  buy: pricePerUnit * weight, // คำนวณ buy ใหม่
                });
              }}
            />
          </Form.Item>

          <Form.Item
            name="weight"
            label="Weight"
            rules={[{ required: true, message: "Please enter the weight" }]}
          >
            <Input
              type="number"
              onChange={() => {
                const weight = form.getFieldValue("weight") || 0;
                const pricePerUnit = form.getFieldValue("pricePerUnit") || 0;
                form.setFieldsValue({
                  buy: pricePerUnit * weight, // คำนวณ buy ใหม่
                });
              }}
            />
          </Form.Item>

          <Form.Item
            name="buy"
            label="Buy"
            rules={[{ required: true, message: "Please enter the buy value" }]}
          >
            <Input type="number" readOnly />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Details;
