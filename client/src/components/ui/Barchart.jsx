import * as React from 'react';
import {BarChart, BarPlot} from '@mui/x-charts/BarChart';
import {ChartContainer} from "@mui/x-charts/ChartContainer";
// import { dataset, valueFormatter } from '../dataset/weather';

const dataset = [
  {
    name: 'Expense',
    uv: 4000,
    pv: 2400,
    amt: 2400,
    color: '#fdb462',
  },
  {
    name: 'Income',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
];

const uData = [4000, 3000];
const xLabels = [
  'Expense',
  'Income',
];

const Barchart = ({ data }) => {
  const { expenseTransaction, incomeTransaction } = data;
  return (
    <BarChart
      series={[
        {
          data: [incomeTransaction],
          color: '#4CAF50',
        },
        {
          data: [expenseTransaction],
          color: '#757575',
        },
      ]}
      layout="horizontal"
      margin={{
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}
      leftAxis={null}
      bottomAxis={null}
    />
  );
}

export default Barchart