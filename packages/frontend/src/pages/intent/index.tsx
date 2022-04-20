import { useEffect } from "react";
import MainIntent from "components/IntentsPage/MainIntent";
import { useContextUserData } from "hooks/useContextUserData";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { parseCookies } from "nookies";

const PivotIntent = () => {
  const { pivot } = useContextUserData();
  const { getPivotState, getByPivotId } = useContextActionCrud();

  const getPivotIfNotExists = async (pivot_id: string) => {
    await getByPivotId(pivot_id);
  };

  useEffect(() => {
    const { "user-pivot-id": pivot_id } = parseCookies();
    if (!pivot.pivot_id) {
      getPivotIfNotExists(pivot_id);
      getPivotState(pivot_id);
    } else {
      getPivotState(pivot.pivot_id);
    }
  }, []);

  return <MainIntent />;
};

export default PivotIntent;
