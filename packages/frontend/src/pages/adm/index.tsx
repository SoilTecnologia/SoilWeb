import MainAdmin from "components/AdminPage/MainAdmin";
import { useContextAuth } from "hooks/useLoginAuth";
import Router from "next/router";
import { parseCookies } from "nookies";
import { useEffect } from "react";

const Admin = () => {
  const { user, setUser } = useContextAuth();
  useEffect(() => {
    const {
      "soilauth-token": token,
      "soilauth-usertype": user_type,
      "soilauth-userid": user_id,
    } = parseCookies();

    if (token) {
      !user && setUser({ token, user_type, user_id });
      user_type !== "SUDO" && Router.push("/user");
    } else {
      Router.push("/");
    }
  }, []);

  return <MainAdmin />;
};

export default Admin;
