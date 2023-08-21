import { TouchableOpacity } from "react-native";
import { Container, Greeting, Message, Name, Picture } from "./styles";
import { Power } from "phosphor-react-native";
import theme from "../../theme";
import { useUser } from "@realm/react";

export function HomeHeader() {
  const user = useUser();

  return (
    <Container>
      <Picture
        source={{ uri: user.profile.pictureUrl }}
        placeholder="L184i9offjof00ayf7ay~qjtj[jt"
      />
      <Greeting>
        <Message>Olá</Message>
        <Name>{user.profile.name}</Name>
      </Greeting>
      <TouchableOpacity>
        <Power size={32} color={theme.COLORS.GRAY_400} />
      </TouchableOpacity>
    </Container>
  );
}
