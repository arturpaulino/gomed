import React, {useState, useEffect} from "react";
import {
  Modal,
  TouchableNativeFeedback,
  Keyboard,
  Alert,
  Button as ButtonRC,
} from "react-native";
import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes,
} from "./styles";

import {useNavigation, useRoute} from "@react-navigation/core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {InputForm} from "../../compontes/Form/InputForm";

import {Button} from "../../compontes/Form/Button";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import uuid from "react-native-uuid";
import {useAuth} from "../../hooks/auth";
import {useTheme} from "styled-components";

import DateTimePicker from "@react-native-community/datetimepicker";
import ptBR from "date-fns/locale/pt-BR";
import {format} from "date-fns";
import * as Notifications from 'expo-notifications';

interface FormData {
  id: string;
  nomemedico: string;
  telefonemedico: string;
  endereco: string;
  data: string;
  hora: string;
  sintoma: string;
}

interface sendData {
  data: FormData;
}

export function Register() {
  const {user} = useAuth();
  const dataKey = `@gomed:consultas_users:${user.id}`;
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();
  const {dados} =   route.params as sendData;
  console.log("dados paramentos", dados  )



  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const [data, setData] = useState("Data");
  const [hora, setHora] = useState("Hora");

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    console.log(currentDate);

    setData(format(currentDate, "dd-MM-yyyy"));
    setHora(format(currentDate, "HH:mm:ss"));
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    console.log("showDatepicker");
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  async function handleRegister(form: FormData) {
    const now = new Date();

    if (data === "Data")
      return Alert.alert("Selecione um data para a consulta");

      const seconds = Math.abs(
        Math.ceil((now.getTime() - now.getTime()) / 1000)
      )

      const Lembrente = {
        id: String(uuid.v4()),
        nomemedico: form.nomemedico,
        telefonemedico: form.telefonemedico,
        endereco: form.endereco,
        data: data,
        hora: hora,
        sintoma: form.sintoma,
      };


      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'GOMED - Lembrete',
          body: `Lembrente da sua consulta medica com Dr ${form.nomemedico}`,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: {
            Lembrente
          },
        },
        trigger: {
          seconds: seconds < 60 ? 60 : seconds,
          repeats: true
        }
      })


    const dataNew = {
      id: String(uuid.v4()),
      nomemedico: form.nomemedico,
      telefonemedico: form.telefonemedico,
      endereco: form.endereco,
      data: data,
      hora: hora,
      sintoma: form.sintoma,
      notificationId: notificationId
    };

    try {
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const filtered = currentData.filter((item: FormData) => {
        if (dados.id.trim() != item.id.trim()) {
          return true;
        }
      });

      const dataFormat = [...filtered, dataNew];
      console.log("dataFormat", dataFormat)
      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormat));
      reset();
      navigation.navigate("Listagem");
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível salvar!");
    }
  }

  const schema = yup.object().shape({
    nomemedico: yup.string().required("Nome e obrigadotiro"),
    sintoma: yup.string().required("Nome e obrigadotiro"),
    telefonemedico: yup.number().required("Valor e obrigatorio"),
  });

 const { control, handleSubmit, reset,  formState:{ errors } } = useForm(
  {resolver: yupResolver(schema)})


  useEffect(() => {
      setData(dados.data);
      setHora(dados.hora );
}, []);


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
              error={errors.nomemedico && errors.nomemedico.message}
              defaultValue={ (dados.nomemedico) || dados.nomemedico }
            />

            <InputForm
              name="telefonemedico"
              control={control}
              placeholder="Telefone Medico"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.telefonemedico && errors.telefonemedico.message}
              defaultValue={ (dados.telefonemedico) || dados.telefonemedico }
            />

            <InputForm
              name="endereco"
              control={control}
              placeholder="Endereco"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.endereco && errors.endereco.message}
              defaultValue={ (dados.endereco) || dados.endereco }
             />
              <InputForm
              name="sintoma"
              control={control}
              placeholder="Sintoma"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.sintoma && errors.sintoma.message}
              defaultValue={ (dados.sintoma) || dados.sintoma }
            />
            <ButtonRC onPress={showDatepicker} title={data} />
            <ButtonRC onPress={showTimepicker} title={hora} />

          </Fields>
          <Button
            title="Enviar"
            onPress={handleSubmit(handleRegister)}
          ></Button>


        </Form>


        {show && (
          <DateTimePicker
            format="DD-MM-YYYY"
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
            locale="ptBR"
          />
        )}
      </Container>
    </TouchableNativeFeedback>
  );
}
