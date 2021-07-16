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
  id: string;
  nomemedico: string;
  telefonemedico: string;
  endereco: string;
  data: string;
  hora: string;
  sintoma: string;
}

interface Props {
  data: TransactionCardProps;
}
export function TransactionCard({data,  ...rest}: Props) {

  return (
    <Container {...rest}>
      <Title>{data.nomemedico} {data.telefonemedico}</Title>
      <Data>{data.data}</Data>
      <Data>{data.hora}</Data>
      <Footer>
        <Date>{data.endereco}</Date>
      </Footer>
    </Container>
  );
}
