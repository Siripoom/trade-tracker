import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Modal, Form, Input, Button } from "antd";
import { useState } from "react";
const data = [
  { month: "January", buy: 100, sell: 200 },
  { month: "February", buy: 150, sell: 250 },
  { month: "March", buy: 200, sell: 300 },
  { month: "April", buy: 180, sell: 280 },
  { month: "May", buy: 220, sell: 320 },
  { month: "June", buy: 250, sell: 350 },
  { month: "July", buy: 300, sell: 400 },
  { month: "August", buy: 280, sell: 380 },
  { month: "September", buy: 320, sell: 420 },
  { month: "October", buy: 350, sell: 450 },
  { month: "November", buy: 400, sell: 500 },
  { month: "December", buy: 450, sell: 550 },
];

const Dashboard = () => {
  const [totalSales, setTotalSales] = useState(12000); // ค่า Total Sales
  const [quality, setQuality] = useState(98.9); // ค่า Quality
  const [isModalVisible, setIsModalVisible] = useState(false); // สถานะของ modal
  const [editingField, setEditingField] = useState(null); // กำลังแก้ไขช่องไหน
  const [form] = Form.useForm();
  // ฟังก์ชันเปิด modal
  const showModal = (field) => {
    setEditingField(field);
    form.setFieldsValue({
      value: field === "totalSales" ? totalSales : quality,
    });
    setIsModalVisible(true);
  };

  // ฟังก์ชันปิด modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // ฟังก์ชันบันทึกข้อมูล
  const handleSave = (values) => {
    if (editingField === "totalSales") {
      setTotalSales(values.value);
    } else if (editingField === "quality") {
      setQuality(values.value);
    }
    setIsModalVisible(false);
    form.resetFields();
  };
  return (
    <div className="p-6 bg-gray-50">
      {/* Summary Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold text-gray-800">Monthly Sales</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100">
            This Month
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            Export
          </button>
        </div>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div
          className="bg-red-100 text-red-600 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => showModal("totalSales")}
        >
          <p className="font-bold text-lg">${totalSales.toLocaleString()}</p>
          <p>Total Sales</p>
        </div>
        <div className="bg-yellow-100 text-yellow-600 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <p className="font-bold text-lg">3,000</p>
          <p>Total Buy</p>
        </div>
        <div className="bg-green-100 text-green-600 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <p className="font-bold text-lg">12%</p>
          <p>Profit %</p>
        </div>
        <div
          className="bg-purple-100 text-purple-600 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => showModal("quality")}
        >
          <p className="font-bold text-lg">{quality}%</p>
          <p>Quality</p>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title={`Edit ${
          editingField === "totalSales" ? "Total Sales" : "Quality"
        }`}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleSave}>
          <Form.Item
            name="value"
            rules={[
              { required: true, message: "Please enter a value" },
              {
                type: "number",
                message: "Value must be a number",
                transform: (v) => +v,
              },
            ]}
          >
            <Input type="number" placeholder="Enter new value" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* Chart Section */}
      <div className="bg-white shadow-md rounded-lg mt-6 p-6">
        <h2 className="font-bold text-gray-800 mb-4">Total Revenue by Month</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="buy" fill="#4caf50" />
            <Bar dataKey="sell" fill="#2196f3" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
