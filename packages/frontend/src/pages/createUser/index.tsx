import MainCreateUser from 'components/CreateUserPage/MainCreateUser';
import  Router  from 'next/router';
import { destroyCookie, parseCookies } from 'nookies';
import { useEffect, useState } from "react";

const Admin = () => {
  const [codeOk, setCodeOk] = useState("");
    useEffect(()=> {
      const {"soilauth-code": code} = parseCookies();
      if(code === "ok") setCodeOk(code);
      else Router.push("/");


      return () => {
        destroyCookie(null, "soilauth-code");
      }
  },[])

  return ( codeOk && <MainCreateUser />);
};

export default Admin;
