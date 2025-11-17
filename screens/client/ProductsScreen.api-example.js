// ProductsScreen.js - Exemplo de integração com API
// Este arquivo mostra como usar a camada HTTP/API

import { useFocusEffect } from "@react-navigation/native"
import { collection, getDocs, getFirestore } from "firebase/firestore"
import { useCallback, useState } from "react"
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"
import { COLORS } from "../../constants/colors"
import * as api from "../../services/api"

export default function ProductsScreen() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const db = getFirestore()

  const categories = ["Todos", "Bolos", "Cupcakes", "Tortas", "Doces", "Pães"]

  // Buscar produtos quando tela ganha foco
  useFocusEffect(
    useCallback(() => {
      fetchProducts()
    }, [])
  )

  // Função para buscar produtos
  const fetchProducts = async () => {
    try {
      setLoading(true)

      // ✅ Tentar API primeiro
      console.log("📡 Buscando produtos da API...")
      const response = await api.getProducts()

      if (response.success) {
        console.log("✅ Produtos carregados via API:", response.data?.length)
        setProducts(response.data || [])
        filterProducts(response.data || [])
      } else {
        // ⚠️ Fallback: usar Firestore
        console.warn("⚠️ API indisponível, usando Firestore como fallback")
        const querySnapshot = await getDocs(collection(db, "products"))
        const productsData = []
        querySnapshot.forEach((doc) => {
          productsData.push({
            id: doc.id,
            ...doc.data(),
          })
        })
        setProducts(productsData)
        filterProducts(productsData)
      }
    } catch (error) {
      console.error("❌ Erro ao buscar produtos:", error)
      Alert.alert("Erro", "Não foi possível carregar os produtos")
    } finally {
      setLoading(false)
    }
  }

  // Função para filtrar produtos
  const filterProducts = (allProducts) => {
    let filtered = allProducts

    // Filtrar por categoria
    if (selectedCategory !== "Todos") {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    // Filtrar por busca
    if (searchQuery.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }

  // Atualizar filtros quando search ou categoria mudar
  const handleSearchChange = (text) => {
    setSearchQuery(text)
    filterProducts(products)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    filterProducts(products)
  }

  // Componente de cada produto
  const ProductCard = ({ item }) => (
    <View style={styles.productCard}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.productImage} />
      ) : (
        <View style={[styles.productImage, styles.noImage]}>
          <Text style={styles.noImageText}>Sem imagem</Text>
        </View>
      )}

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>R$ {(item.price || 0).toFixed(2)}</Text>

          {item.quantity < 5 && (
            <View style={styles.lowStockBadge}>
              <Text style={styles.lowStockText}>Baixo estoque</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Adicionar ao Carrinho</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Carregando produtos...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Barra de busca */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produtos..."
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
      </View>

      {/* Filtro de categorias */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => handleCategoryChange(category)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.categoryButtonTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de produtos */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard item={item} />}
        contentContainerStyle={styles.listContent}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchProducts}
            >
              <Text style={styles.retryButtonText}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.gray,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: COLORS.grayMedium,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.black,
  },
  categoriesContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.grayMedium,
    backgroundColor: COLORS.white,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryButtonText: {
    color: COLORS.gray,
    fontSize: 12,
    fontWeight: "600",
  },
  categoryButtonTextActive: {
    color: COLORS.white,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  productCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    marginHorizontal: 8,
  },
  productImage: {
    width: "100%",
    height: 120,
    backgroundColor: COLORS.grayLight,
  },
  noImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    color: COLORS.gray,
    fontSize: 12,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 8,
    lineHeight: 16,
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  lowStockBadge: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  lowStockText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 14,
  },
})
