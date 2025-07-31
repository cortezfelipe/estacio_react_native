import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";

export default function ReservationsListScreen({ navigation }) {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await api.get("/reservations");
        setReservations(response.data);
      } catch (err) {
        console.error("Erro ao buscar reservas:", err);
        Alert.alert("Erro", "Não foi possível carregar as reservas.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchReservations();
    }
  }, [authLoading, user]);

  const handleDelete = async (id) => {
    Alert.alert("Confirmar", "Deseja excluir esta reserva?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/reservations/${id}`);
            setReservations((prev) => prev.filter((r) => r.id !== id));
          } catch (err) {
            Alert.alert("Erro", "Erro ao excluir reserva.");
          }
        },
      },
    ]);
  };

  const handleEdit = (reservation) => {
    navigation.navigate("EditReservation", { reservation });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.slotName}>{item.slot.name}</Text>
      <Text style={styles.date}>{item.date}</Text>

      {user?.role === "manager" && (
        <>
          <Text style={styles.userInfo}>
            Usuário: {item.user.name} ({item.user.email})
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => handleEdit(item)}
            >
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.buttonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

  if (loading || authLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma reserva encontrada.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F9FC",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  slotName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  userInfo: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    marginTop: 8,
  },
  secondaryButton: {
    backgroundColor: "#4CD964",
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 6,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginLeft: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    textAlign: "center",
    marginTop: 32,
    color: "#999",
    fontSize: 16,
  },
});
