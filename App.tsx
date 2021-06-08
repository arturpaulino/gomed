import React from "react";
import "react-native-gesture-handler";
import 'intl'
import 'intl/locale-data/jsonp/pt-BR'

import {ThemeProvider} from "styled-components";
import { Routes } from "./src/routes";
import Apploading from "expo-app-loading";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

import {  useAuth } from "./src/hooks/auth";


import theme from "./src/global//styles/theme";
import { AuthProvider} from "./src/hooks/auth";

export default function App() {
  const  {isLoading   } = useAuth()

  const [fontLoading] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  if ( (!fontLoading) || isLoading ) return <Apploading />;
  return (
    <ThemeProvider theme={theme}>
        <AuthProvider>
          <Routes/>
        </AuthProvider>

    </ThemeProvider>
  );
}
