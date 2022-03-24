import { Loading } from "components/globalComponents/Loading/Loading";
import MainPivot from "components/PivotsPage/MainPivot";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextData } from "hooks/useContextData";
import { useContextUserData } from "hooks/useContextUserData";
import { useContextAuth } from "hooks/useLoginAuth";
import { useEffect } from "react";

const UserPivots = () => {
  const { farm } = useContextUserData();
  const { isUserAuth, haveUserAuth } = useContextAuth();
  const { getGetPivotsListWithFarmId } = useContextActionCrud();
  const { pivotList } = useContextData();

  useEffect(() => {
    isUserAuth();
    if (farm) {
      getGetPivotsListWithFarmId(farm.farm_id);
    }
  }, [farm]);

  return (
    <>{!haveUserAuth ? <Loading /> : <MainPivot pivotList={pivotList} />}</>
  );
};

export default UserPivots;
