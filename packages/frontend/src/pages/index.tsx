import MainLogin from "components/LoginPage/MainLogin";

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
