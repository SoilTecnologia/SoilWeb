import MainAdmin from "components/AdminPage/MainAdmin";
import { Loading } from "components/globalComponents/Loading/Loading";
import { useContextAuth } from "hooks/useLoginAuth";
import Router from "next/router";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";

const Admin = () => {
  const { user, setUser } = useContextAuth();
  const [isAdm, setIsAdm] = useState(false);

  useEffect(() => {
    const {
      "soilauth-token": token,
      "soilauth-usertype": user_type,
      "soilauth-userid": user_id,
    } = parseCookies();

    if (user?.token || token) {
      !user && token && setUser({ token, user_type, user_id });
      user_type !== "SUDO" ? Router.push("/farms") : setIsAdm(true);
    } else {
      Router.push("/");
    }
  }, []);

  return <>{!isAdm ? <Loading /> : <MainAdmin />}</>;
};

export default Admin;
