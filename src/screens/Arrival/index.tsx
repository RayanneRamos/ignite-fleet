import { useNavigation, useRoute } from "@react-navigation/native";
import {
  AsyncMessage,
  Container,
  Content,
  Description,
  Footer,
  Label,
  LicensePlate,
} from "./styles";
import { Header } from "../../components/Header";
import { Button } from "../../components/Button";
import { ButtonIcon } from "../../components/ButtonIcon";
import { X } from "phosphor-react-native";
import { useObject, useRealm } from "../../libs/realm";
import { Historic } from "../../libs/realm/schemas/Historic";
import { BSON } from "realm";
import { Alert } from "react-native";
import { useEffect, useState } from "react";
import { getLastAsyncTimestamp } from "../../libs/asyncStorage/syncStorage";
import { stopLocationTask } from "../../tasks/backgroundLocationTask";
import { getStorageLocations } from "../../libs/asyncStorage/locationStorage";
import { LatLng } from "react-native-maps";
import { Maps } from "../../components/Maps";
import { Locations } from "../../components/Locations";

type RouteParamsProps = {
  id: string;
};

export function Arrival() {
  const route = useRoute();
  const { id } = route.params as RouteParamsProps;
  const historic = useObject(Historic, new BSON.UUID(id) as unknown as string);
  const realm = useRealm();
  const { goBack } = useNavigation();
  const title = historic?.status === "departure" ? "Chegada" : "Detalhes";
  const [dataNotSynced, setDataNotSynced] = useState(false);
  const [coordinates, setCoordinates] = useState<LatLng[]>([]);

  function handleRemoveVehicleUsage() {
    Alert.alert("Cancelar", "Cancelar a utilização do veículo", [
      {
        text: "Não",
        style: "cancel",
      },
      {
        text: "Sim",
        onPress: () => removeVehicleUsage(),
      },
    ]);
  }

  async function removeVehicleUsage() {
    realm.write(() => {
      realm.delete(historic);
    });

    await stopLocationTask();

    goBack();
  }

  async function handleArrivalRegister() {
    try {
      if (!historic) {
        return Alert.alert(
          "Error",
          "Não foi possível obter os dados para registrar a chegada do veículo."
        );
      }

      const locations = await getStorageLocations();

      realm.write(() => {
        (historic.status = "arrival"),
          (historic.updated_at = new Date()),
          historic.coords.push(...locations);
      });

      await stopLocationTask();

      Alert.alert("Chegada", "Chegada registrada com sucesso!");
      goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Não foi possível registrar a chegada do veículo.");
    }
  }

  async function getLocationInfo() {
    if (!historic) {
      return;
    }

    const lastSync = await getLastAsyncTimestamp();
    const updatedAt = historic!.updated_at.getTime();
    setDataNotSynced(updatedAt > lastSync);

    if (historic?.status === "departure") {
      const locationsStorage = await getStorageLocations();
      setCoordinates(locationsStorage);
    } else {
      setCoordinates(historic?.coords ?? []);
    }
  }

  useEffect(() => {
    getLocationInfo();
  }, [historic]);

  return (
    <Container>
      <Header title={title} />
      {coordinates.length > 0 && <Maps coordinates={coordinates} />}
      <Content>
        <Locations
          departure={{ label: "", description: "" }}
          arrival={{ label: "", description: "" }}
        />
        <Label>Placa do veículo</Label>
        <LicensePlate>{historic?.license_plate}</LicensePlate>
        <Label>Finalidade</Label>
        <Description>{historic?.description}</Description>
      </Content>
      {historic?.status === "departure" && (
        <Footer>
          <ButtonIcon icon={X} onPress={handleRemoveVehicleUsage} />
          <Button title="Registrar Chegada" onPress={handleArrivalRegister} />
        </Footer>
      )}
      {dataNotSynced && (
        <AsyncMessage>
          Sincronização da
          {historic?.status === "departure" ? "partida" : "chegada"} pendente.
        </AsyncMessage>
      )}
    </Container>
  );
}
