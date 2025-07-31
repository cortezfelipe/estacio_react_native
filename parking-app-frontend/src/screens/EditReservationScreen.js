import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";

export default function EditReservationScreen({ route, navigation }) {
  const { user } = useContext(AuthContext);
  const { reservation } = route.params || {};

  const [date, setDate] = useState(reservation?.date || "");
  const [slotId, setSlotId] = useState(reservation?.slot?.id || null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "manager") {
      Alert.alert("Acesso negado", "Você não tem permissão.");
      navigation.goBack();
      return;
    }

    const fetchSlots = async () => {
      try {
        const response = await api.get("/slots");
        setSlots(response.data);
      } catch (err) {
        Alert.alert("Erro", "Erro ao carregar vagas.");
      }
    };

    fetchSlots();
  }, []);

  const handleSubmit = async () => {
    if (!slotId || !date) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);
      await api.put(`/reservations/${reservation.id}`, {
        date,
        slotId,
      });
      Alert.alert("Sucesso", "Reserva atualizada.");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Erro", "Erro ao atualizar reserva.");
    } finally {
      setLoading(false);
    }
  };

  if (!reservation || !reservation.slot) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "red" }}>Reserva inválida ou não encontrada.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Editar Reserva</Text>

        <Text style={styles.label}>Data (AAAA-MM-DD)</Text>
        <TextInput
          value={date}
          onChangeText={setDate}
          placeholder="AAAA-MM-DD"
          style={styles.input}
        />

        <Text style={styles.label}>Selecionar Vaga</Text>

        <FlatList
          data={slots}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.slotItem,
                item.id === slotId && styles.selectedSlot,
              ]}
              onPress={() => setSlotId(item.id)}
            >
              <Text style={styles.slotText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 10 }}
          keyboardShouldPersistTaps="handled"
        />

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Salvar Alterações</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F7F9FC",
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  slotItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  selectedSlot: {
    borderColor: "#007AFF",
    backgroundColor: "#E6F0FF",
  },
  slotText: {
    fontWeight: "500",
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
