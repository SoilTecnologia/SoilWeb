import * as S from "./styles";
import FarmsContainer from "../FarmsCard";
import Header from "components/globalComponents/Header";
import Farm from "utils/models/farm";

type FarmListProps={
  farmList:Farm[]
}

const MainFarm = ({ farmList }: FarmListProps) => {
  return (
    <>
      <Header text={'Fazendas'} />
      <S.Container>
        {farmList.map((farm: Farm) => (
          <FarmsContainer key={farm.farm_id} farm={farm} />
        ))}

      </S.Container>
    </>
  )
};

export default MainFarm;
