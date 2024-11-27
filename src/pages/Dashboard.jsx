import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Monday", buy: 10, sell: 20 },
  { day: "Tuesday", buy: 15, sell: 25 },
  { day: "Wednesday", buy: 20, sell: 30 },
  { day: "Thursday", buy: 18, sell: 28 },
  { day: "Friday", buy: 22, sell: 32 },
  { day: "Saturday", buy: 25, sell: 35 },
  { day: "Sunday", buy: 30, sell: 40 },
];

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-50">
      {/* Summary Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold text-gray-800">Today's Sales</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100">
            Today
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-red-100 text-red-600 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <p className="font-bold text-lg">$1k</p>
          <p>Total Sales</p>
        </div>
        <div className="bg-yellow-100 text-yellow-600 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <p className="font-bold text-lg">300</p>
          <p>Total Buy</p>
        </div>
        <div className="bg-green-100 text-green-600 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <p className="font-bold text-lg">5</p>
          <p>Buyer</p>
        </div>
        <div className="bg-purple-100 text-purple-600 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <p className="font-bold text-lg">8</p>
          <p>Seller</p>
        </div>
      </div>

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
    </div>
  );
};

export default Dashboard;
