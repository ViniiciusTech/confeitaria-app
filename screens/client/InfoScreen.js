import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { COLORS } from '../../constants/colors'

export default function InfoScreen() {
    const openSocialMedia = (url) => {
        Linking.openURL(url).catch(() => {
            alert('Não foi possível abrir o link.');
        })
    }

    return (
    <ScrollView style={styles.container}>
      {/* Seção de apresentação */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre Nós</Text>
        <Text style={styles.description}>
          Bem-vindo à nossa confeitaria! Somos uma empresa familiar dedicada a criar bolos e doces deliciosos com
          ingredientes de qualidade premium.
        </Text>
      </View>

      {/* Seção de missão, visão e valores */}
      <View style={styles.section}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Missão</Text>
          <Text style={styles.cardText}>
            Criar momentos doces e memoráveis através de produtos de excelente qualidade.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Visão</Text>
          <Text style={styles.cardText}>Ser a confeitaria mais confiável e amada da região.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Valores</Text>
          <Text style={styles.cardText}>Qualidade, Honestidade, Dedicação e Amor pelo que fazemos.</Text>
        </View>
      </View>

      {/* Seção de especialidades */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nossas Especialidades</Text>
        <View style={styles.specialtyItem}>
          <Text style={styles.specialtyIcon}>🎂</Text>
          <Text style={styles.specialtyText}>Bolos Personalizados</Text>
        </View>
        <View style={styles.specialtyItem}>
          <Text style={styles.specialtyIcon}>🧁</Text>
          <Text style={styles.specialtyText}>Cupcakes Gourmet</Text>
        </View>
        <View style={styles.specialtyItem}>
          <Text style={styles.specialtyIcon}>🍰</Text>
          <Text style={styles.specialtyText}>Tortas Artesanais</Text>
        </View>
        <View style={styles.specialtyItem}>
          <Text style={styles.specialtyIcon}>🍪</Text>
          <Text style={styles.specialtyText}>Doces Variados</Text>
        </View>
      </View>

      {/* Seção de redes sociais */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Siga-nos nas Redes Sociais</Text>
        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton} onPress={() => openSocialMedia("https://instagram.com")}>
            <Text style={styles.socialIcon}>📷</Text>
            <Text style={styles.socialText}>Instagram</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} onPress={() => openSocialMedia("https://facebook.com")}>
            <Text style={styles.socialIcon}>👍</Text>
            <Text style={styles.socialText}>Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} onPress={() => openSocialMedia("https://tiktok.com")}>
            <Text style={styles.socialIcon}>🎵</Text>
            <Text style={styles.socialText}>TikTok</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Seção de agradecimento */}
      <View style={styles.section}>
        <View style={styles.thankYouBox}>
          <Text style={styles.thankYouText}>Obrigado por escolher nossa confeitaria! 💕</Text>
        </View>
      </View>
    </ScrollView>
  )
}