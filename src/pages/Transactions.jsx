import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Table, Input, Select, Button, Modal, Form, Tooltip } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebaseConfig"; // Import Firebase configuration

const { Option } = Select;

const Transactions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { zone } = location.state || {};

  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form] = Form.useForm();

  // Fetch data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const zoneFilteredData = zone
          ? data.filter((item) => item.zone === zone)
          : data;
        setFilteredData(zoneFilteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [zone]);

  const handleSearch = (value) => {
    if (!value) {
      // ถ้าไม่มีค่าค้นหา ให้แสดงข้อมูลทั้งหมด
      const fetchData = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "users"));
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          const zoneFilteredData = zone
            ? data.filter((item) => item.zone === zone)
            : data;
          setFilteredData(zoneFilteredData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
      return;
    }

    // ฟิลเตอร์ข้อมูลตามค่าค้นหา
    const filtered = filteredData.filter(
      (item) =>
        (item.name && item.name.toLowerCase().includes(value.toLowerCase())) || // ค้นหาจากชื่อ
        (item.nickname &&
          item.nickname.toLowerCase().includes(value.toLowerCase())) || // ค้นหาจากชื่อเล่น
        (item.id && `${item.id}`.includes(value)) // ค้นหาจาก ID
    );
    setFilteredData(filtered);
  };

  const handleCreate = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const navigateToDetails = (record) => {
    navigate(`/details/${record.id}`, { state: record });
  };

  const handleEdit = (record) => {
    setCurrentRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSave = async (values) => {
    try {
      if (currentRecord) {
        // Handle editing (Firebase update is not shown here)
        const updatedData = filteredData.map((item) =>
          item.id === currentRecord.id ? { ...item, ...values } : item
        );
        setFilteredData(updatedData);
      } else {
        // Add new record to Firebase
        const docRef = await addDoc(collection(db, "users"), {
          ...values,
          zone,
        });
        const newRecord = { id: docRef.id, ...values, zone };
        setFilteredData((prevData) => [...prevData, newRecord]);
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleDelete = async (record) => {
    try {
      await deleteDoc(doc(db, "users", record.id));
      setFilteredData((prevData) =>
        prevData.filter((item) => item.id !== record.id)
      );
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "NICKNAME",
      dataIndex: "nickname",
      key: "nickname",
    },
    {
      title: "FULLNAME",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "PHONE",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "ACTIONS",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Tooltip title="View Details">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => navigateToDetails(record)}
              className="text-blue-500 hover:text-blue-700"
            >
              View
            </Button>
          </Tooltip>
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
      <h1 className="text-lg font-bold text-gray-800 mb-4">
        Transactions in Zone: {zone || "All Zones"}
      </h1>

      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2 items-center">
          <Input
            placeholder="Search by Name or Nickname"
            prefix={<SearchOutlined />}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              handleSearch(e.target.value);
            }}
            className="w-60"
          />
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={handleCreate}
        >
          Create
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 10 }}
          rowKey="id"
        />
      </div>

      <Modal
        title={currentRecord ? "Edit Record" : "Create New Record"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="name"
            label="ชื่อ"
            rules={[{ required: true, message: "กรุณากรอกชื่อ" }]}
          >
            <Input placeholder="กรอกชื่อ" />
          </Form.Item>
          <Form.Item
            name="surname"
            label="นามสกุล"
            rules={[{ required: true, message: "กรุณากรอกนามสกุล" }]}
          >
            <Input placeholder="กรอกนามสกุล" />
          </Form.Item>
          <Form.Item
            name="nickname"
            label="ชื่อเล่น"
            rules={[{ required: true, message: "กรุณากรอกชื่อเล่น" }]}
          >
            <Input placeholder="กรอกชื่อเล่น" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="เบอร์โทร"
            rules={[{ required: true, message: "กรุณากรอกเบอร์โทร" }]}
          >
            <Input placeholder="กรอกเบอร์โทร" />
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

export default Transactions;
