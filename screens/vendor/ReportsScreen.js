
// screens/vendor/ReportsScreen.js - Tela de relatórios
// Exibe estatísticas e relatórios de vendas

import { collection, getDocs, getFirestore } from "firebase/firestore"
import { useEffect, useState } from "react"
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native"
import { COLORS } from "../../constants/colors"

export default function ReportsScreen() {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const db = getFirestore()

  // Buscar vendas do Firestore
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "sales"))
        const salesData = []
        querySnapshot.forEach((doc) => {
          salesData.push({
            id: doc.id,
            ...doc.data(),
          })
        })
        setSales(salesData)
      } catch (error) {
        console.log("Erro ao buscar vendas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSales()
  }, [])

  // Calcular total de vendas
  const totalSales = sales.reduce((sum, sale) => sum + (sale.total || 0), 0)

  // Calcular número de pedidos
  const totalOrders = sales.length

  // Calcular ticket médio
  const averageTicket = totalOrders > 0 ? totalSales / totalOrders : 0

  // Produto mais vendido
  const topProduct = sales.length > 0 ? sales[0].product : "N/A"

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      {/* Seção de estatísticas principais */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Estatísticas Gerais</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total de Vendas</Text>
            <Text style={styles.statValue}>R$ {totalSales.toFixed(2)}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Número de Pedidos</Text>
            <Text style={styles.statValue}>{totalOrders}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Ticket Médio</Text>
            <Text style={styles.statValue}>R$ {averageTicket.toFixed(2)}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Produto Top</Text>
            <Text style={styles.statValue}>{topProduct}</Text>
          </View>
        </View>
      </View>

      {/* Seção de dicas */}
      <View style={styles.tipsSection}>
        <Text style={styles.sectionTitle}>Dicas para Aumentar Vendas</Text>

        <View style={styles.tipCard}>
          <Text style={styles.tipNumber}>1</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Ofereça Promoções</Text>
            <Text style={styles.tipDescription}>Crie promoções sazonais para atrair mais clientes</Text>
          </View>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipNumber}>2</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Melhore a Apresentação</Text>
            <Text style={styles.tipDescription}>Fotos de qualidade dos produtos aumentam as vendas</Text>
          </View>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipNumber}>3</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Atenda Bem</Text>
            <Text style={styles.tipDescription}>Bom atendimento gera clientes fiéis e recomendações</Text>
          </View>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipNumber}>4</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Use Redes Sociais</Text>
            <Text style={styles.tipDescription}>Divulgue seus produtos nas redes sociais regularmente</Text>
          </View>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipNumber}>5</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Qualidade Sempre</Text>
            <Text style={styles.tipDescription}>Mantenha a qualidade dos produtos em primeiro lugar</Text>
          </View>
        </View>
      </View>

      {/* Seção de últimas vendas */}
      <View style={styles.salesSection}>
        <Text style={styles.sectionTitle}>Últimas Vendas</Text>

        {sales.length > 0 ? (
          sales.slice(0, 5).map((sale) => (
            <View key={sale.id} style={styles.saleItem}>
              <View style={styles.saleInfo}>
                <Text style={styles.saleName}>{sale.product}</Text>
                <Text style={styles.saleDate}>{new Date(sale.date?.toDate?.() || sale.date).toLocaleDateString()}</Text>
              </View>
              <Text style={styles.salePrice}>R$ {sale.total?.toFixed(2)}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noSalesText}>Nenhuma venda registrada</Text>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: "48%",
    backgroundColor: COLORS.grayLight,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  tipsSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.grayLight,
  },
  tipCard: {
    flexDirection: "row",
    backgroundColor: COLORS.grayLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "flex-start",
  },
  tipNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginRight: 12,
    minWidth: 30,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 12,
    color: COLORS.gray,
  },
  salesSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.grayLight,
  },
  saleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  saleInfo: {
    flex: 1,
  },
  saleName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.black,
  },
  saleDate: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  salePrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  noSalesText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
    paddingVertical: 20,
  },
})
