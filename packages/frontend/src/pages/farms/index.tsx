import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextData } from "hooks/useContextData";
import { useContextAuth } from "hooks/useLoginAuth";
import { useEffect } from "react";
import MainFarm from "components/FarmsPage/MainFarm";
import { useContextUserData } from "hooks/useContextUserData";

const UserFarms = () => {
  const { user } = useContextAuth();
  const { getAllFarmsUser } = useContextActionCrud();
  const { farmList } = useContextData();
  useEffect(() => {
    if (user) {
      getAllFarmsUser(user.user_id);
    }
  }, []);

  return <MainFarm farmList={farmList} />;
};

export default UserFarms;
