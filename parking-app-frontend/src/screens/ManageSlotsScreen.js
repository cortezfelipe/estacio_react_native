import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

export default function ManageSlotsScreen() {
  const { user } = useContext(AuthContext);
  const [slots, setSlots] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = async () => {
    try {
      setLoading(true);
      const response = await api.get('/slots');
      setSlots(response.data);
    } catch (err) {
      Alert.alert('Erro', 'Erro ao carregar vagas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await api.post('/slots', { name, description });
      setName('');
      setDescription('');
      loadSlots();
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.message || 'Erro ao criar vaga');
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/slots/${editingId}`, { name, description });
      setName('');
      setDescription('');
      setEditingId(null);
      loadSlots();
    } catch (err) {
      Alert.alert('Erro', 'Erro ao atualizar vaga');
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
      Alert.alert('Erro', 'Erro ao deletar vaga');
    }
  };

  if (!user?.isManager) {
    return (
      <View style={styles.centered}>
        <Text>Você não tem permissão para gerenciar vagas.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {editingId ? 'Editar Vaga' : 'Criar Nova Vaga'}
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
      <Button
        title={editingId ? 'Atualizar Vaga' : 'Criar Vaga'}
        onPress={editingId ? handleUpdate : handleCreate}
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={slots}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.slotItem}>
              <Text style={styles.slotName}>{item.name}</Text>
              <Text>{item.description}</Text>
              <View style={styles.actions}>
                <Button title="Editar" onPress={() => handleEdit(item)} />
                <Button title="Excluir" color="red" onPress={() => handleDelete(item.id)} />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10, borderRadius: 4 },
  slotItem: { padding: 12, marginVertical: 6, borderWidth: 1, borderColor: '#eee', borderRadius: 6 },
  slotName: { fontWeight: 'bold', fontSize: 16 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
