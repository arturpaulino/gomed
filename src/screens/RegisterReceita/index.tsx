import React, {useState, useEffect} from "react";
import {Modal, TouchableNativeFeedback, Keyboard, Alert} from "react-native";
import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes,
  Photo,
} from "./styles";

import {useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {InputForm} from "../../compontes/Form/InputForm";
import {Button} from "../../compontes/Form/Button";
import {TransactionTypeButton} from "../../compontes/Form/TransactionTypeButton";
import {CategorySelectButton} from "../../compontes/Form/CategorySelectButton";
import {CategorySelect} from "../../screens/CategorySelect";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import uuid from "react-native-uuid";
import {MaterialIcons} from "@expo/vector-icons";
import {useAuth} from "../../hooks/auth";
import {useTheme} from "styled-components";

interface FormData {
  id: string;
  nomemedico: string;
  datareceita: string,
  diagnostico: string,
  receita: string,
}

export function Receita() {
  const theme = useTheme();
  const {user} = useAuth();


  const schema = yup.object().shape({
    nomemedico: yup.string().required("Nome e obrigadotiro"),
    datareceita: yup.string().required("Data Receita e obrigadotiro"),
    diagnostico: yup.string().required("Diagnóstico obrigadotiro"),
    receita: yup.string().required("Receita e obrigadotiro"),

  });
  const dataKey = `@gofinances:receitas:${user.id}`;
  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({resolver: yupResolver(schema)});

  const navigation = useNavigation();

  async function handleRegister(form: FormData) {

    const dataNew = {
      id: String(uuid.v4()),
      nomemedico: form.nomemedico,
      datareceita: form.datareceita,
      diagnostico: form.diagnostico,
      receita: form.receita,

    };

    try {
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];
      const dataFormat = [...currentData, dataNew];
      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormat));
      reset();
      navigation.navigate("Listagem");
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível salvar!");
    }
  }



  return (
    <TouchableNativeFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastrar Receita</Title>
        </Header>
        <Form>
          <Fields>
            <InputForm
              name="nomemedico"
              control={control}
              placeholder="Nome do Medico"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.nomemedico && errors.nomemedico.message}
            />

            <InputForm
              name="datareceita"
              control={control}
              placeholder="Data Receita"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.datareceita && errors.datareceita.message}
            />

            <InputForm
              name="diagnostico"
              control={control}
              placeholder="Diagnóstico"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.diagnostico && errors.diagnostico.message}
            />

            <InputForm
              name="receita"
              control={control}
              placeholder="Receita"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.receita && errors.receita.message}
            />

            <Photo>
              <MaterialIcons
                name="camera-alt"
                size={82}
                color={theme.colors.secondary}
              />
            </Photo>
          </Fields>
          <Button
            title="Enviar"
            onPress={handleSubmit(handleRegister)}
          ></Button>
        </Form>

      </Container>
    </TouchableNativeFeedback>
  );
}
