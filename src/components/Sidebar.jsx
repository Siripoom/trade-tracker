import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LineChartOutlined,
  FileOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleMenu = () => setCollapsed(!collapsed);

  return (
    <div
      className={`h-screen sticky top-0 bg-white shadow-md ${
        collapsed ? "w-20" : "w-64"
      } transition-all duration-300 flex flex-col`}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          {/* <div className="bg-green-500 text-white text-lg font-bold w-10 h-10 flex items-center justify-center rounded-full">
            S
          </div> */}
          {!collapsed && (
            <h2 className="ml-3 text-lg font-bold text-gray-800">Transition</h2>
          )}
        </div>
        <button
          onClick={toggleMenu}
          className="text-gray-800 text-lg hover:text-green-500"
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>

      {/* Menu Section */}
      <ul className="mt-6 space-y-2 flex-1">
        <li
          className={`flex items-center ${
            collapsed ? "justify-center" : ""
          } text-green-500 bg-green-100 rounded-md py-2 px-4`}
        >
          <LineChartOutlined className={`${collapsed ? "" : "mr-3"}`} />
          <Link to="/" className="text-green-500">
            {!collapsed && "Dashboard"}
          </Link>
        </li>
        <li
          className={`flex items-center ${
            collapsed ? "justify-center" : ""
          } text-gray-700 hover:bg-gray-100 rounded-md py-2 px-4`}
        >
          <FileOutlined className={`${collapsed ? "" : "mr-3"}`} />
          <Link to="/reports" className="text-gray-700">
            {!collapsed && "Reports"}
          </Link>
        </li>
        <li
          className={`flex items-center ${
            collapsed ? "justify-center" : ""
          } text-gray-700 hover:bg-gray-100 rounded-md py-2 px-4`}
        >
          <LogoutOutlined className={`${collapsed ? "" : "mr-3"}`} />
          <Link to="/" className="text-gray-700">
            {!collapsed && "Logout"}
          </Link>
        </li>
      </ul>

      {/* Footer Section */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200 text-center text-sm text-gray-500">
          © 2024 Transition
        </div>
      )}
    </div>
  );
};

export default Sidebar;
