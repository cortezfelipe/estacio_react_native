import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function ManageSlotsScreen() {
  const { user } = useContext(AuthContext);
  const [slots, setSlots] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = async () => {
    try {
      setLoading(true);
      const response = await api.get("/slots");
      setSlots(response.data);
    } catch (err) {
      Alert.alert("Erro", "Erro ao carregar vagas");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await api.put(`/slots/${editingId}`, { name, description });
      } else {
        await api.post("/slots", { name, description });
      }
      setName("");
      setDescription("");
      setEditingId(null);
      loadSlots();
    } catch (err) {
      Alert.alert("Erro", err.response?.data?.message || "Erro ao salvar vaga");
    }
  };

  const handleEdit = (slot) => {
    setName(slot.name);
    setDescription(slot.description);
    setEditingId(slot.id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/slots/${id}`);
      loadSlots();
    } catch (err) {
      Alert.alert("Erro", "Erro ao deletar vaga");
    }
  };

  if (!user?.isManager) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>Você não tem permissão para gerenciar vagas.</Text>
      </View>
    );
  }

  const renderSlot = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.slotName}>{item.name}</Text>
      <Text style={styles.slotDescription}>{item.description}</Text>
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
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={slots}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderSlot}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.container}>
              <Text style={styles.title}>
                {editingId ? "Editar Vaga" : "Criar Nova Vaga"}
              </Text>
              <TextInput
                placeholder="Nome da vaga"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
              <TextInput
                placeholder="Descrição"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
              />
              <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
                <Text style={styles.buttonText}>
                  {editingId ? "Atualizar Vaga" : "Criar Vaga"}
                </Text>
              </TouchableOpacity>
              <Text style={styles.subtitle}>Vagas cadastradas</Text>
            </View>
          }
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F7F9FC",
  },
  listContent: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    color: "#1E1E1E",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  secondaryButton: {
    backgroundColor: "#007bff",
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 20,
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
  slotDescription: {
    fontSize: 13,
    color: "#6B7280",
  },
  actions: {
    flexDirection: "row",
    marginTop: 12,
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
  permissionText: {
    fontSize: 16,
    color: "#999",
  },
});
