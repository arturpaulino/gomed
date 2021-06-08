import React, {useState, useEffect, useContext } from "react";
import {Alert, ActivityIndicator, Platform} from "react-native";
import LogoSVG   from '../../assets/Finance.svg';
import AppleSVG  from '../../assets/apple.svg';
import GoogleSVG from '../../assets/google.svg';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components'

import {Container, Header,TitleWrapper,Title, SignInTitle, Footer,FooterWrapper } from "./styles";

import {SignInSocialBt} from "../../compontes/SignInSocialBt"
import { useAuth} from "../../hooks/auth"
import { FontAwesome } from '@expo/vector-icons';

export function SignIn() {
 const [isLoading, setisLoading ] = useState(false);
 const {  signInWithGoogle , signInWithApple   }  = useAuth()
 const theme = useTheme();

 async function handlessignInWithGoogle() {
  try {
    setisLoading(true)
   return await signInWithGoogle()
  } catch (error) {
    console.log(error);
    Alert.alert("Não possivel se conectar com Google")
    setisLoading(false)

  } finally {

  }
 }

 async function handlessignInWithApple() {
  try {
    setisLoading(true)
    return await signInWithApple()
  } catch (error) {
    console.log(error);
    Alert.alert("Não possivel se conectar com Google")
    setisLoading(false)

  } finally {

  }
 }

  return (
    <Container>
      <Header>

        <TitleWrapper>
          <FontAwesome name="heartbeat" size={82} color={theme.colors.secondary}/>

          <Title>Controle suas {'\n'} sua saúde  {'\n'} de forma simples</Title>
        </TitleWrapper>
        <SignInTitle>Faça seu login com {'\n'} uma das contas abaixo</SignInTitle>
      </Header>
      <Footer>
      <FooterWrapper>
        <SignInSocialBt
          title="Entrar com Google"
          svg={GoogleSVG}
          onPress={handlessignInWithGoogle}
        />


        <SignInSocialBt
          title="Entrar com Aplle"
          svg={AppleSVG}
          onPress={handlessignInWithApple}
        />
      </FooterWrapper>

      { isLoading && <ActivityIndicator color={theme.colors.shape}
      style={{ marginTop:18}  } />}

      </Footer>
    </Container>
  );
}
