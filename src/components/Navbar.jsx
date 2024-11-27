import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <Menu mode="horizontal" theme="dark">
      <Menu.Item key="dashboard">
        <Link to="/">Dashboard</Link>
      </Menu.Item>
      <Menu.Item key="transactions">
        <Link to="/transactions">Transactions</Link>
      </Menu.Item>
      <Menu.Item key="reports">
        <Link to="/reports">Reports</Link>
      </Menu.Item>
    </Menu>
  );
};

export default Navbar;
