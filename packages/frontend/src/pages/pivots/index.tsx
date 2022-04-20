import { Loading } from "components/globalComponents/Loading/Loading";
import MainPivot from "components/PivotsPage/MainPivot";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextData } from "hooks/useContextData";
import { useContextUserData } from "hooks/useContextUserData";
import { useContextAuth } from "hooks/useLoginAuth";
import { parseCookies } from "nookies";
import { useEffect } from "react";

const UserPivots = () => {
  const { farm } = useContextUserData();
  const { isUserAuth, user } = useContextAuth();
  const { getGetPivotsListWithFarmId, findAllPivots } = useContextActionCrud();
  const { pivotList } = useContextData();

  const requestPivots = async () => {
    const {
      "soilauth-token": token,
      "soilauth-usertype": user_type,
      "soilauth-userid": user_id,
    } = parseCookies();
    const isAdm =
      (user && user.user_type === "SUDO") || (token && user_type === "SUDO");
    if (isAdm) {
      findAllPivots();
    } else {
      const { "user-farm-id": farm_id } = parseCookies();
      const farmId = farm ? farm.farm_id : farm_id;
      farmId && getGetPivotsListWithFarmId(farmId);
    }
  };

  useEffect(() => {
    isUserAuth();
    requestPivots();
  }, []);

  useEffect(() => {
    requestPivots();
    farm && getGetPivotsListWithFarmId(farm.farm_id);
  }, [farm]);

  return <>{!user ? <Loading /> : <MainPivot pivotList={pivotList} />}</>;
};

export default UserPivots;
