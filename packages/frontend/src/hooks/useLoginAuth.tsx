import { requestLoginAuth } from "api/requestApi";
import Router from "next/router";
import { setCookie, parseCookies } from "nookies";
import React, { createContext, useContext, useEffect, useState } from "react";

interface UserProviderProps {
  children: React.ReactNode;
}

type ResponseUser = {
  user_type: string;
  user_id: string;
};

type dataContextAuth = {
  signIn: (login: string, password: string) => Promise<any | null>;
  isAuthenticated: boolean;
  user: ResponseUser | null;
};

const UserLoginData = createContext({} as dataContextAuth);

function UseLoginProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<ResponseUser | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    verifyUserCookie();
  }, []);

  const redirectForPageWithRole = (role: string) => {
    if (role === "SUDO") {
      Router.push("/adm");
    } else if (role === "USER") {
      Router.push("/user");
    } else {
      Router.back();
    }
  };

  const verifyUserCookie = () => {
    const {
      "soilauth-token": token,
      "soilauth-usertype": user_type,
      "soilauth-userid": user_id,
    } = parseCookies();

    setUser({ user_id, user_type });

    if (token) {
      redirectForPageWithRole(user_type);
    }
  };

  const signIn = async (login: string, password: string) => {
    const response = await requestLoginAuth(login, password);
    if (response) {
      const propsCookie = { maxAge: 60 * 60 * 2 }; //2hours

      setCookie(undefined, "soilauth-token", response.token, propsCookie);
      setCookie(undefined, "soilauth-userid", response.user_id, propsCookie);
      setCookie(
        undefined,
        "soilauth-usertype",
        response.user_type,
        propsCookie
      );

      setUser({ user_type: response.user_type, user_id: response.user_id });

      response.user_type === "SUDO"
        ? Router.push("/adm")
        : Router.push("/user");
    }

    return response;
  };

  return (
    <UserLoginData.Provider value={{ signIn, user, isAuthenticated }}>
      {children}
    </UserLoginData.Provider>
  );
}

function useContextAuth() {
  const context = useContext(UserLoginData);

  return context;
}

export { useContextAuth, UserLoginData, UseLoginProvider };
