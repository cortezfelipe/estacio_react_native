import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import ReservationScreen from './src/screens/ReservationScreen';
import ReservationsListScreen from './src/screens/ReservationsListScreen';
import ManageSlotsScreen from './src/screens/ManageSlotsScreen';
import EditReservationScreen from './src/screens/EditReservationScreen';

const Stack = createNativeStackNavigator();

function AppRoutes() {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    // You could return a splash screen here
    return null;
  }
  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Vagas' }} />
          <Stack.Screen name="Reserve" component={ReservationScreen} options={{ title: 'Nova Reserva' }} />
          <Stack.Screen name="ReservationsList" component={ReservationsListScreen} options={{ title: 'Reservas' }} />
          <Stack.Screen name="ManageSlots" component={ManageSlotsScreen} options={{ title: 'Gerenciar Vagas' }} />
          <Stack.Screen name="EditReservation" component={EditReservationScreen} options={{ title: 'Editar Reserva' }} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
          <Stack.Screen name="Signup" component={SignupScreen} options={{ title: 'Cadastro' }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}