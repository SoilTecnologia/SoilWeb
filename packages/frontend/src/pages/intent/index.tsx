import { useEffect } from "react";
import MainIntent from "components/IntentsPage/MainIntent";
import { useContextUserData } from "hooks/useContextUserData";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { parseCookies } from "nookies";
import { api } from "api/api";

const PivotIntent = () => {
  const { pivot, setFarm, farm } = useContextUserData();
  const { getPivotState, getByPivotId, getOneFarms } = useContextActionCrud();

  const getPivotIfNotExists = async (pivot_id: string) => {
    await getByPivotId(pivot_id);
  };

  const getOneFarm = async (farm_id: string) => {
    const resultFarm = await getOneFarms(farm_id);
    resultFarm && setFarm(resultFarm);
  };

  useEffect(() => {
    const { "user-pivot-id": pivot_id, "user-farm-id": farm_id } =
      parseCookies();
    if (!pivot.pivot_id) {
      getPivotIfNotExists(pivot_id);
      !farm && getOneFarm(farm_id);
    }

    getPivotState(pivot_id);
  }, []);

  return <MainIntent />;
};

export default PivotIntent;
