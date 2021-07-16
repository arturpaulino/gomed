import React from "react";
import { FlatList } from "react-native";
import {Container, Header, Category, Icon, Title,  Name, Separator,
  Footer
} from "./styles";

import { categories} from "../../utils/categories"

import {Button} from "../../compontes/Form/Button"


interface Category{
  key: string;
  name: string;
}

interface Props {
  category: Category;
  setCategory: (category: Category) => void;
  closeCategory: () => void;
}

export function CategorySelect({ category, setCategory, closeCategory }: Props ) {

  function handlerCategorySelect( category:Category )
   {
    setCategory(category)
  }
  return (
    <Container>
      <Header>
        <Title>Categorias</Title>
      </Header>



      <Footer>
        <Button title="Selecionar" onPress={closeCategory}/>
      </Footer>
    </Container>
  );
}
