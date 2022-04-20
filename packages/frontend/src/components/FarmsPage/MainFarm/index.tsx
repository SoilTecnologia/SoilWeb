import Header from "components/globalComponents/Header";
import { useContextData } from "hooks/useContextData";
import Farm from "utils/models/farm";
import FarmsContainer from "../FarmsCard";
import LogoutButton from "../LogoutButton";
import * as S from "./styles";

type FarmListProps = {
  farmList: Farm[];
};
const MainFarm = () => {
  const { farmList } = useContextData();
  return (
    <>
      <Header text={"Fazendas"}>
        <LogoutButton />
      </Header>
      <S.Container>
        {farmList.map((farm: Farm) => (
          <FarmsContainer key={farm.farm_id} farm={farm} />
        ))}
      </S.Container>
    </>
  );
};

export default MainFarm;
