import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  Platform,
  Pressable,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../api/api';

export default function ReservationScreen({ route, navigation }) {
  const { slot } = route.params;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReserve = async () => {
    const dateStr = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD

    setLoading(true);
    try {
      await api.post('/reservations', {
        slotId: slot.id,
        date: dateStr,
      });

      Alert.alert('Sucesso', 'Reserva criada com sucesso!');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert(
        'Erro',
        err?.response?.data?.message || 'Falha ao criar reserva.'
      );
    } finally {
      setLoading(false);
    }
  };

  const onChange = (_, date) => {
    if (date) {
      setSelectedDate(date);
    }
    setShowPicker(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reservar Vaga {slot.name}</Text>
      <Text style={styles.label}>Data da reserva</Text>

      <Pressable onPress={() => setShowPicker(true)} style={styles.dateInput}>
        <Text>{selectedDate.toISOString().split('T')[0]}</Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          mode="date"
          value={selectedDate}
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={onChange}
        />
      )}

      <Button
        title={loading ? 'Reservando...' : 'Confirmar Reserva'}
        onPress={handleReserve}
        disabled={loading}
      />
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
  dateInput: {
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 16,
  },
});
