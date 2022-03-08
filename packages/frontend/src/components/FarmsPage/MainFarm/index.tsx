import * as S from "./styles";
import FarmsContainer from "../FarmsCard";
import Header from "components/globalComponents/Header";
const MainFarm = (props) => {
  const { farmList } = props
  return (
    <>
      <Header Text={'Fazendas'}/>
      <S.Container>
        {farmList.map((farm) => (
          <FarmsContainer key={farm.farm_id} farm={farm} />
        ))}

      </S.Container>
    </>
  )
};

export default MainFarm;
