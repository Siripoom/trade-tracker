import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LineChartOutlined,
  FileOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation(); // ใช้ useLocation เพื่อตรวจสอบ path ปัจจุบัน
  const [isMobile, setIsMobile] = useState(false);

  const toggleMenu = () => setCollapsed(!collapsed);

  // ตรวจสอบว่า path ปัจจุบันตรงกับ path ของเมนูไหน
  const isActive = (path) => location.pathname === path;

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Mobile if width <= 768px
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Menu items
  const menuItems = [
    { path: "/", label: " Dashboard", icon: <LineChartOutlined /> },
    { path: "/reports", label: " Reports", icon: <FileOutlined /> },
    { path: "/logout", label: " Logout", icon: <LogoutOutlined /> },
  ];
  const items = [
    {
      key: "/",
      icon: <LineChartOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: "/reports",
      icon: <FileOutlined />,
      label: <Link to="/reports">Reports</Link>,
    },
    {
      key: "/logout",
      icon: <LogoutOutlined />,
      label: <Link to="/logout">Logout</Link>,
    },
  ];
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-md border-t border-gray-300 z-10">
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]} // แสดง active item ตาม path ปัจจุบัน
          className="flex justify-around items-center h-16"
          theme="light"
        >
          {items.map((item) => (
            <Menu.Item key={item.key} icon={item.icon} className="text-center">
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      </div>
    );
  }

  return (
    <div
      className={`h-screen sticky top-0 bg-white shadow-md ${
        collapsed ? "w-20" : "w-64"
      } transition-all duration-300 flex flex-col`}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
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
        {menuItems.map((item) => (
          <li
            key={item.path}
            className={`flex items-center ${
              collapsed ? "justify-center" : ""
            } rounded-md py-2 px-4 ${
              isActive(item.path)
                ? "bg-green-100 text-green-500"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {item.icon}
            <Link
              to={item.path}
              className={
                isActive(item.path) ? "text-green-500" : "text-gray-700"
              }
            >
              {!collapsed && item.label}
            </Link>
          </li>
        ))}
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
