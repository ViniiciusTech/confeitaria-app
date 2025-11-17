import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../contexts/AuthContext";

export default function ProductsScreen() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [cart, setCart] = useState([])
  const [searchText, setSearchText] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [loading, setLoading] = useState(true)
  const db = getFirestore()
  const { logout } = useAuth()

  // Categorias disponíveis
  const categories = ["Todos", "Bolos", "Cupcakes", "Tortas", "Doces"]

const handleLogout = async () => {
  // WEB
  if (Platform.OS === "web") {
    const confirmed = window.confirm("Tem certeza que deseja sair?");
    if (!confirmed) return;

    try {
      const logoutSuccess = await logout();
      if (!logoutSuccess) {
        Alert.alert("Erro", "Não foi possível fazer logout. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro durante logout:", error);
      Alert.alert("Erro", "Ocorreu um erro ao fazer logout.");
    }

    return;
  }

  // MOBILE
  Alert.alert("Logout", "Tem certeza que deseja sair?", [
    { text: "Cancelar", style: "cancel" },
    {
      text: "Sair",
      style: "destructive",
      onPress: async () => {
        try {
          await logout();
        } catch (error) {
          console.error("Erro durante logout:", error);
          Alert.alert("Erro", "Não foi possível fazer logout.");
        }
      }
    }
  ]);
};



  // Função para adicionar ao carrinho
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
    Alert.alert("Sucesso", `${product.name} adicionado ao carrinho!`)
  }

  // Buscar produtos do Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Iniciando busca de produtos...")
        const querySnapshot = await getDocs(collection(db, "products"))
        const productsData = []
        querySnapshot.forEach((doc) => {
          productsData.push({
            id: doc.id,
            ...doc.data(),
          })
        })
        console.log("Produtos carregados:", productsData.length)
        setProducts(productsData)
        setFilteredProducts(productsData)
      } catch (error) {
        console.error("Erro ao buscar produtos:", error)
        Alert.alert("Erro", "Não foi possível carregar os produtos")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filtrar produtos por busca e categoria
  useEffect(() => {
    let filtered = products

    // Filtrar por categoria
    if (selectedCategory !== "Todos") {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    // Filtrar por busca
    if (searchText) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchText.toLowerCase()))
    }

    setFilteredProducts(filtered)
  }, [searchText, selectedCategory, products])

  // Componente de cada produto
  const ProductCard = ({ item }) => {
    // Gerar imagem padrão por categoria
    const getDefaultImage = () => {
      const colors = {
        "Bolos": "#FFB6C1",
        "Cupcakes": "#FFC0CB",
        "Tortas": "#FFD700",
        "Doces": "#FF69B4",
        "Pães": "#D2691E"
      }
      return colors[item.category] || "#E0E0E0"
    }

    return (
      <TouchableOpacity style={styles.productCard}>
        {item.image ? (
          <Image 
            source={{ uri: item.image }} 
            style={styles.productImage}
            onError={() => console.log("Erro ao carregar imagem:", item.image)}
          />
        ) : (
          <View style={[styles.productImage, { backgroundColor: getDefaultImage() }]}>
            <Text style={{ color: "#fff", fontSize: 12, textAlign: "center", marginTop: 60 }}>
              {item.category}
            </Text>
          </View>
        )}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name || "Produto sem nome"}</Text>
          <Text style={styles.productDescription} numberOfLines={2}>
            {item.description || "Sem descrição"}
          </Text>
          <Text style={{ fontSize: 10, color: COLORS.gray }}>Cat: {item.category || "Geral"}</Text>
          <View style={styles.productFooter}>
            <Text style={styles.productPrice}>R$ {(item.price || 0).toFixed(2)}</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Botão de Logout */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Barra de busca */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produtos..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Filtro de categorias */}
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoryButton, selectedCategory === item && styles.categoryButtonActive]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text style={[styles.categoryText, selectedCategory === item && styles.categoryTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
        style={styles.categoriesContainer}
        showsHorizontalScrollIndicator={false}
      />

      {/* Lista de produtos */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard item={item} />}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.grayLight,
  },
  searchInput: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.grayMedium,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.grayLight,
  },
  categoryButton: {
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 35,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.grayMedium,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.gray,
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  productCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 4,
    marginVertical: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.grayMedium,
  },
  productImage: {
    width: "100%",
    height: 120,
    backgroundColor: COLORS.grayLight,
  },
  productInfo: {
    padding: 10,
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
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
  },
})
