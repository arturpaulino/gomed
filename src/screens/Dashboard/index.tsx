import React, {useEffect, useState} from "react";
import {ActivityIndicator} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect} from "@react-navigation/native";
import {useNavigation} from "@react-navigation/core";
import * as Notifications from "expo-notifications";
import {HighlightCard} from "../../compontes/HighlightCard";
import {
  TransactionCard,
  TransactionCardProps,
} from "../../compontes/TransactionCard";

import {
  TransactionCardReceita,
  TransactionCarReceitadProps,
} from "../../compontes/TransactionCardReceita";

import {
  Container,
  Header,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  UserWrapper,
  Icon,
  HighlightCards,
  Transactions,
  TransactionList,
  Title,
  LogoutButton,
  LoadContainer,
} from "./styles";

import {useAuth} from "../../hooks/auth";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  name: string;
  lastTransaction: string;
}

interface highlightData {
  consulta: HighlightProps;
  medicamento: HighlightProps;
}

export function Dashboard() {
  const navigation = useNavigation();
  const [isLoading, setisLoading] = useState(true);
  const [data, setData] = useState<DataListProps[]>([]);
  const [highlightData, sethighlightData] = useState<highlightData>(
    {} as highlightData
  );
  const [modoView, setModoView] = useState("Receitas");

  const {user, signOut} = useAuth();
  const dataKeyConsulta = `@gomed:consultas_users:${user.id}`;
  const dataKeyReceita = `@gofinances:receitas:${user.id}`;

  async function loadTransactions() {
    let transactions;
    sethighlightData({
      consulta: {
        name: "Sem consultas marcas",
        lastTransaction: "",
      },
      medicamento: {
        name: "Sem medicamentos marcas",
        lastTransaction: "Tribus Terreste- duas capsulas ao dia ",
      },
    });

    const responseReceitas = await AsyncStorage.getItem(dataKeyReceita);

    const transactionsReceitas = responseReceitas
      ? JSON.parse(responseReceitas)
      : [];

    if (transactionsReceitas?.length > 0) {
      highlightData.medicamento.name = transactionsReceitas[0]?.receita;
      highlightData.medicamento.lastTransaction =
        transactionsReceitas[0].diagnostico;
    }
    console.log("highlightData", highlightData)

    const responseConsultas = await AsyncStorage.getItem(dataKeyConsulta);
    const transactionsConsultas = responseConsultas
      ? JSON.parse(responseConsultas)
      : [];

    if (transactionsConsultas?.length > 0) {
      highlightData.consulta.name =
        transactionsConsultas[0].data + " as " + transactionsConsultas[0].hora;
      highlightData.consulta.lastTransaction =
        transactionsConsultas[0].nomemedico +
        "endereço: " +
        transactionsConsultas[0].endereco +
        " telefone: " +
        transactionsConsultas[0].telefonemedico;
    }

    if (modoView == "Receitas") setData(transactionsReceitas);
    else {
      setData(transactionsConsultas);
    }
    sethighlightData(highlightData)
    setisLoading(false);
  }
  useFocusEffect(
    React.useCallback(() => {
      loadTransactions();
    }, [modoView])
  );

  function handleModeView(modo: string) {
    setModoView( modo)

  }

  function handleInventorySelect(item: TransactionCardProps) {
    console.log("handleInventorySelect", item);
    navigation.navigate("Conulstas", {
      dados: item,
    });
  }
  function handleInventorySelectReceita(item: TransactionCarReceitadProps) {
    console.log("handleInventorySelect", item);
    navigation.navigate("Receitas", {
      dados: item,
    });
  }

  useEffect(() => {
    /*
    const subscription = Notifications.addNotificationReceivedListener(
      async (notification) => {
        const data = notification.request.content.data;
        console.log("subscription", data);
        subscription.remove();
      }
    );
*/
    return () => subscription.remove();
  }, []);
  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color="red" size="large" />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{uri: user.photo}} />
                <User>
                  <UserGreeting>Ola</UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>
              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighlightCards>
            <HighlightCard
              type="up"
              title="Proxima consulta"
              name={highlightData.consulta.name}
              lastTransaction={highlightData.consulta.lastTransaction}
              onPress={() => handleModeView('Consultas')}
            ></HighlightCard>
            <HighlightCard
              type="down"
              title="Proximo medicamento"
              name={highlightData.medicamento.name}
              lastTransaction={highlightData.medicamento.lastTransaction}
              onPress={() => handleModeView('Receitas')}
            ></HighlightCard>
          </HighlightCards>

          {modoView == "Consultas" ? (
            <Transactions>
              <Title>Consultas Agendas</Title>
              <TransactionList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                  <TransactionCard
                    data={item}
                    onPress={() => handleInventorySelect(item)}
                  />
                )}
              ></TransactionList>
            </Transactions>
          ) : (
            <Transactions>
              <Title>Consultas Receita</Title>
              <TransactionList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                  <TransactionCardReceita
                    data={item}
                    onLongPress={ ()=> console.log("oi")}
                    onPress={() => handleInventorySelectReceita(item)}
                  />
                )}
              ></TransactionList>
            </Transactions>
          )}
        </>
      )}
    </Container>
  );
}
