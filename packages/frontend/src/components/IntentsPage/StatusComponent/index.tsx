import * as S from "./styles";


import OnIcon from "../../../../public/icons/Ligar.png"
import OffIcon from "../../../../public/icons/Parar.png"

import WaterOnIcon from "../../../../public/icons/Com_agua.png"
import WaterOffIcon from "../../../../public/icons/Sem_agua.png"
import ErrorIcon from "../../../../public/icons/Exclamação.png"
import ClockwiseIcon from "../../../../public/icons/Sentido_horario.png"
import AntiClockwiseIcon from "../../../../public/icons/Sentido_antihorario.png"
import Image from "next/image";
import { useContextUserData } from "hooks/useContextUserData";

const StatusComponent = () => {
  const { pivot } = useContextUserData();
  return (
    pivot?.connection == true ? (
      <S.CurrentStateWrapper>

        {pivot?.power == false ? (
          <S.RowAlignment>
            <S.ImageContainer>
              <Image
                layout="responsive"
                src={OffIcon}
                alt={'Desligado'}
              />
            </S.ImageContainer>
          </S.RowAlignment>
        ) : (
          <>
            <S.RowAlignment>
              <S.ImageContainer>
                <Image
                  layout="responsive"
                  src={OnIcon}
                  alt={'Ligado'}
                />
              </S.ImageContainer>

              <S.ImageContainer>
                <Image
                  layout="responsive"
                  src={(pivot?.direction == "CLOCKWISE") ? ClockwiseIcon : AntiClockwiseIcon}
                  alt={(pivot?.direction == "CLOCKWISE") ? 'Horário' : 'Anti Horário'}
                />
              </S.ImageContainer>

              <S.ImageContainer>
                <Image
                  layout="responsive"
                  src={(pivot?.water === true) ? WaterOnIcon : WaterOffIcon}
                  alt={(pivot?.water === true) ? 'Com Água' : 'Sem Água'}
                />
              </S.ImageContainer>


            </S.RowAlignment>
            <S.Percent>
              Percentímetro: {pivot.percentimeter}%
            </S.Percent>
          </>
        )
        }



      </S.CurrentStateWrapper >
    ) : (
      <S.FailStateWrapper>

        <S.ImageContainer>
          <Image
            layout="responsive"
            src={ErrorIcon}
          />
        </S.ImageContainer>
        <S.StateText>
          Pivô sem conexão !!
        </S.StateText>


      </S.FailStateWrapper>
    )
  )
};

export default StatusComponent;
