import * as S from "./styles";
import { Grid } from 'gridjs-react';
import { useContextUserData } from "hooks/useContextUserData";
import Historic from "utils/models/historic";
import { format, addHours } from 'date-fns'
import HistoricCard from "../HistoricCard";

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
          <HistoricCard historic={historic} key={index} />

        ), [])
      )}

    </S.Container>
  )
};

export default ListContainer;
