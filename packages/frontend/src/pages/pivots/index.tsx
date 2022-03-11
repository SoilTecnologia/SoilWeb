import { useEffect } from "react";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextData } from "hooks/useContextData";
import { useContextUserData } from "hooks/useContextUserData";
import MainPivot from "components/PivotsPage/MainPivot";

const UserPivots = () => {
  const { farm } = useContextUserData();
  const { getAllPivotWithFarmId } = useContextActionCrud()
  const { pivotList} = useContextData()

  useEffect(() => {
    if (farm) {
      getAllPivotWithFarmId(farm.farm_id)
    }
  }, [])

  return <MainPivot pivotList={pivotList}/>
};

export default UserPivots;

