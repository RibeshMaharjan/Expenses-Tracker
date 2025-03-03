import { useState } from "react";
import { useCookies } from "react-cookie";

export const UseCookie = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["authToken"]);

  const SetCookie = (cookieName, value) => {
    setCookie(cookieName, value, { httpOnly: true });
    /* Cookies.set("authToken", response.token, {
          expires: 7,
          secure: true,
          sameSite: "strict",
        }); */
  };

  const GetCookie = (cookieName) => {
    return cookies[cookieName] || null;
  };

  const RemoveCookie = (cookieName) => {
    removeCookie(cookieName);
  };

  const CookieExist = (cookieName) => {
    console.log(cookies);
    console.log(cookieName);
    console.log("cookie:", cookies[cookieName]);

    return cookies[cookieName] != null;
  };

  return {
    SetCookie,
    GetCookie,
    RemoveCookie,
    CookieExist,
  };
};
