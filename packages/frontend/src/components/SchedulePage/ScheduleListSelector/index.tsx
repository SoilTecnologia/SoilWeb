
import CollapsibleAngleScheduleList from "../CollapsibleAngleScheduleList";
import CollapsibleDateScheduleList from "../CollapsibleDateScheduleList";
import * as S from "./styles";
type PropsProvider = {
  pivotId: string
}

const ScheduleListSelector = (props: PropsProvider) => {

  const { pivotId } = props
  return (
    <S.Container>
      <CollapsibleDateScheduleList pivotId={pivotId} />
      <CollapsibleAngleScheduleList pivotId={pivotId} />
    </S.Container>
  )
};

export default ScheduleListSelector;
