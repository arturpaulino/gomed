import React, {useEffect, useState} from "react";
import { ActivityIndicator } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect} from "@react-navigation/native";

import {HighlightCard} from "../../compontes/HighlightCard";
import {
  TransactionCard,
  TransactionCardProps,
} from "../../compontes/TransactionCard";
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
  LoadContainer
} from "./styles";

import {  useAuth } from "../../hooks/auth";

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
  const [isLoading, setisLoading ] = useState(true);
  const [data, setData] = useState<DataListProps[]>([]);
  const [highlightData, sethighlightData] = useState<highlightData>(
    {} as highlightData
  );
  const  { user, signOut } = useAuth()
  const dataKey = `@gomed:consultas_users:${user.id}`

  async function loadTransactions() {
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];
    setData(transactions);

    sethighlightData({
      consulta: {
        name: '08/06/2021 as 18:00hs',
        lastTransaction: "Dr Gabriel-sig quadra 01, bloco R, n 301",
      },
      medicamento: {
        name: '08/06/2021 as 00:00',
        lastTransaction: "Tribus Terreste- duas capsulas ao dia ",
      }
    });
    setisLoading(false)
  }
  useFocusEffect(
    React.useCallback(() => {
      loadTransactions();
    }, [])
  );

  return (
    <Container>

    { isLoading ?
        <LoadContainer>
          <ActivityIndicator color="red"
          size="large"
          />
        </LoadContainer> :
      <>
        <Header>
          <UserWrapper>
            <UserInfo>
              <Photo
                source={{uri :user.photo}}
              />
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
          ></HighlightCard>
          <HighlightCard
            type="down"
            title="Proximo medicamento"
            name={highlightData.medicamento.name}
            lastTransaction={highlightData.medicamento.lastTransaction}
          ></HighlightCard>
        </HighlightCards>
        <Transactions>
          <Title>Consultas Agendas</Title>

          <TransactionList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => <TransactionCard data={item} />}
          ></TransactionList>
        </Transactions>
    </>}
  </Container>
  );
}
