import React, {useState, useEffect} from "react";
import {Modal , TouchableNativeFeedback , Keyboard, Alert } from "react-native";
import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes,
} from "./styles";

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage"
import {InputForm} from "../../compontes/Form/InputForm";
import {Button} from "../../compontes/Form/Button";
import { useForm  } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import uuid from  "react-native-uuid";
import {  useAuth } from "../../hooks/auth";



interface  FormData {
  nomemedico: string;
  telefonemedico: string;
  endereco: string;
  data: string;
  sintoma: string;
}

export function Register() {

  const  { user  } = useAuth()
  const [transactionType, setTransactionType] = useState("");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState({
    key: "category",
    name: "Categoria",
  });

  const schema = yup.object().shape({
    nomemedico: yup.string().required("Nome e obrigadotiro"),
    sintoma: yup.string().required("Nome e obrigadotiro"),
    telefonemedico: yup.number().required("Valor e obrigatorio"),
  });

  const dataKey = `@gomed:consultas_users:${user.id}`
  const { control, handleSubmit, reset,  formState:{ errors } } = useForm(
    {resolver: yupResolver(schema)})

  const  navigation  =useNavigation();

  async function handleRegister(form:FormData) {
    const dataNew = {
      id: String(uuid.v4()),
      nomemedico: form.nomemedico,
      telefonemedico: form.telefonemedico,
      endereco : form.endereco,
      data : form.data,
      sintoma : form.sintoma,
    }

    try {
      const data = await AsyncStorage.getItem(dataKey)
      const currentData = data ? JSON.parse(data) :[];
      const dataFormat =[
        ...currentData,
        dataNew
      ]
      await AsyncStorage.setItem(dataKey , JSON.stringify(dataFormat))
      reset();
      navigation.navigate("Listagem")
    } catch (error) {
      console.log(error)
      Alert.alert("Não foi possível salvar!")
    }
  }
  useEffect(() => {
      async function loadData(){
        const data = AsyncStorage.getItem(dataKey)
      }
      loadData()

  }, [])

  function handleTransactionTypeSelect(type: "positive" | "negative") {
    setTransactionType(type);
  }
  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false);
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }

  return (
    <TouchableNativeFeedback onPress={Keyboard.dismiss}>
    <Container>
      <Header>
        <Title>Marcar Consulta</Title>
      </Header>
      <Form>
        <Fields>
          <InputForm
            name="nomemedico"
            control={control}
            placeholder="Nome do Medico"
            autoCapitalize="sentences"
            autoCorrect={false}
            error={errors.name && errors.name.message}
            />

          <InputForm
            name="telefonemedico"
            control={control}
            placeholder="Telefone Medico"
            autoCapitalize="sentences"
            autoCorrect={false}
            error={errors.name && errors.name.message}
            />

          <InputForm
            name="endereco"
            control={control}
            placeholder="Endereco"
            autoCapitalize="sentences"
            autoCorrect={false}
            error={errors.name && errors.name.message}
            />

            <InputForm
            name="data"
            control={control}
            placeholder="Data Consulta"
            autoCapitalize="sentences"
            autoCorrect={false}
            error={errors.name && errors.name.message}
            />

            <InputForm
            name="sintoma"
            control={control}
            placeholder="Sintoma"
            autoCapitalize="sentences"
            autoCorrect={false}
            error={errors.name && errors.name.message}
            />


        </Fields>
        <Button title="Enviar" onPress={handleSubmit(handleRegister)} ></Button>
      </Form>
      <Modal visible={categoryModalOpen}>

      </Modal>
    </Container>
    </TouchableNativeFeedback>
  );
}
