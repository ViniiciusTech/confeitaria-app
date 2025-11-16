import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from "react-native"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { getFirestore, doc, setDoc } from "firebase/firestore"
import { COLORS } from "../../constants/colors"

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [userType, setUserType] = useState("client") // cliente ou vendedor
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const auth = getAuth()
  const db = getFirestore()

  // Função para criar conta
  const handleSignup = async () => {
    // Validar campos
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Erro", "Por favor, preencha todos os campos")
      return
    }

    // Validar se as senhas são iguais
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não conferem")
      return
    }

    // Validar comprimento da senha
    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres")
      return
    }

    setLoading(true)
    try {
      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Salvar dados do usuário no Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        userType: userType,
        createdAt: new Date(),
      })

      Alert.alert("Sucesso", "Conta criada com sucesso!")
      // A navegação muda automaticamente via AuthContext
    } catch (error) {
      let mensagem = "Erro ao criar conta"
      if (error.code === "auth/email-already-in-use") {
        mensagem = "Este email já está cadastrado"
      } else if (error.code === "auth/invalid-email") {
        mensagem = "Email inválido"
      } else if (error.code === "auth/weak-password") {
        mensagem = "Senha muito fraca"
      }
      Alert.alert("Erro", mensagem)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Junte-se à nossa comunidade</Text>
      </View>

      {/* Formulário */}
      <View style={styles.form}>
        {/* Campo de nome */}
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

        {/* Campo de email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={!loading}
          />
        </View>

        {/* Campo de senha */}
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
              <Text style={styles.togglePassword}>{showPassword ? "Ocultar" : "Mostrar"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Campo de confirmar senha */}
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

        {/* Seleção de tipo de usuário */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tipo de Usuário</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[styles.typeButton, userType === "client" && styles.typeButtonActive]}
              onPress={() => setUserType("client")}
            >
              <Text style={[styles.typeButtonText, userType === "client" && styles.typeButtonTextActive]}>Cliente</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, userType === "vendor" && styles.typeButtonActive]}
              onPress={() => setUserType("vendor")}
            >
              <Text style={[styles.typeButtonText, userType === "vendor" && styles.typeButtonTextActive]}>
                Vendedor
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Botão de criar conta */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.buttonText}>Criar Conta</Text>}
        </TouchableOpacity>

        {/* Link para login */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>Fazer login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.gray,
  },
  form: {
    marginBottom: 40,
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
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.black,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.grayMedium,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.black,
  },
  togglePassword: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  typeContainer: {
    flexDirection: "row",
    gap: 12,
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
