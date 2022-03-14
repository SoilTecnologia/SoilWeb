import * as S from "./styles";
import Router from "next/router";
import Pivot from "utils/models/pivot";
import PivotStatusComponent from "../PivotStatusComponent";


type PivotProps = {
  pivot: Pivot
  pop:number
}
const PivotsContainer = ({ pivot,pop }: PivotProps) => {
  const { pivot_name, pivot_id } = pivot

  function pivotStateSelector() {
    if (pivot.power === true) {
      return 'Ligado'
    }
    return "Delisgado"
  }

  return (
    <S.Container>
      <S.Box>
        <S.ContentData>

          <S.PivotNameWrapper>
            <S.PivotName>
              PIVÔ {pop}
            </S.PivotName>
          </S.PivotNameWrapper>

          <S.PivotState>
            {pivotStateSelector()}
          </S.PivotState>

          <PivotStatusComponent pivot={pivot} />

        </S.ContentData>
      </S.Box>
    </S.Container>

  );
};



export default PivotsContainer;
