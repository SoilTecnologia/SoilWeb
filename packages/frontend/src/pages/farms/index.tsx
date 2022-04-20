import MainFarm from "components/FarmsPage/MainFarm";
import { Loading } from "components/globalComponents/Loading/Loading";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { useEffect } from "react";
import { useContextAuth } from "hooks/useLoginAuth";

const UserFarms = () => {
  const { user, isUserAuth } = useContextAuth();
  const { getAllFarmsUser, getAllFarms } = useContextActionCrud();

  useEffect(() => {
    isUserAuth();

    if (user && user.user_type === "SUDO") {
      getAllFarms();
    } else {
      user && getAllFarmsUser(user.user_id);
    }
  }, [user]);

  return <>{!user ? <Loading /> : <MainFarm />}</>;
};

export default UserFarms;
