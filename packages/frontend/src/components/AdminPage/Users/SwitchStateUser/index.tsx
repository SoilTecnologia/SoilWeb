import { useContextData } from "hooks/useContextData";

import ListUsers from "../ListUsers";
import UpdateFarmSelected from "components/AdminPage/Farms/UpdateFarmSelected";
import ViewDataUser from "../ViewDataUser";
import ViewDataFarms from "components/AdminPage/Farms/ViewDataFarms";
import UpdatePivotData from "components/AdminPage/Pivots/UpdatePivotData";
import CreateNewFarm from "components/AdminPage/Farms/CreateNewFarm";

const SwitchStateUser = () => {
  const { stateAdmin } = useContextData();

  if (stateAdmin.showIsListUser) {
    return <ListUsers />;
  } else if (stateAdmin.updateFarm) {
    return <UpdateFarmSelected farmSelected={stateAdmin.updateFarm} />;
  } else if (stateAdmin.createFarm && stateAdmin.dataUserSelected) {
    return <CreateNewFarm />;
  } else if (stateAdmin.updatePivot) {
    return <UpdatePivotData pivotData={stateAdmin.updatePivot} />;
  } else if (stateAdmin.dataFarmSelected) {
    return <ViewDataFarms farmData={stateAdmin.dataFarmSelected} />;
  } else if (stateAdmin.dataUserSelected) {
    return <ViewDataUser />;
  }

  return <div>Not Element Selected</div>;
};

export default SwitchStateUser;
