import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { getFirestore, doc, setDoc } from "firebase/firestore"
import { COLORS } from "../../constants/colors"

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [userType, setUserType] = useState("client")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const auth = getAuth()
  const db = getFirestore()

  // Criar conta
  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Erro", "Por favor, preencha todos os campos")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não conferem")
      return
    }

    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres")
      return
    }

    setLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        userType,
        createdAt: new Date(),
      })

      Alert.alert("Sucesso", "Conta criada com sucesso!")
    } catch (error) {
      let msg = "Erro ao criar conta"

      if (error.code === "auth/email-already-in-use") msg = "Email já está em uso"
      if (error.code === "auth/invalid-email") msg = "Email inválido"
      if (error.code === "auth/weak-password") msg = "Senha muito fraca"

      Alert.alert("Erro", msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.card}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Junte-se à nossa comunidade</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Nome */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Seu nome"
              value={name}
              onChangeText={setName}
              editable={!loading}
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!loading}
              autoCapitalize="none"
            />
          </View>

          {/* Senha */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Sua senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.togglePassword}>
                  {showPassword ? "Ocultar" : "Mostrar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirmar Senha */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              editable={!loading}
            />
          </View>

          {/* Tipo de usuário */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tipo de Usuário</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[styles.typeButton, userType === "client" && styles.typeButtonActive]}
                onPress={() => setUserType("client")}
              >
                <Text
                  style={[styles.typeButtonText, userType === "client" && styles.typeButtonTextActive]}
                >
                  Cliente
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.typeButton, userType === "vendor" && styles.typeButtonActive]}
                onPress={() => setUserType("vendor")}
              >
                <Text
                  style={[styles.typeButtonText, userType === "vendor" && styles.typeButtonTextActive]}
                >
                  Vendedor
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Botão */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Criar Conta</Text>
            )}
          </TouchableOpacity>

          {/* Ir para login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem conta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.link}> Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

// 🔥 Estilos padronizados (100% iguais ao Login)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },

  card: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },

  header: {
    marginBottom: 40,
    alignItems: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
  },

  form: {
    width: "100%",
  },

  inputContainer: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.grayMedium,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "web" ? 14 : 12,
    fontSize: 14,
    color: COLORS.black,
    width: "100%",
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.grayMedium,
    borderRadius: 8,
    paddingHorizontal: 12,
    width: "100%",
  },

  passwordInput: {
    flex: 1,
    paddingVertical: Platform.OS === "web" ? 14 : 12,
    fontSize: 14,
    color: COLORS.black,
  },

  togglePassword: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "600",
    paddingLeft: 8,
  },

  typeContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },

  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.grayMedium,
    borderRadius: 8,
    alignItems: "center",
  },

  typeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  typeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.gray,
  },

  typeButtonTextActive: {
    color: COLORS.white,
  },

  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    flexWrap: "wrap",
  },

  footerText: {
    color: COLORS.gray,
    fontSize: 14,
  },

  link: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "bold",
  },
})
