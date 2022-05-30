import { useState } from "react";
import * as S from "./styles";
import { Line } from 'react-chartjs-2'
import Historic from "utils/models/historic";


import OnIcon from "../../../../public/icons/Ligar.png";
import OffIcon from "../../../../public/icons/Parar.png";
import WaterOnIcon from "../../../../public/icons/Com_agua.png";
import WaterOffIcon from "../../../../public/icons/Sem_agua.png";
import ErrorIcon from "../../../../public/icons/Exclamação.png";
import ClockwiseIcon from "../../../../public/icons/Sentido_horario.png";
import AntiClockwiseIcon from "../../../../public/icons/Sentido_antihorario.png";
import Image from "next/image";

type PropsProvider = {
  historic: Historic;
};

type ChartProps = {
  labels: string[] | undefined;
  datasets: any[];
}

const HistoricCard = ({ historic }: PropsProvider) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const formatDate = (date: string) => {
    const dateString = date.replace(" ", " as ");
    return dateString;
  };

  const Chart = () => {

    // const [data, setData] = useState<ChartProps>({
    //   labels: [],
    //   datasets: [],
    // });

    const labels: any[] = []
    historic.percentimeters.map((timestamp) => { labels.push(timestamp) })
    const data = {
      labels,
      datasets: [
        {
          label: 'Percentímetro',
          data: historic.percentimeters.map((value) => value),
          borderColor: "#264653",
          backgroundColor: "#42c3b4",
        },
      ],
    };

    // let labels = [];
    // let datasets = [
    //   {
    //     label: "Percentimetro",
    //     data: [],
    //     fill: true,
    //     backgroundColor: "#42c3b4",
    //     borderColor: "#264653",
    //   },
    // ];

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Percentímetro',
        },
      },

      scales: {
        x: {
          time: {
            unit: "hour",
            displayFormats: {
              day: "dd",
              hour: "HH:mm",
              seconds: "ss",
            },
          },
          title: { display: true, text: "Data" },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          grid: {
            display: true,
            drawBorder: true,
            drawOnChange: true,
            drawTicks: true,
          },
          title: { display: true, text: "Percentímetro" },
          min: 0,
          max: 100,
        },
      },
    };


    // for (var p of historic.percentimeters) {
    //   labels.push(p.timestamp);
    //   datasets[0].data.push(p.value as never);
    // }
    // setData({
    //   labels,
    //   datasets,
    // });

    return (<Line data={data} options={options} />)

  }


  return (
    <S.Card
      onClick={() => setIsCollapsed(oldState => !oldState)}
    >
      <S.Wrapper>
        <S.Text>Inicio: {formatDate(historic.start_date)}</S.Text>

        <S.Status>
          <S.ImageContainer>
            <Image layout="responsive" src={OnIcon} alt={"Ligado"} />
          </S.ImageContainer>
          <S.ImageContainer>
            <Image
              layout="responsive"
              src={
                historic.start_state.direction == "CLOCKWISE"
                  ? ClockwiseIcon
                  : AntiClockwiseIcon
              }
              alt={
                historic.start_state.direction == "CLOCKWISE"
                  ? "Horário"
                  : "Anti Horário"
              }
            />
          </S.ImageContainer>
          <S.ImageContainer>
            <Image
              layout="responsive"
              src={historic.start_state.water ? WaterOnIcon : WaterOffIcon}
              alt={historic.start_state.water ? "Com Água" : "Sem Água"}
            />
          </S.ImageContainer>
        </S.Status>
      </S.Wrapper>

      {!historic.is_running ? (
        <S.Wrapper>
          <S.Text>Término: {formatDate(historic.end_date)}</S.Text>
          <S.Status>
            <S.ImageContainer>
              <Image layout="responsive" src={OffIcon} alt={"Desligado"} />
            </S.ImageContainer>
          </S.Status>
        </S.Wrapper>
      ) : (
        <S.Wrapper>
          <S.Text>Cíclo em andamento!</S.Text>
        </S.Wrapper>
      )}
      {isCollapsed && (
        <>


        </>
      )}
    </S.Card >
  );
};

export default HistoricCard;
