import { createContext, useContext, useState } from "react";
export type AuthUserType = {
  data: {
    userName?: string;
    email: string;
    _id: string;
  };
};
type UserContextProviderProps = {
  children: React.ReactNode;
};
export type AuthContextType = {
  authUser: AuthUserType | null;
  setAuthUser: React.Dispatch<React.SetStateAction<AuthUserType | null>>;
} | null;

const AuthContext = createContext<AuthContextType | null>(null);

// To Use the context ,just we need to import this function :
export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }

  return context;
}

export const AuthContextProvider = ({ children }: UserContextProviderProps) => {
  const [authUser, setAuthUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
