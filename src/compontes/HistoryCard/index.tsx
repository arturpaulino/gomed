import React from "react";
import {View, Text} from "react-native";
import {
  Container,
  Title,
  Amount,

} from "./styles";

interface Props{
  title: string;
  amount: string;
  color: string;
 }

export function HistoryCard({ title,amount, color}: Props) {
  console.log("title", title)
  return (
    <Container color={color}>
      <Title>{title}</Title>
      <Amount>{amount} </Amount>
    </Container>
  );
}
