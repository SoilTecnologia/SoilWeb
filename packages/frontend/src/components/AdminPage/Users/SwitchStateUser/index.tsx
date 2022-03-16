import { useContextData } from "hooks/useContextData";

import ListUsers from "../ListUsers";
import ViewDataUser from "../ViewDataUser";
import ViewDataFarms from "components/AdminPage/Farms/ViewDataFarms";
import CreateNewFarm from "components/AdminPage/Farms/CreateNewFarm";
import ViewDataPivots from "components/AdminPage/Pivots/ViewDataPivots";

const SwitchStateUser = () => {
  const { stateAdmin } = useContextData();

  if (stateAdmin.showIsListUser) {
    return <ListUsers />;
  } else if (stateAdmin.createFarm && stateAdmin.dataUserSelected) {
    return <CreateNewFarm />;
  } else if (stateAdmin.dataFarmSelected) {
    return <ViewDataFarms farmData={stateAdmin.dataFarmSelected} />;
  } else if (stateAdmin.dataUserSelected) {
    return <ViewDataUser />;
  }

  return <div>Not Element Selected</div>;
};

export default SwitchStateUser;
