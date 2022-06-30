
import CollapsibleAngleScheduleList from "../CollapsibleAngleScheduleList";
import CollapsibleDateScheduleList from "../CollapsibleDateScheduleList";
import * as S from "./styles";

const ScheduleListSelector = () => {

  return (
    <S.Container>
      <CollapsibleDateScheduleList />
      <CollapsibleAngleScheduleList />
    </S.Container>
  )
};

export default ScheduleListSelector;
