import { requestLoginAuth, Response } from "api/requestApi";
import Router from "next/router";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
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
  signOut: () => Promise<void>;
  user: ResponseUser | null;
  setUser: Dispatch<SetStateAction<ResponseUser | null>>;
  isUserAuth: () => void;
  verifyUserCookie: () => void;
};

const UserLoginData = createContext({} as dataContextAuth);

function UseLoginProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<ResponseUser | null>(null);

  const verifyUserCookie = () => {
    const {
      "soilauth-token": token,
      "soilauth-usertype": user_type,
      "soilauth-userid": user_id,
    } = parseCookies();

    setUser({ user_id, user_type, token });

    if (token) {
      Router.push("/adm");
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

        Router.push("/adm");
      }
    }

    return response;
  };
  const signOut = async () => {
    destroyCookie(null, "soilauth-token");
    destroyCookie(null, "soilauth-userid");
    destroyCookie(null, "soilauth-usertype");
    Router.push("/");
  };

  const isUserAuth = () => {
    const {
      "soilauth-token": token,
      "soilauth-usertype": user_type,
      "soilauth-userid": user_id,
    } = parseCookies();

    setTimeout(() => {
      if (!user && !token) {
        setUser(null);
        Router.push("/");
      } else {
        if (!user) {
          setUser({ token, user_id, user_type });
          return;
        }
        return;
      }
    }, 1200);
  };

  return (
    <UserLoginData.Provider
      value={{
        signIn,
        signOut,
        user,
        setUser,
        isUserAuth,
        verifyUserCookie,
      }}
    >
      {children}
    </UserLoginData.Provider>
  );
}

function useContextAuth() {
  const context = useContext(UserLoginData);

  return context;
}

export { useContextAuth, UserLoginData, UseLoginProvider };
