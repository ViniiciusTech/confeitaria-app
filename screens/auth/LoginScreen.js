import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { COLORS } from "../../constants/colors"


export default function LoginScreen({ navigation }) {
    const [email, setEmail ] = useState("")  // email
    const [password, setPassword ] = useState("")  // senha
    const [loading, setLoading ] = useState(false)  // fazendo login
    const [showPassword, setShowPassword ] = useState(false)  // mostrar senha

    const auth = getAuth() // inicializa o auth do firebase

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Erro", "Por favor, preencha todos os campos.")
            return
        }

        setLoading(true)
        try{
            // login com firebase
            await signInWithEmailAndPassword(auth, email, password)

        } catch (error) {
            let mensagem = "Erro ao fazer login"

            if (error.code === "auth/user-not-found") {
                mensagem = "Usuário não encontrado."
            } else if (error.code === "auth/wrong-password") {
                mensagem = "Senha incorreta."
            } else if (error.code === "auth/invalid-email") {
                mensagem = "Email inválido."
            }

            Alert.alert("Erro", mensagem)
        } finally {
            // sempre sera executado
            setLoading(false)
        }
        
    }
        
   return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Cabeçalho  */}
      <View style={styles.header}>
        <Text style={styles.title}>Confeitaria</Text>
        <Text style={styles.subtitle}>Bem-vindo de volta!</Text>
      </View>

      {/* Formulário  */}
      <View style={styles.form}>
        {/* Input de email  */}
        <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                editable={!loading}  // desabilita enquanto carrega 
            />
          </View>

        {/* Input de senha  */}
        <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Sua senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword} // mostra ou esconde a senha
                    editable={!loading}  // desabilita enquanto carrega
                />
                {/* Botão para mostrar/ocultar senha  */}
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Text style={styles.togglePassword}>
                        {showPassword ? "Ocultar" : "Mostrar"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>

        {/* Botão de login  */}
        <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading} // desabilita o botão enquanto carrega
        >
            {loading ? (
                // spinner 
            <ActivityIndicator color={COLORS.white} />
            ) : (
            <Text style={styles.buttonText}>Entrar</Text>
            )}
        </TouchableOpacity>

        {/* Link para tela de cadastro  */}
        <View style={styles.footer}>
            <Text style={styles.footerText}>Não tem uma conta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.link}> Criar conta</Text>
            </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
   )
}

// Estilos do componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: "center",
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
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
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
    paddingLeft: 8,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    minHeight: 50,
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