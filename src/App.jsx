import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";

const { Header, Content } = Layout;

const App = () => {
  return (
    <Router>
      <Layout>
        <Header>
          <Navbar />
        </Header>
        <Content style={{ padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </Content>
        {/* <Footer /> */}
      </Layout>
    </Router>
  );
};

export default App;
