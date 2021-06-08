import React from "react";
import { RectButtonProperties } from "react-native-gesture-handler";
import { SvgProps } from "react-native-svg";

import {Container, Title, ImagemContainer} from "./styles";

interface Props extends RectButtonProperties  {
  title: string;
  svg: React.FC<SvgProps>;
}

export function SignInSocialBt({title, svg: Svg, ...rest }: Props) {
  return (
    <Container {...rest}>
      <ImagemContainer>
        <Svg/>
      </ImagemContainer>
      <Title>{title}</Title>
    </Container>
  );
}
