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

export interface TransactionCarReceitadProps {
     id: string;
    nomemedico: string;
    datareceita: string,
    diagnostico: string,
    receita: string,

}

interface Props {
  data: TransactionCarReceitadProps;
}
export function TransactionCardReceita({data,  ...rest}: Props) {

  return (
    <Container {...rest}>
      <Title>{data.nomemedico} </Title>
      <Data>{data.receita}</Data>
      <Data>{data.diagnostico}</Data>
      <Footer>
        <Date>{data.datareceita}</Date>
      </Footer>
    </Container>
  );
}
