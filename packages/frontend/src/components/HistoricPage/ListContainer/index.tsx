import * as S from "./styles";
import { Grid } from 'gridjs-react';
import { useContextUserData } from "hooks/useContextUserData";
import Historic from "utils/models/historic";
import { format, addHours } from 'date-fns'

type PropsProvider = {
  currentHistorics: Historic[],
}

const ListContainer = ({ currentHistorics }: PropsProvider) => {
  const { historic } = useContextUserData()

  const formatDate = (date: Date) => {
    const formatedDate = format(addHours(new Date(date), 3), `dd/MM/yyy`) + ' às ' + format(addHours(new Date(date), 3), ` hh:mm`)
    return formatedDate
  }

  return (
    <S.Container>
      {historic && (
        currentHistorics.map((historic, index) => (
          <S.HistoricList key={index}>
            <S.Wrapper>
              <S.Text>Inicio: {formatDate(historic.start_date)}</S.Text>

              <S.InitialStatus>
              </S.InitialStatus>

            </S.Wrapper>
            {!historic.is_running && (
              <S.Wrapper>
                <S.Text>Término:{formatDate(historic.end_date)}</S.Text>
                <S.StopIcon />
              </S.Wrapper>
            )}

          </S.HistoricList>
        ), [])
      )}

    </S.Container>
  )
};

export default ListContainer;
