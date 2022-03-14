import Pivot from "utils/models/pivot";
import * as S from "./styles";

import WaterOnIcon from "../../../../public/icons/Com_agua.png"
import WaterOffIcon from "../../../../public/icons/Sem_agua.png"
import ErrorIcon from "../../../../public/icons/Exclamação.png"
import ClockwiseIcon from "../../../../public/icons/Sentido_horario.png"
import AntiClockwiseIcon from "../../../../public/icons/Sentido_antihorario.png"

import Image from "next/image";

type PivotProps = {
  pivot: Pivot
  connection: boolean | null
  power: boolean | null
  water: boolean | null;
  direction: "CLOCKWISE" | "ANTI_CLOCKWISE";
  percentimeter: number;
  angle: number;
  timestamp: Date;
}
const PivotStatusComponent = (pivot: PivotProps) => {


  return (
    <S.Container>

      <S.StatusWrapper>
        <S.StatusView>
          <S.StatusName>
            Sentido:
          </S.StatusName>
          <S.ImageContainer>
            <Image
              layout="responsive"
              src={(pivot.direction === "CLOCKWISE") ? ClockwiseIcon : AntiClockwiseIcon}
              alt={(pivot.direction === "CLOCKWISE") ? 'Horário' : 'Anti Horário'}
            />
          </S.ImageContainer>
        </S.StatusView>

        <S.StatusView>
          <S.StatusName>
            Água:
          </S.StatusName>
          <S.ImageContainer>

            <Image
              layout="responsive"
              src={(pivot.water === true) ? WaterOnIcon : WaterOffIcon}
              alt={(pivot.water === true) ? 'Com Água' : 'Sem Água'}
            />

          </S.ImageContainer>
        </S.StatusView>

        <S.StatusView>
          <S.StatusName>
            statusName
          </S.StatusName>
          <S.PivotCurrentPercent>
            {pivot.percentimeter == null ? "0%" : `${pivot.percentimeter}%`}
          </S.PivotCurrentPercent>
        </S.StatusView>

      </S.StatusWrapper>

      <S.LastUpdateWrapper>

        <S.StatusName>
          Última Atualização:
        </S.StatusName>

        <S.LastUpdate>
          {pivot.timestamp == null ? 'Nunca foi Atualizado' : pivot.timestamp}
        </S.LastUpdate>

      </S.LastUpdateWrapper>

    </S.Container>


  );
};

export default PivotStatusComponent;
