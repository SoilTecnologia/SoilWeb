import Header from "components/globalComponents/Header";
import Pivot from "utils/models/pivot";
import PivotsContainer from "../PivotContainer";
import Router from "next/router";
import * as S from "./styles";

type PivotListProps = {
  pivotList: Pivot[];
};

const MainPivot = ({ pivotList }: PivotListProps) => {


  return (
    <>
      <Header text={"Pivôs"} />
      <S.Container>
        <S.ButtonsView>
          <S.Button href='/farms'>
            <S.AnchorButton>

              <S.BackIcon />
              <S.Text>Voltar</S.Text>

            </S.AnchorButton>

          </S.Button>

          <S.Button href='/map'>
            <S.AnchorButton>
              <S.MapIcon />
              <S.Text>Mapa</S.Text>
            </S.AnchorButton>
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
