import * as Location from "expo-location"
import { useEffect, useState } from "react"
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "../../constants/colors"
import { useAuth } from "../../contexts/AuthContext"

export default function LocationScreen() {
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const { logout } = useAuth()

  // Coordenadas da confeitaria 
  const bakeryLocation = {
    latitude: -23.5505,
    longitude: -46.6333,
    name: "Confeitaria Delícia",
    address: "Rua das Flores, 123 - São Paulo, SP",
  }

  // Solicitar permissão de localização
  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== "granted") {
          Alert.alert("Permissão negada", "Não foi possível acessar sua localização")
          setLoading(false)
          return
        }

        const userLocation = await Location.getCurrentPositionAsync({})
        setLocation(userLocation.coords)
      } catch (error) {
        console.log("Erro ao obter localização:", error)
      } finally {
        setLoading(false)
      }
    }

    getLocation()
  }, [])



const handleLogout = async () => {
  if (Platform.OS === "web") {
    const confirmed = window.confirm("Tem certeza que deseja sair?")
    if (confirmed) {
      await logout()
    }
  } else {
    Alert.alert("Logout", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", onPress: async () => await logout(), style: "destructive" }
    ])
  }
}


  // Função para abrir no Google Maps
  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/${bakeryLocation.latitude},${bakeryLocation.longitude}`
    Linking.openURL(url).catch(() => {
      Alert.alert("Erro", "Não foi possível abrir o Google Maps")
    })
  }

  // Função para abrir no Apple Maps
  const openAppleMaps = () => {
    const url = `maps://maps.apple.com/?q=${bakeryLocation.name}&ll=${bakeryLocation.latitude},${bakeryLocation.longitude}`
    Linking.openURL(url).catch(() => {
      Alert.alert("Erro", "Não foi possível abrir o Apple Maps")
    })
  }

  return (
    <ScrollView style={styles.container}>
      {/* Botão de Logout */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Informações da localização */}
      <View style={styles.infoSection}>
        <Text style={styles.title}>{bakeryLocation.name}</Text>
        <Text style={styles.address}>{bakeryLocation.address}</Text>
      </View>

      {/* Placeholder do mapa */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapPlaceholderText}>📍 Mapa</Text>
        <Text style={styles.mapPlaceholderSubtext}>Latitude: {bakeryLocation.latitude}</Text>
        <Text style={styles.mapPlaceholderSubtext}>Longitude: {bakeryLocation.longitude}</Text>
      </View>

      {/* Botões de navegação */}
      <View style={styles.buttonsSection}>
        <TouchableOpacity style={styles.button} onPress={openGoogleMaps}>
          <Text style={styles.buttonIcon}>🗺️</Text>
          <Text style={styles.buttonText}>Google Maps</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={openAppleMaps}>
          <Text style={styles.buttonIcon}>🗺️</Text>
          <Text style={styles.buttonText}>Apple Maps</Text>
        </TouchableOpacity>
      </View>

      {/* Informações adicionais */}
      <View style={styles.detailsSection}>
        <Text style={styles.detailsTitle}>Informações Adicionais</Text>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Telefone:</Text>
          <Text style={styles.detailValue}>(11) 99999-9999</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={styles.detailValue}>contato@confeitaria.com</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Horário:</Text>
          <Text style={styles.detailValue}>Seg-Sex: 9h às 18h</Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  infoSection: {
    padding: 16,
    backgroundColor: COLORS.grayLight,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayMedium,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: COLORS.gray,
  },
  mapPlaceholder: {
    height: 250,
    backgroundColor: COLORS.grayLight,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.grayMedium,
  },
  mapPlaceholderText: {
    fontSize: 48,
    marginBottom: 8,
  },
  mapPlaceholderSubtext: {
    fontSize: 12,
    color: COLORS.gray,
  },
  buttonsSection: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  detailsSection: {
    padding: 16,
    marginTop: 16,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.black,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.gray,
  },
  logoutContainer: {
    padding: 12,
    backgroundColor: COLORS.grayLight,
    alignItems: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayMedium,
  },
  logoutButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 14,
  },
})
