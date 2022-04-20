import Header from "components/globalComponents/Header";
import Pivot from "utils/models/pivot";
import PivotsContainer from "../PivotContainer";
import Router from "next/router";
import * as S from "./styles";

type PivotListProps = {
  pivotList: Pivot[];
};

const MainPivot = ({ pivotList }: PivotListProps) => {
  const handleFarms = () => {
    Router.push("/farms");
  };
  const handleMap = () => {
    Router.push("/map");
  };

  return (
    <>
      <Header text={"Pivôs"} />
      <S.Container>
        <S.ButtonsView>
          <S.Button onClick={handleFarms}>
            <S.BackIcon />
            <S.Text>Voltar</S.Text>
          </S.Button>
          <S.Button onClick={handleMap}>
            <S.MapIcon />
            <S.Text>Mapa</S.Text>
          </S.Button>
        </S.ButtonsView>

        <S.Grid>
          {pivotList.map((pivot: Pivot) => (
            <PivotsContainer key={pivot.pivot_id} pivot={pivot} />
          ))}
        </S.Grid>
      </S.Container>
    </>
  );
};

export default MainPivot;
