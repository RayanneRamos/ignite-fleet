import { TextInputProps } from "react-native";
import { Container, Input, Label } from "./styles";
import { useTheme } from "styled-components/native";

type Props = TextInputProps & {
  label: string;
};

export function TextAreaInput({ label, ...rest }: Props) {
  const theme = useTheme();

  return (
    <Container>
      <Label>{label}</Label>
      <Input
        placeholderTextColor={theme.COLORS.GRAY_400}
        multiline
        autoCapitalize="setences"
        {...rest}
      />
    </Container>
  );
}
