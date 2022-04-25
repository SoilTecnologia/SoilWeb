import Historic from "utils/models/historic";
import * as S from "./styles";
import { format, addHours } from "date-fns";
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

const HistoricCard = ({ historic }: PropsProvider) => {
  const formatDate = (date: string) => {
    const dateString = date.replace(" ", " as ");
    return dateString;
  };

  return (
    <S.Card>
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
    </S.Card>
  );
};

export default HistoricCard;
