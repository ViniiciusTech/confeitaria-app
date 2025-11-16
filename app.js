"use client"

// App.js - Arquivo principal da aplicação
// Este arquivo configura a navegação e autenticação da app

import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { View, ActivityIndicator } from "react-native"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { firebaseConfig } from "./constants/firebase"
import { COLORS } from "./constants/colors"

// Importar telas de autenticação
import LoginScreen from "./screens/auth/LoginScreen"
import SignupScreen from "./screens/auth/SignupScreen"

// Importar telas do cliente
import ProductsScreen from "./screens/client/ProductsScreen"
import ContactScreen from "./screens/client/ContactScreen"
import InfoScreen from "./screens/client/InfoScreen"
import LocationScreen from "./screens/client/LocationScreen"

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
          headerTitle: "Nossos Bolos",
        }}
      />
      <Tab.Screen
        name="Contato"
        component={ContactScreen}
        options={{
          tabBarLabel: "Contato",
          headerTitle: "Entre em Contato",
        }}
      />
      <Tab.Screen
        name="Localização"
        component={LocationScreen}
        options={{
          tabBarLabel: "Localização",
          headerTitle: "Nossa Localização",
        }}
      />
      <Tab.Screen
        name="Informações"
        component={InfoScreen}
        options={{
          tabBarLabel: "Informações",
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
          headerTitle: "Gerenciar Inventário",
        }}
      />
      <Tab.Screen
        name="Relatórios"
        component={ReportsScreen}
        options={{
          tabBarLabel: "Relatórios",
          headerTitle: "Vendas e Relatórios",
        }}
      />
    </Tab.Navigator>
  )
}

// Componente que verifica autenticação e renderiza a navegação apropriada
function AppContent() {
  const { user, userType, loading } = useAuth()

  // Mostrar carregamento enquanto verifica autenticação
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.white }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Se usuário está logado, mostrar navegação apropriada
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
