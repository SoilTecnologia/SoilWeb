import Image from "next/image";
import Pivot from "utils/models/pivot";
import WaterOnIcon from "../../../../public/icons/Com_agua.png";
import ErrorIcon from "../../../../public/icons/Exclamação.png";
import WaterOffIcon from "../../../../public/icons/Sem_agua.png";
import AntiClockwiseIcon from "../../../../public/icons/Sentido_antihorario.png";
import ClockwiseIcon from "../../../../public/icons/Sentido_horario.png";
import * as S from "./styles";

interface PivotProps {
  pivot: Pivot;
}

const PivotStatusComponent = ({ pivot }: PivotProps) => {
  return pivot.connection == true ? ( // trocar != para  ==
    <S.Container>
      <S.StatusWrapper>
        <S.StatusView>
          <S.StatusName>Sentido:</S.StatusName>
          <S.ImageContainer>
            <Image
              layout="responsive"
              src={
                pivot.direction === "CLOCKWISE"
                  ? ClockwiseIcon
                  : AntiClockwiseIcon
              }
              alt={pivot.direction === "CLOCKWISE" ? "Horário" : "Anti Horário"}
            />
          </S.ImageContainer>
        </S.StatusView>

        <S.StatusView>
          <S.StatusName>Água:</S.StatusName>
          <S.ImageContainer>
            <Image
              layout="responsive"
              src={pivot.water === true ? WaterOnIcon : WaterOffIcon}
              alt={pivot.water === true ? "Com Água" : "Sem Água"}
            />
          </S.ImageContainer>
        </S.StatusView>

        <S.StatusView>
          <S.StatusName>statusName</S.StatusName>
          <S.PivotCurrentPercent>
            {pivot.percentimeter == null ? "0%" : `${pivot.percentimeter}%`}
          </S.PivotCurrentPercent>
        </S.StatusView>
      </S.StatusWrapper>

      <S.LastUpdateWrapper>
        <S.StatusName>Última Atualização:</S.StatusName>

        <S.LastUpdate>
          {pivot.timestamp == null ? "Nunca foi Atualizado" : pivot.timestamp}
        </S.LastUpdate>
      </S.LastUpdateWrapper>
    </S.Container>
  ) : (
    <S.Container>
      <S.StatusWrapper>
        <S.StatusView>
          <S.StatusName>PIVÔ SEM CONEXÃO</S.StatusName>
          <S.ImageContainer>
            <Image layout="responsive" src={ErrorIcon} />
          </S.ImageContainer>
        </S.StatusView>
      </S.StatusWrapper>
      <S.LastUpdateWrapper>
        <S.StatusName>Última Atualização:</S.StatusName>

        <S.LastUpdate>
          {pivot.timestamp == null ? "Nunca foi Atualizado" : pivot.timestamp}
        </S.LastUpdate>
      </S.LastUpdateWrapper>
    </S.Container>
  );
};

export default PivotStatusComponent;
