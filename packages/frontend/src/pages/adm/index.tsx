import MainAdmin from "components/AdminPage/MainAdmin";
import { useEffect } from "react";
import { parseCookies } from "nookies";
import Router from "next/router";
import { useContextAuth } from "hooks/useLoginAuth";

const Admin = () => {
  const { user, setUser } = useContextAuth();
  useEffect(() => {
    const {
      "soilauth-token": token,
      "soilauth-usertype": user_type,
      "soilauth-userid": user_id,
    } = parseCookies();

    if (token) {
      !user && setUser({ user_type, user_id });
      user_type !== "SUDO" && Router.push("/user");
    } else {
      Router.push("/");
    }
  }, []);

  return <MainAdmin />;
};

export default Admin;
