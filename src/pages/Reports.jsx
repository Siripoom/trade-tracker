import React from "react";
import { Button } from "antd";

const Reports = () => {
  return (
    <div>
      <h1>Reports</h1>
      <p>Export your transaction reports here.</p>
      <Button type="primary">Export PDF</Button>
      <Button style={{ marginLeft: "10px" }}>Export Excel</Button>
    </div>
  );
};

export default Reports;
