import React from "react";
import {View, Text} from "react-native";
import {
  Container,
  Title,
  Data,
  Footer,
  Category,
  Date,
  Icon,
  CategoryName,
} from "./styles";

import {categories} from "../../utils/categories";

interface Category {
  key?: string;
  name: string;
  icon: string;
}

export interface TransactionCardProps {
  type: "positive" | "negative";
  nomemedico: string;
  telefonemedico: string;
  endereco: string;
  data: string;
  sintoma: string;
}

interface Props {
  data: TransactionCardProps;
}
export function TransactionCard({data}: Props) {

  return (
    <Container>
      <Title>{data.nomemedico} {data.telefonemedico}</Title>
      <Data>{data.data}</Data>
      <Footer>
        <Date>{data.endereco}</Date>
      </Footer>
    </Container>
  );
}
