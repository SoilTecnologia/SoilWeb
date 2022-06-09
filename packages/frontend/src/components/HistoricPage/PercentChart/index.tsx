import theme from "styles/theme";
import Historic from "utils/models/historic";
import * as S from "./styles";
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type PropsProvider = {
  historic: Historic;
};

const PercentChart = ({ historic }: PropsProvider) => {


  const labels: any[] = []
  historic.percentimeters.map((percent) => { labels.push(percent.timestamp) })

  const data = {
    labels,
    datasets: [
      {
        label: 'Percentímetro',
        data: historic.percentimeters.map((percent) => percent.value),
        borderColor: theme.colors.wet,
        backgroundColor: "#005ac2",
        pointRadius: 5,
        pointHoverRadius: 6,
        clip: 6,
      },
    ],
  };


  const options = {
    responsive: true,

    plugins: {
      legend: {
        labels: {
          color: theme.colors.secondary
        }
      },
    },

    scales: {
      x: {
        display:false,
        time: {
          unit: "hour",
          displayFormats: {
            day: "dd",
            hour: "HH:mm",
            seconds: "ss",
          },
        },
        title: {
          display: false,
          text: "Horário",
          color: theme.colors.secondary
        },
        grid: {
          display: false,
        },
        ticks: {
          color: theme.colors.secondary,
        },

      },

      y: {
        grid: {
          display: true,
          drawBorder: true,
          drawOnChange: true,
          drawTicks: true,
        },
        title: {
          display: true,
          text: "Percentímetro",
          color: theme.colors.secondary,

        },

        ticks: {
          color: theme.colors.secondary,
        },
        min: 0,
        max: 100,
      },

    },
  };



  return (
    <S.PercentChartContainer>
      <Line data={data} options={options} />
    </S.PercentChartContainer>
  )
};

export default PercentChart;
