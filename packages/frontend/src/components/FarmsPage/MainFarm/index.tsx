import Header from "components/globalComponents/Header";
import { useContextData } from "hooks/useContextData";
import Farm from "utils/models/farm";
import FarmsContainer from "../FarmsCard";
import * as S from "./styles";

const MainFarm = () => {
  const { farmList } = useContextData();

  return (
    <>
      <Header text={"Fazendas"} />
      <S.Container>
        {farmList.map((farm: Farm) => (
          <FarmsContainer key={farm.farm_id} farm={farm} />
        ))}
      </S.Container>
    </>
  );
};

export default MainFarm;
