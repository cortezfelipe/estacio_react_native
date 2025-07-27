import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';

/**
 * Screen that lists reservations.  Authenticated users see their own bookings,
 * while managers see all reservations with user details.
 */
export default function ReservationsListScreen() {
  const { user } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await api.get('/reservations');
        setReservations(response.data);
      } catch (err) {
        console.error(err);
        Alert.alert('Erro', 'Não foi possível carregar as reservas.');
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.slotName}>{item.slot.name}</Text>
      <Text style={styles.date}>{item.date}</Text>
      {user?.role === 'manager' && (
        <Text style={styles.userInfo}>Usuário: {item.user.name} ({item.user.email})</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma reserva encontrada.</Text>}
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
  item: {
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    marginVertical: 4,
    borderRadius: 4,
  },
  slotName: {
    fontSize: 16,
    fontWeight: '500',
  },
  date: {
    fontSize: 14,
    color: '#555',
  },
  userInfo: {
    fontSize: 12,
    color: '#777',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    textAlign: 'center',
    marginTop: 32,
    color: '#999',
  },
});