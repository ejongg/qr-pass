import React, {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useCookies } from "react-cookie";

interface SessionUser {
  role: string;
}

export function parseJWT(token: string): SessionUser {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  const parsed = JSON.parse(jsonPayload);

  return { role: parsed.role };
}

export const sessionContext = React.createContext<{
  user: SessionUser | null;
  setUser: Dispatch<SetStateAction<SessionUser | null>>;
}>({ user: null, setUser: () => {} });

export const Session: FC<{ children?: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [{ access_token: accessToken }] = useCookies(["access_token"]);

  useEffect(() => {
    if (accessToken) {
      const user = parseJWT(accessToken);
      setUser(user);
    }
  }, []);

  return (
    <sessionContext.Provider value={{ user, setUser }}>
      {children}
    </sessionContext.Provider>
  );
};
