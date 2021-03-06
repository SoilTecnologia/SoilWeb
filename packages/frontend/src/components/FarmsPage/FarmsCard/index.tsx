import { useContextUserData } from "hooks/useContextUserData";
import Router from "next/router";
import Farm from "utils/models/farm";
import * as S from "./styles";
interface FarmProps {
  farm: Farm;
}
const FarmsContainer = ({ farm }: FarmProps) => {
  const { farm_city, farm_name } = farm;
  const { setFarm } = useContextUserData();

  const handlePivotsPage = () => {
    setFarm(farm);
    Router.push("/pivots");
  };

  return (
    <S.Container>
      <S.Box onClick={handlePivotsPage}>
        <S.ContentData>
          <S.Text>Fazenda: {farm_name}</S.Text>

          <S.Text>Cidade: {farm_city}</S.Text>
        </S.ContentData>
        <S.ContentData>
          <S.Text>ENTRAR</S.Text>
        </S.ContentData>
      </S.Box>
    </S.Container>
  );
};

export default FarmsContainer;
