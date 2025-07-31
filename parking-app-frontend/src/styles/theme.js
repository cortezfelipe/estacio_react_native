// src/styles/theme.js
import { StyleSheet } from 'react-native';

export const theme = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fc',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    width: '100%',
    marginTop: -40,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 12,
  },
  textLink: {
    marginTop: 24,
    color: '#444',
  },
  link: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});
