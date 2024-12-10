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
          const user = userData.find(
            (user) => user.id === filteredTransactions[0].user
          );

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
  //! แยกข้อมูลระหว่าง user และ zone
  //! responsive mobile vertical
  const handleCreate = () => {
    setCurrentRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setCurrentRecord(record);
    form.setFieldsValue(record);
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
        // zone: zoneId, // Attach the current zone ID
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
          user: user.id, // Link the record to the current user
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
        <div className="flex space-x-2">
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
    <div className="p-6 bg-gray-50">
      {/* Back Button */}
      <Button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-700"
      >
        Back
      </Button>

      {/* Visualization Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
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
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full border-2 border-gray-300 mx-auto mb-4 flex items-center justify-center">
            <span className="text-gray-500 text-4xl">👤</span>
          </div>
          <h1 className="text-lg font-bold text-gray-800">
            {user ? (
              <>
                <div>Name: {user.name}</div>
                <div>Surname: {user.surname}</div>
                <div>Nickname: {user.nickname}</div>
                <div>Phone: {user.phone}</div>
              </>
            ) : (
              "User Not Found"
            )}
          </h1>
        </div>
      </div>
      {/* Transactions Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            Detailed Transactions
          </h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="bg-green-500 hover:bg-green-600 text-white"
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
            name="buy"
            label="Buy"
            rules={[{ required: true, message: "Please enter the buy value" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="weight"
            label="Weight"
            rules={[{ required: true, message: "Please enter the weight" }]}
          >
            <Input type="number" />
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
