import { requestLoginAuth, Response } from "api/requestApi";
import Router from "next/router";
import { parseCookies, setCookie } from "nookies";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface UserProviderProps {
  children: React.ReactNode;
}

type ResponseUser = {
  user_type: string;
  user_id: string;
  token: string;
};

type dataContextAuth = {
  signIn: (login: string, password: string) => Promise<Response | null>;
  user: ResponseUser | null;
  setUser: Dispatch<SetStateAction<ResponseUser | null>>;
};

const UserLoginData = createContext({} as dataContextAuth);

function UseLoginProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<ResponseUser | null>(null);

  useEffect(() => {
    verifyUserCookie();
  }, []);

  const redirectForPageWithRole = (role: string) => {
    if (role === "SUDO") {
      Router.push("/adm");
    } else if (role === "USER") {
      Router.push("/farms");
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

    setUser({ user_id, user_type, token });

    if (token) {
      redirectForPageWithRole(user_type);
    }
  };

  const signIn = async (login: string, password: string) => {
    const response = await requestLoginAuth(login, password);
    if (response) {
      const { token, user_id, user_type } = response;
      if (token) {
        const propsCookie = { maxAge: 60 * 60 * 2 }; //2hours

        setCookie(undefined, "soilauth-token", token, propsCookie);
        setCookie(undefined, "soilauth-userid", user_id, propsCookie);
        setCookie(undefined, "soilauth-usertype", user_type, propsCookie);

        setUser({ user_id, user_type, token });

        user_type === "SUDO" ? Router.push("/adm") : Router.push("/farms");
      }
    }

    return response;
  };

  return (
    <UserLoginData.Provider value={{ signIn, user, setUser }}>
      {children}
    </UserLoginData.Provider>
  );
}

function useContextAuth() {
  const context = useContext(UserLoginData);

  return context;
}

export { useContextAuth, UserLoginData, UseLoginProvider };
