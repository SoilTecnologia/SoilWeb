import { useEffect } from "react";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextData } from "hooks/useContextData";
import { useContextUserData } from "hooks/useContextUserData";

const UserPivots = () => {
  const { farm } = useContextUserData();
  const { getAllFarmPivots } = useContextActionCrud()
  const { pivotList } = useContextData()

  useEffect(() => {
    if (farm) {
      getAllFarmPivots(farm.user_id)
    }
  }, [])

  return (
    <>
      {pivotList.map((pivot) => {
        console.log(pivot)
      })
      }
    </>
  )
};

export default UserPivots;

