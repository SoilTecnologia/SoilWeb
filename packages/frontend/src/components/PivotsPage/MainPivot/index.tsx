import * as S from "./styles";
import Header from "components/globalComponents/Header";
import Pivot from "utils/models/pivot";
import PivotsContainer from "../PivotCard";

type PivotListProps={
  pivotList:Pivot[]
}

const MainPivot = ({pivotList}:PivotListProps) => {
  return (
    <>
      <Header Text={'Pivôs'} />
      <S.Container>
        {pivotList.map((pivot: Pivot) => (
          <PivotsContainer key={pivot.pivot_id} pivot={pivot} />
        ))}

      </S.Container>
    </>
  );
};

export default MainPivot;
