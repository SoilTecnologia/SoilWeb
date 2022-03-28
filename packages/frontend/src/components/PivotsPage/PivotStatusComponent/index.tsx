import * as S from "./styles";
import Pivot from "utils/models/pivot";
import { format } from 'date-fns'
import WaterOnIcon from "../../../../public/icons/Com_agua.png"
import WaterOffIcon from "../../../../public/icons/Sem_agua.png"
import ErrorIcon from "../../../../public/icons/Exclamação.png"
import ClockwiseIcon from "../../../../public/icons/Sentido_horario.png"
import AntiClockwiseIcon from "../../../../public/icons/Sentido_antihorario.png"

import Image from "next/image";
interface PivotProps {
  pivot: Pivot
}

const PivotStatusComponent = ({ pivot }: PivotProps) => {

  const updatedDateFormater = (timestamp: Date | undefined) => {
    if (timestamp) {
      const formatedUpdatedDate = format(new Date(timestamp), "dd / MM / yyyy' às 'kk:mm")
      return formatedUpdatedDate;
    }
    return 'Nunca foi Atualizado';
  }


  return (
    pivot.connection == true ? (

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
              Percentímetro:
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
            {updatedDateFormater(pivot.timestamp)}
          </S.LastUpdate>

        </S.LastUpdateWrapper>

      </S.Container>

    ) : (

      <S.Container>
        <S.StatusWrapper>
          <S.StatusView>

            <S.StatusName>
              PIVÔ SEM CONEXÃO
            </S.StatusName>
            <S.ImageContainer>
              <Image
                layout="responsive"
                src={ErrorIcon}
              />
            </S.ImageContainer>

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
    )

  )
};

export default PivotStatusComponent;
