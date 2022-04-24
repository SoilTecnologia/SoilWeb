import Router from "next/router";
import Pivot from "utils/models/pivot";
import PivotStatusComponent from "../PivotStatusComponent";
import { useContextUserData } from "hooks/useContextUserData";
import * as S from "./styles";
import { setCookie } from "nookies";

interface PivotProps {
  pivot: Pivot;
}

const PivotsContainer = ({ pivot }: PivotProps) => {
  const { pivot_num } = pivot;
  const { setPivot } = useContextUserData();

  function pivotStateSelector() {
    if (pivot.connection === true) {
      if (pivot.power === true) {
        return "Ligado";
      }
      return "Desligado";
    }
  }
  const handleIntent = () => {
    const propsCookie = { maxAge: 60 * 60 * 2 };
    setCookie(undefined, "user-pivot-id", pivot.pivot_id, propsCookie);
    setPivot(pivot);
    Router.push("/intent");
  };

  return (
    <S.Container>
      <S.Box onClick={handleIntent}>
        <S.ContentData>
          <S.PivotNameWrapper>
            <S.PivotName>PIVÔ {pivot_num}</S.PivotName>
          </S.PivotNameWrapper>

          <S.PivotState>{pivotStateSelector()}</S.PivotState>

          <PivotStatusComponent pivot={pivot} />
        </S.ContentData>
      </S.Box>
    </S.Container>
  );
};

export default PivotsContainer;
