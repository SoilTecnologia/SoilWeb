import * as S from "./styles";
import Router from "next/router";
import { useContextUserData } from "hooks/useContextUserData";
import Pivot from "utils/models/pivot";

type PivotProps = {
  pivot:Pivot
}
const PivotsContainer = ({pivot}: PivotProps) => {
  const { pivot_name,pivot_id } = pivot

  //const { setFarm } = useContextUserData()

  // const handlePivotsPage = () => {
  //   setFarm(farm)
  //   Router.push("/pivots",);
  // }

  return (
    <S.Container>
      <S.Box
      //onClick={handlePivotsPage}
      >
        <S.ContentData>

          <S.UserName>
            Pivo: {pivot_name}
          </S.UserName>

          <S.UserName>
            Localização:
          </S.UserName>

          <S.UserName>
            Clique aqui para acessar a fazenda
          </S.UserName>

        </S.ContentData>
      </S.Box>
    </S.Container>

  );
};



export default PivotsContainer;
