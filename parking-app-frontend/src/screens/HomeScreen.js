import React, { useContext, useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";

export default function HomeScreen({ navigation }) {
  const { user, signOut } = useContext(AuthContext);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchSlots = async () => {
        try {
          const response = await api.get("/slots");
          setSlots(response.data);
        } catch (err) {
          console.error(err);
          Alert.alert("Erro", "Falha ao carregar vagas.");
        } finally {
          setLoading(false);
        }
      };

      fetchSlots();
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.slotName}>{item.name}</Text>
        {item.description ? (
          <Text style={styles.slotDescription}>{item.description}</Text>
        ) : null}
      </View>
      <TouchableOpacity
        style={styles.reserveButton}
        onPress={() => navigation.navigate("Reserve", { slot: item })}
      >
        <Text style={styles.buttonText}>Reservar</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <FlatList
      data={slots}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      ListHeaderComponent={
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Olá, {user?.name}</Text>
            <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
              <Text style={styles.buttonText}>Sair</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Vagas disponíveis</Text>
        </View>
      }
      ListFooterComponent={
        <View style={[styles.container, styles.footerButtons]}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("ReservationsList")}
          >
            <Text style={styles.buttonText}>Minhas Reservas</Text>
          </TouchableOpacity>

          {user?.role === "manager" && (
            <>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate("ManageSlots")}
              >
                <Text style={styles.buttonText}>Gerenciar Vagas</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate("ReservationsList")}
              >
                <Text style={styles.buttonText}>Todas Reservas</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      }
      contentContainerStyle={{ paddingBottom: 30 }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#F7F9FC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
  },
  signOutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
    color: "#333",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
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
  slotDescription: {
    fontSize: 13,
    color: "#6B7280",
  },
  reserveButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginLeft: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  footerButtons: {
    marginTop: 30,
    gap: 12,
  },
  secondaryButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
