import Header from "components/globalComponents/Header";
import { default as Router, default as router } from "next/router";
import Pivot from "utils/models/pivot";
import PivotsContainer from "../PivotCard";
import * as S from "./styles";

type PivotListProps = {
  pivotList: Pivot[];
};

const MainPivot = ({ pivotList }: PivotListProps) => {
  const handleFarms = () => {
    Router.push("/farms");
  };
  const handleMapa = () => {
    router.push("/map");
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
          <S.Button onClick={handleMapa}>
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
