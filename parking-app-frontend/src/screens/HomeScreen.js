import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';

export default function HomeScreen({ navigation }) {
  const { user, signOut } = useContext(AuthContext);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await api.get('/slots');
        setSlots(response.data);
      } catch (err) {
        console.error(err);
        Alert.alert('Erro', 'Falha ao carregar vagas.');
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.slotItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.slotName}>{item.name}</Text>
        {item.description ? (
          <Text style={styles.slotDescription}>{item.description}</Text>
        ) : null}
      </View>
      <Button
        title="Reservar"
        onPress={() => navigation.navigate('Reserve', { slot: item })}
      />
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
      <View style={styles.header}>
        <Text style={styles.title}>Olá, {user?.name}</Text>
        <Button title="Sair" onPress={signOut} />
      </View>

      <FlatList
        data={slots}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={
          <Text style={styles.subtitle}>Vagas disponíveis</Text>
        }
        ListFooterComponent={
          <View style={styles.footerButtons}>
            <Button
              title="Minhas Reservas"
              onPress={() => navigation.navigate('ReservationsList')}
            />
            {user?.role === 'manager' && (
              <>
                <View style={styles.buttonSpacing} />
                <Button
                  title="Gerenciar Vagas"
                  onPress={() => navigation.navigate('ManageSlots')}
                />
                <View style={styles.buttonSpacing} />
                <Button
                  title="Todas Reservas"
                  onPress={() => navigation.navigate('ReservationsList')}
                />
              </>
            )}
          </View>
        }
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  slotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  slotDescription: {
    fontSize: 12,
    color: '#666',
  },
  footerButtons: {
    marginTop: 24,
    paddingVertical: 16,
  },
  buttonSpacing: {
    height: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
