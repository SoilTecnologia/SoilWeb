import MainAdmin from "components/AdminPage/MainAdmin";
import { useEffect } from "react";
import { parseCookies } from "nookies";
import Router from "next/router";

const Admin = () => {
  useEffect(() => {
    const { "soilauth-token": token, "soilauth-usertype": user_type } =
      parseCookies();

    if (token) {
      user_type !== "SUDO" && Router.push("/");
    }
  }, []);

  return <MainAdmin />;
};

export default Admin;
