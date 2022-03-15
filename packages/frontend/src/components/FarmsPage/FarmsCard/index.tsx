import * as S from "./styles";
import Router from "next/router";
import { useContextUserData } from "hooks/useContextUserData";
import Farm from "utils/models/farm";
interface FarmProps {
  farm: Farm
}
const FarmsContainer = ({ farm }: FarmProps) => {
  const { farm_city, farm_name } = farm
  const { setFarm } = useContextUserData()

  const handlePivotsPage = () => {
    setFarm(farm)
    Router.push("/pivots");
  }

  return (
    <S.Container>
      <S.Box onClick={handlePivotsPage}>
        <S.ContentData>

          <S.Text>
            Fazenda: {farm_name}
          </S.Text>

          <S.Text>
            Cidade: {farm_city}
          </S.Text>

        </S.ContentData>
        <S.ContentData>
          <S.Text>
            ENTRAR
          </S.Text>
        </S.ContentData>
      </S.Box>
    </S.Container>

  );
};



export default FarmsContainer;
