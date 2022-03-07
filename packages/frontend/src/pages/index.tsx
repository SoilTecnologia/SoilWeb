import MainLogin from "components/LoginPage/MainLogin";
import Router from "next/router";
import { parseCookies } from "nookies";
import { useEffect } from "react";

export default function Home() {
  // useEffect(() => {
  //   const { "soilauth-token": token, "soilauth-usertype": user_type } =
  //     parseCookies();
  //   if (token) {
  //     user_type === "SUDO" ? Router.push("/adm") : Router.push("/");
  //   }
  // }, []);
  return <MainLogin />;
}
