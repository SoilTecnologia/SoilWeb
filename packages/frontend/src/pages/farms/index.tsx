import MainFarm from "components/FarmsPage/MainFarm";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextData } from "hooks/useContextData";
import { useContextAuth } from "hooks/useLoginAuth";
import { useEffect } from "react";

const UserFarms = () => {
  const { user } = useContextAuth();
  const { getAllFarmsUser } = useContextActionCrud();
  const { farmList } = useContextData();
  useEffect(() => {
    if (user) {
      getAllFarmsUser(user.user_id);
    }
  }, [user]);

  return <MainFarm farmList={farmList} />;
};

export default UserFarms;
