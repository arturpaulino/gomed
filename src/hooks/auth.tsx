import React, {createContext, ReactNode, useContext, useState , useEffect } from "react";
import * as Google from "expo-google-app-auth";
import * as AppleAuthentication from "expo-apple-authentication";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {User} from "../screens/Dashboard/styles";

interface AuthProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}
interface IAuthConextData {
  user: User;
  signInWithGoogle(): Promise<void>;
  signInWithApple(): Promise<void>;
  signOut(): Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext({} as IAuthConextData);

function AuthProvider({children}: AuthProps) {
  const [user, setUser] = useState<User>({} as User);
  const [isLoading, setisLoading ] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const userStoraged = await AsyncStorage.getItem("@gofinances:user")
      if (userStoraged){
        const user = JSON.parse(userStoraged);
        setUser(user);
      }
      setisLoading(false)
    }
    loadUser()

  }, []);

  async function signOut() {
    setUser({} as User);
    await AsyncStorage.removeItem("@gofinances:user")
  }

  async function signInWithGoogle() {
    try {
      const result = await Google.logInAsync({
        iosClientId:
          "897326690011-hgq6622bgbqh6oekteg6hmftdb6ef073.apps.googleusercontent.com",
        androidClientId:
          "897326690011-ocvvvg1ehv7k98t9uvpes5pfdrpk585p.apps.googleusercontent.com",
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        const userLogged = {
          id: String(result.user.id),
          email: String(result.user.email),
          name: String(result.user.name),
          photo: String(result.user.photoUrl),
        };
        setUser(userLogged);
        await AsyncStorage.setItem(
          "@gofinances:user",
          JSON.stringify(userLogged)
        );
        console.log(userLogged);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function signInWithApple() {
    try {
      const result = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (result) {
        const name = result.fullName?.givenName!;
        const photo = `https://ui-avatars.com/api/?name=${name}`;

        const userLogged = {
          id: String(result.user),
          email: result.email!,
          name,
          photo ,
        };

        setUser(userLogged);
        await AsyncStorage.setItem( "@gofinances:user", JSON.stringify(userLogged) );
        console.log(userLogged);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle,
        signInWithApple,
        signOut,
        isLoading

      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export {AuthProvider, useAuth};
/*
897326690011-ocvvvg1ehv7k98t9uvpes5pfdrpk585p.apps.googleusercontent.com

897326690011-hgq6622bgbqh6oekteg6hmftdb6ef073.apps.googleusercontent.com
*/
