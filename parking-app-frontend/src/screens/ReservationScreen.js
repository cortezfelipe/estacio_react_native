import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import api from '../api/api';

/**
 * Screen allowing a user to reserve a specific slot for a particular date.
 * The slot is passed via navigation parameters.
 */
export default function ReservationScreen({ route, navigation }) {
  const { slot } = route.params;
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReserve = async () => {
    if (!date) {
      Alert.alert('Erro', 'Informe a data no formato YYYY-MM-DD');
      return;
    }
    setLoading(true);
    try {
      await api.post('/reservations', { slotId: slot.id, date });
      Alert.alert('Sucesso', 'Reserva criada com sucesso!');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', err?.response?.data?.message || 'Falha ao criar reserva.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reservar Vaga {slot.name}</Text>
      <Text style={styles.label}>Data (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder="2025-07-27"
      />
      <Button title={loading ? 'Reservando...' : 'Confirmar Reserva'} onPress={handleReserve} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
});