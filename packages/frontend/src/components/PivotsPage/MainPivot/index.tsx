import * as S from "./styles";
import Header from "components/globalComponents/Header";
import Pivot from "utils/models/pivot";
import PivotsContainer from "../PivotCard";
import Router from "next/router";

type PivotListProps = {
  pivotList: Pivot[]
}

const MainPivot = ({ pivotList }: PivotListProps) => {

  const handleFarms = () => {
    Router.push("/farms");
  }

  return (
    <>
      <Header text={'Pivôs'} />
      <S.Container>

        <S.ButtonsView>
          <S.Button onClick={handleFarms}>
            <S.BackIcon />
            <S.Text>
              Voltar
            </S.Text>
          </S.Button>
          <S.Button>

            <S.Text>
              Mapa
            </S.Text>
          </S.Button>
        </S.ButtonsView>

        <S.Grid>
          {pivotList.map((pivot: Pivot) => (

            <>
              <PivotsContainer key={pivot.pivot_id} pivot={pivot} pop={1} />

            </>

          ))}
        </S.Grid>


      </S.Container>
    </>
  );
};

export default MainPivot;
