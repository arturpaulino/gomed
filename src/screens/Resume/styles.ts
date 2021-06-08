import styled from 'styled-components/native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { Feather } from "@expo/vector-icons";
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { BorderlessButton }   from "react-native-gesture-handler"

export const Container = styled.View`
  flex: 1;
   background: ${({ theme }) => theme.colors.background};

`;
export const Header = styled.View`
    width:100%;
    height: ${RFValue(113)}px;
    background: ${({ theme }) => theme.colors.primary};

    align-items: center;
    justify-content: center;
    padding-bottom: 19px;
`;

export const Title = styled.Text`
 font-family: ${({ theme }) => theme.fonts.regular};
 font-size: ${RFValue(18)}px;
 color: ${({ theme }) => theme.colors.shape};

`;


export const Form = styled.View`
    flex: 1;
    justify-content: space-between;
    width: 100%;

    padding: 24px;
`;
export const Fields = styled.View``;

export const TransactionTypes = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-top: 8px;
`;

export const LoadContainer = styled.View`
flex:1;
justify-content: center;
align-items: center;
`;

export const Content = styled.ScrollView``;


export const ChatContainer = styled.View`
    width: 100%;
    align-items: center;
`;

export const MonthSelect = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 24px;
`;
export const MonthSelectButton = styled.TouchableOpacity`
`;

export const MonthSelectIcon = styled(Feather)`
 font-size: ${RFValue(30)}px;
`;
export const Month = styled.Text`
 font-family: ${({ theme }) => theme.fonts.regular};
 font-size: ${RFValue(20)}px;

`;
