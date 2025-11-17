import { useState } from "react"
import { Alert, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { COLORS } from "../../constants/colors"
import { useAuth } from "../../contexts/AuthContext"

export default function ContactScreen() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const { logout } = useAuth()

  const handleLogout = async () => {
    Alert.alert("Logout", "Tem certeza que deseja sair?", [
      { text: "Cancelar", onPress: () => {}, style: "cancel" },
      { text: "Sair", onPress: async () => {
        await logout()
      }, style: "destructive" }
    ])
  }

  // Função para enviar mensagem via WhatsApp
  const handleWhatsApp = () => {
    const phoneNumber = "5511999999999" 
    const url = `https://wa.me/${phoneNumber}?text=Olá, gostaria de fazer um pedido!`
    Linking.openURL(url).catch(() => {
      Alert.alert("Erro", "Não foi possível abrir o WhatsApp")
    })
  }

  // Função para enviar email
  const handleEmail = () => {
    const email = "contato@confeitaria.com" 
    const subject = "Contato - Confeitaria"
    const body = "Olá, gostaria de fazer um pedido!"
    const url = `mailto:${email}?subject=${subject}&body=${body}`
    Linking.openURL(url).catch(() => {
      Alert.alert("Erro", "Não foi possível abrir o email")
    })
  }

  // Função para enviar formulário
  const handleSubmitForm = () => {
    if (!name || !email || !message) {
      Alert.alert("Erro", "Por favor, preencha todos os campos")
      return
    }
    Alert.alert("Sucesso", "Mensagem enviada com sucesso!")
    setName("")
    setEmail("")
    setMessage("")
  }

  return (
    <ScrollView style={styles.container}>
      {/* Botão de Logout */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Seção de contato rápido */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Formas de Contato</Text>

        {/* Botão WhatsApp */}
        <TouchableOpacity style={styles.contactButton} onPress={handleWhatsApp}>
          <Text style={styles.contactButtonIcon}>💬</Text>
          <View style={styles.contactButtonContent}>
            <Text style={styles.contactButtonTitle}>WhatsApp</Text>
            <Text style={styles.contactButtonSubtitle}>(11) 99999-9999</Text>
          </View>
        </TouchableOpacity>

        {/* Botão Email */}
        <TouchableOpacity style={styles.contactButton} onPress={handleEmail}>
          <Text style={styles.contactButtonIcon}>📧</Text>
          <View style={styles.contactButtonContent}>
            <Text style={styles.contactButtonTitle}>Email</Text>
            <Text style={styles.contactButtonSubtitle}>contato@confeitaria.com</Text>
          </View>
        </TouchableOpacity>

        {/* Informações de horário */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Horário de Funcionamento</Text>
          <Text style={styles.infoText}>Segunda a Sexta: 9h às 18h</Text>
          <Text style={styles.infoText}>Sábado: 9h às 14h</Text>
          <Text style={styles.infoText}>Domingo: Fechado</Text>
        </View>
      </View>

      {/* Seção de formulário */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Envie uma Mensagem</Text>

        {/* Campo de nome */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome</Text>
          <TextInput style={styles.input} placeholder="Seu nome" value={name} onChangeText={setName} />
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
          />
        </View>

        {/* Campo de mensagem */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mensagem</Text>
          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Sua mensagem..."
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Botão de envio */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitForm}>
          <Text style={styles.submitButtonText}>Enviar Mensagem</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 16,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.grayLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  contactButtonIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  contactButtonContent: {
    flex: 1,
  },
  contactButtonTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.black,
  },
  contactButtonSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: COLORS.grayLight,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  inputContainer: {
    marginBottom: 16,
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
  messageInput: {
    textAlignVertical: "top",
    paddingTop: 12,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
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
