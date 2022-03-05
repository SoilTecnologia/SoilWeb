import Farm from "utils/models/farm";
import Pivot from "utils/models/pivot";
import User from "utils/models/user";

//Users
export function handleUpdateUser(user: User, listUser: User[]) {
  const newArrayUser = listUser.filter(
    (oneUser) => oneUser.user_id !== user.user_id
  );
  newArrayUser.push(user);
  newArrayUser.sort((a, b) => Number(a.user_id) - Number(b.user_id));

  return newArrayUser;
}
export function handleDeleteUser(id: string, listUser: User[]) {
  const newArrayUser = listUser.filter((user) => user.user_id !== id);
  newArrayUser.sort((a, b) => Number(a.user_id) - Number(b.user_id));

  return newArrayUser;
}

//Farms
export function handleUpdateFarm(farm: Farm, listFarm: Farm[]) {
  const newArrayFarm = listFarm.filter(
    (farmUser) => farmUser.farm_id != farm.farm_id
  );
  newArrayFarm.push(farm);
  newArrayFarm.sort((a, b) => Number(a.farm_id) - Number(b.farm_id));

  return newArrayFarm;
}
export function handleDeleteFarm(id: string, listFarm: Farm[]) {
  const newArrayFarm = listFarm.filter((farmUser) => farmUser.farm_id != id);
  newArrayFarm.sort((a, b) => Number(a.farm_id) - Number(b.farm_id));

  return newArrayFarm;
}
//Pivots
export function handleDeletePivot(
  id: string,
  farmRelation: Farm,
  farms: Farm[]
) {
  if (farmRelation.pivots) {
    const newPivots = farmRelation.pivots.filter((piv) => piv.pivot_id !== id);
    newPivots.sort((a, b) => Number(a.pivot_id) - Number(b.pivot_id));

    const newFarm = { ...farmRelation, pivots: newPivots };

    const arrayNewFarms = farms.filter(
      (farm) => farm.farm_id !== farmRelation.farm_id
    );
    arrayNewFarms.push(newFarm);
    arrayNewFarms.sort((a, b) => Number(a.farm_id) - Number(b.farm_id));

    return arrayNewFarms;
  } else {
    return farms;
  }
}
export function handleUpdatePivot(
  pivot: Pivot,
  farmRelation: Farm,
  farms: Farm[]
) {
  if (farmRelation.pivots) {
    const newPivots = farmRelation.pivots.filter(
      (piv) => piv.pivot_id !== pivot.pivot_id
    );

    newPivots.push(pivot);
    newPivots.sort((a, b) => Number(a.pivot_id) - Number(b.pivot_id));

    const newFarm = { ...farmRelation, pivots: newPivots };

    const arrayNewFarms = farms.filter(
      (farm) => farm.farm_id !== farmRelation.farm_id
    );
    arrayNewFarms.push(newFarm);
    arrayNewFarms.sort((a, b) => Number(a.farm_id) - Number(b.farm_id));

    return arrayNewFarms;
  } else {
    return farms;
  }
}
