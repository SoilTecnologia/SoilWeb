
import { useEffect } from "react";
import MainIntent from "components/IntentsPage/MainIntent";
import { useContextUserData } from "hooks/useContextUserData";
import { useContextActionCrud } from "hooks/useActionsCrud"

const PivotIntent = () => {
  const { pivot } = useContextUserData()
  const { getPivotState } = useContextActionCrud()
  useEffect(() => {
    if (pivot) {
      getPivotState(pivot.pivot_id)
    }
  }, [])
  return (
    <MainIntent />
  )
};

export default PivotIntent;
