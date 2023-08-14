import { Text, View } from "react-native";
import { Container, Slogan, Title } from "./styles";
import { StatusBar } from "expo-status-bar";
import backgroundImage from "../../assets/background.png";
import { Button } from "../../components/Button";

export function SignIn() {
  return (
    <Container source={backgroundImage}>
      <Title>Ignite Fleet</Title>
      <Slogan>Gestão de uso de veículos</Slogan>
      <Button title="Entrar com Google" />
    </Container>
  );
}
