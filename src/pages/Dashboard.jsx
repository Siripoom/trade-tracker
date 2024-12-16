import { useState, useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Dashboard = () => {
  const [totalSales, setTotalSales] = useState(0); // ค่า Total Sales
  const [totalBuy, setTotalBuy] = useState(0); // ผลรวม Buy
  const [profit, setProfit] = useState(0); // คำนวณ Profit %
  const [quality, setQuality] = useState(0); // ค่า Quality
  const [chartData, setChartData] = useState([]); // ข้อมูล Chart
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [form] = Form.useForm();

  // Fetch transactions data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "transactions"));
        const transactions = querySnapshot.docs.map((doc) => doc.data());

        // คำนวณผลรวมของ Buy
        const totalBuyValue = transactions.reduce(
          (sum, item) => sum + (item.buy || 0),
          0
        );
        setTotalBuy(totalBuyValue);

        // จัดข้อมูลสำหรับ Chart (แยกตามเดือน)
        const monthlyData = {};
        transactions.forEach((item) => {
          const month = new Date(item.date.seconds * 1000).toLocaleString(
            "default",
            { month: "long" }
          );
          if (!monthlyData[month]) {
            monthlyData[month] = { month, buy: 0, weight: 0 };
          }
          monthlyData[month].buy += item.buy || 0;
          monthlyData[month].weight += item.weight || 0;
        });

        setChartData(Object.values(monthlyData));

        // คำนวณ Profit % ใหม่
        setProfit(
          totalSales ? ((totalSales - totalBuyValue) / totalSales) * 100 : 0
        );
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchData();
  }, [totalSales]); // รันใหม่เมื่อ totalSales เปลี่ยนแปลง

  const showModal = (field) => {
    setEditingField(field);
    form.setFieldsValue({
      value: field === "totalSales" ? totalSales : quality,
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSave = (values) => {
    if (editingField === "totalSales") {
      setTotalSales(Number(values.value));
    } else if (editingField === "quality") {
      setQuality(Number(values.value));
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div className="p-6 bg-gray-50">
      {/* Summary Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold text-gray-800">Monthly Sales</h1>
        <button className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100">
          This Month
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div
          className="bg-red-100 text-red-600 p-4 rounded-lg shadow-sm cursor-pointer"
          onClick={() => showModal("totalSales")}
        >
          <p className="font-bold text-lg">${totalSales.toLocaleString()}</p>
          <p>Total Sales</p>
        </div>
        <div className="bg-yellow-100 text-yellow-600 p-4 rounded-lg shadow-sm">
          <p className="font-bold text-lg">${totalBuy.toLocaleString()}</p>
          <p>Total Buy</p>
        </div>
        <div className="bg-green-100 text-green-600 p-4 rounded-lg shadow-sm">
          <p className="font-bold text-lg">{profit.toFixed(2)}%</p>
          <p>Profit %</p>
        </div>
        <div
          className="bg-purple-100 text-purple-600 p-4 rounded-lg shadow-sm cursor-pointer"
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
        <h2 className="font-bold text-gray-800 mb-4">
          Total Weight & Buy by Month
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="buy" fill="#4caf50" name="Total Buy" />
            <Bar dataKey="weight" fill="#2196f3" name="Total Weight" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
