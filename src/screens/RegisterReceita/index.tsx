import React, {useState, useEffect} from "react";
import {Modal , TouchableNativeFeedback , Keyboard, Alert } from "react-native";
import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes,
  Photo
} from "./styles";

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage"
import {InputForm} from "../../compontes/Form/InputForm";
import {Button} from "../../compontes/Form/Button";
import {TransactionTypeButton} from "../../compontes/Form/TransactionTypeButton";
import {CategorySelectButton} from "../../compontes/Form/CategorySelectButton";
import {CategorySelect} from "../../screens/CategorySelect";
import { useForm  } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import uuid from  "react-native-uuid";
import { MaterialIcons } from '@expo/vector-icons';
import {  useAuth } from "../../hooks/auth";
import { useTheme } from 'styled-components'



interface  FormData {
  name: string;
  amount: string;
}

export function Receita() {
  const theme = useTheme();

  const  { user  } = useAuth()
  const [transactionType, setTransactionType] = useState("");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState({
    key: "category",
    name: "Categoria",
  });

  const schema = yup.object().shape({
    name: yup.string().required("Nome e obrigadotiro"),
    amount: yup.number().required("Valor e obrigatorio"),
  });
  const dataKey = `@gofinances:transctions_users:${user.id}`
  const { control, handleSubmit, reset,  formState:{ errors } } = useForm(
    {resolver: yupResolver(schema)})

  const  navigation  =useNavigation();


  async function handleRegister(form:FormData) {
    if (!transactionType)
     return Alert.alert("Selecione um tipo de transação")
     if (category.key=="categoria")
     return Alert.alert("Selecione uma categoria")

    const dataNew = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date,
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
      setTransactionType("");
      setCategory({
        key: "category",
        name: "Categoria",
      });
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
        <Title>Cadastrar Receita</Title>
      </Header>
      <Form>
        <Fields>
          <InputForm
            name="name"
            control={control}
            placeholder="Nome do Medico"
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

            <Photo>
              <MaterialIcons name="camera-alt"  size={82} color={theme.colors.secondary}/>
            </Photo>





        </Fields>
        <Button title="Enviar" onPress={handleSubmit(handleRegister)} ></Button>
      </Form>
      <Modal visible={categoryModalOpen}>
        <CategorySelect
          category={category}
          setCategory={setCategory}
          closeCategory={handleCloseSelectCategoryModal}
        />
      </Modal>
    </Container>
    </TouchableNativeFeedback>
  );
}
