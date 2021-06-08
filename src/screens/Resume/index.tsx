import React, {useState, useEffect} from "react";
import {Alert} from "react-native"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import {
  Container,
  Header,
  Title,
  LoadContainer,
  Content,
  ChatContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
} from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addMonths , subMonths ,format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {useFocusEffect} from "@react-navigation/native";

import {VictoryPie} from "victory-native";
import {categories} from "../../utils/categories";
import {ActivityIndicator} from "react-native";
import {HistoryCard} from "../../compontes/HistoryCard";

import {  useAuth } from "../../hooks/auth";

export interface TransactionData {
  type: "positive" | "negative";
  name: string;
  amount: string;
  category: string;
  date: string;
}

export interface categoryData {
  key: string;
  name: string;
  total: string;
  totalPie: number;
  color: string;
  percent: string;
}

export function Resume() {
  const  [selectDate, setSelectDate] = useState(new Date());
  const [isLoading, setisLoading] = useState(false);
  const [totalByResumo, setTotalByResumo] = useState<categoryData[]>([]);
  const  { user } = useAuth()
  function handlDateChange(action: 'next' | 'prev') {
    if (action === 'next') {
      setSelectDate( addMonths(selectDate,1))
    } else {
      setSelectDate(subMonths(selectDate, 1))
    }
  }



  async function loadTransactions() {
    setisLoading(true);


    const dataKey = `@gofinances:transctions_users:${user.id}`
    const data = await AsyncStorage.getItem(dataKey);
    const currentData = data ? JSON.parse(data) : [];


    const totalByCategory: categoryData[] = [];
    const expensives = currentData.filter((item: TransactionData)=>
      new Date(item.date).getMonth() ===  selectDate.getMonth() &&
      new Date(item.date).getFullYear() ===  selectDate.getFullYear()
    )


    const expensivesTotal = expensives.reduce((total: number, item: TransactionData) => {
       return total += Number(item.amount);
    },0)

    categories.forEach((category) => {
      let categorySum = 0;

      expensives.forEach((expensive: TransactionData) => {
        if (expensive.category == category.key) {
          categorySum += Number(expensive.amount);
        }
      });
      if (categorySum > 0) {

        const percent = `${(categorySum / expensivesTotal *100).toFixed(0)}%`
        const total = categorySum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
        totalByCategory.push({
          key: category.key,
          name: category.name,
          total,
          totalPie: categorySum,
          color: category.color,
          percent: percent,
        });
      }
    });
    setTotalByResumo(totalByCategory);

    console.log("totalByCategory", totalByCategory);
    setisLoading(false);
  }

  useFocusEffect(
    React.useCallback(() => {
      loadTransactions();
    }, [selectDate])
  );



  return (
    <Container>
     <Header>
        <Title>Resumo por categoria</Title>
        </Header>
        <MonthSelect>
              <MonthSelectButton
              onPress={  ()=> handlDateChange('prev')}

              >
                <MonthSelectIcon name="chevron-left"/>
              </MonthSelectButton>

              <Month>{ format(selectDate, 'MMMM, yyyy', { locale: ptBR}) }</Month>

              <MonthSelectButton onPress={ ()=> handlDateChange('next') } >
                <MonthSelectIcon name="chevron-right"/>
              </MonthSelectButton>

            </MonthSelect>

      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color="red" size="large" />
        </LoadContainer>
      ) : (
        <>
          <Content
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingHorizontal:24,
               paddingBottom: useBottomTabBarHeight()
            }}


          >

            <ChatContainer>
            <VictoryPie
            data={totalByResumo}
            colorScale={ totalByResumo.map(item => item.color) }
            style={{
              labels: {
                fontSize: 18,
                fontWeight:'bold',
              }
            }}
            labelRadius={50}
            x="percent" y="totalPie" />
            </ChatContainer>
            {totalByResumo.map((item) => (
              <HistoryCard
                key={item.key}
                title={item.name}
                amount={item.total}
                color={item.color}
              />
            ))}
          </Content>
        </>
      )}
    </Container>
  );
}
