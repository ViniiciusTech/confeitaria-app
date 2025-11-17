
// App.js - Arquivo principal da aplicação
// Este arquivo configura a navegação e autenticação da app

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { useState } from "react"
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { COLORS } from "./constants/colors"
import { firebaseConfig } from "./constants/firebase"
import { AuthProvider, useAuth } from "./contexts/AuthContext"

// Importar telas de autenticação
import LoginScreen from "./screens/auth/LoginScreen"
import SignupScreen from "./screens/auth/SignupScreen"

// Importar telas do cliente
import ContactScreen from "./screens/client/ContactScreen"
import InfoScreen from "./screens/client/InfoScreen"
import LocationScreen from "./screens/client/LocationScreen"
import ProductsScreen from "./screens/client/ProductsScreen"

// Importar telas do vendedor
import InventoryScreen from "./screens/vendor/InventoryScreen"
import ReportsScreen from "./screens/vendor/ReportsScreen"

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function ClientNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.grayMedium,
        },
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Tab.Screen
        name="Produtos"
        component={ProductsScreen}
        options={{
          tabBarLabel: "Produtos",
          tabBarIcon: ({ color }) => <View style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 4 }} />,
          headerTitle: "Nossos Bolos",
        }}
      />
      <Tab.Screen
        name="Contato"
        component={ContactScreen}
        options={{
          tabBarLabel: "Contato",
          tabBarIcon: ({ color }) => <View style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 4 }} />,
          headerTitle: "Entre em Contato",
        }}
      />
      <Tab.Screen
        name="Localização"
        component={LocationScreen}
        options={{
          tabBarLabel: "Localização",
          tabBarIcon: ({ color }) => <View style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 4 }} />,
          headerTitle: "Nossa Localização",
        }}
      />
      <Tab.Screen
        name="Informações"
        component={InfoScreen}
        options={{
          tabBarLabel: "Informações",
          tabBarIcon: ({ color }) => <View style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 4 }} />,
          headerTitle: "Sobre Nós",
        }}
      />
    </Tab.Navigator>
  )
}

function VendorNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.grayMedium,
        },
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Tab.Screen
        name="Inventário"
        component={InventoryScreen}
        options={{
          tabBarLabel: "Inventário",
          tabBarIcon: ({ color }) => <View style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 4 }} />,
          headerTitle: "Gerenciar Inventário",
        }}
      />
      <Tab.Screen
        name="Relatórios"
        component={ReportsScreen}
        options={{
          tabBarLabel: "Relatórios",
          tabBarIcon: ({ color }) => <View style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 4 }} />,
          headerTitle: "Vendas e Relatórios",
        }}
      />
    </Tab.Navigator>
  )
}

// Componente que verifica autenticação e renderiza a navegação apropriada
function AppContent() {
  const { user, userType, loading } = useAuth()
  const [forceShow, setForceShow] = useState(false)

  console.log("AppContent - user:", !!user, "userType:", userType, "loading:", loading, "forceShow:", forceShow)

  // Mostrar carregamento enquanto verifica autenticação
  if (loading && !forceShow) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.white, padding: 20 }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 20, fontSize: 16, color: COLORS.black, textAlign: "center" }}>
          Carregando...
        </Text>
        <TouchableOpacity 
          style={{ marginTop: 20, padding: 12, backgroundColor: COLORS.primary, borderRadius: 8 }}
          onPress={() => setForceShow(true)}
        >
          <Text style={{ color: COLORS.white, fontWeight: "bold", fontSize: 14 }}>
            Continuar mesmo assim
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user && userType ? (
          // Se usuário está logado E userType foi carregado, mostrar navegação apropriada
          userType === "vendor" ? (
            <Stack.Screen name="VendorApp" component={VendorNavigator} />
          ) : (
            <Stack.Screen name="ClientApp" component={ClientNavigator} />
          )
        ) : (
          // Se não está logado, mostrar telas de autenticação
          <Stack.Group screenOptions={{ animationEnabled: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

// Exportar componente principal
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  )
}
