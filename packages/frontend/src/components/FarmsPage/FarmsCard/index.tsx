import * as S from "./styles";
import Router from "next/router";
import { useContextUserData } from "hooks/useContextUserData";
import Farm from "utils/models/farm";
interface FarmProps{
  farm:Farm
}
const FarmsContainer = ({ farm }: FarmProps) => {
  const { farm_city, farm_name } = farm
  const { setFarm } = useContextUserData()

  const handlePivotsPage = () => {
    setFarm(farm)
    Router.push("/pivots",);
  }

  return (
    <S.Container>
      <S.Box onClick={handlePivotsPage}>
        <S.ContentData>

          <S.UserName>
            Fazenda: {farm_name}
          </S.UserName>

          <S.UserName>
            Localização: {farm_city}
          </S.UserName>

        </S.ContentData>
      </S.Box>
    </S.Container>

  );
};



export default FarmsContainer;
