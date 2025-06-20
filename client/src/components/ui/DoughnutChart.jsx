import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);


const DoughnutChart = ({ banks }) => {
  const bankNames = banks?.map(bank => bank.bank_name);
  const bankBalance = banks?.map(bank => bank.balance);


  const data = {
    datasets: [
      {
        label: 'Banks',
        data: bankBalance,
        backgroundColor: ['#0747b6', '#2265d8', '#2f91fa']
      }
    ],
    labels: bankNames
  }

  return (
    <>
      <Doughnut
        data={data}
        options={{
          cutout: '60%',
          plugins: {
            legend: {
              display: false
            }
          }
        }}
      />
    </>
  )
}
export default DoughnutChart;