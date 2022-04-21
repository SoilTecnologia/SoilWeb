import MainHistoric from "components/HistoricPage/MainHistoric";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { useContextUserData } from "hooks/useContextUserData";
import { useEffect } from "react";

export const Historic = () => {
  return <MainHistoric />;
};
export default Historic;
