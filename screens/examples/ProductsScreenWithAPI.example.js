/**
 * EXEMPLO DE USO DO SERVIÇO HTTP
 * 
 * Este arquivo demonstra como usar o serviço HTTP/API
 * em um componente real. Descomente o código para usar.
 * 
 * Opções de uso:
 * 1. Usar Firebase Firestore (atual) - sem servidor backend
 * 2. Usar API HTTP (este exemplo) - com servidor backend Node.js/Express
 * 
 * Para usar a API HTTP:
 * - Descomente todo o código abaixo
 * - Configure a URL base da API em services/http.js
 * - Implemente os endpoints no seu backend
 */

import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

export default function ProductsScreenWithAPI() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  // Categorias disponíveis
  const categories = ["Todos", "Bolos", "Cupcakes", "Tortas", "Doces"];

  // Função para fazer logout
  const handleLogout = async () => {
    Alert.alert("Logout", "Tem certeza que deseja sair?", [
      { text: "Cancelar", onPress: () => {}, style: "cancel" },
      {
        text: "Sair",
        onPress: async () => {
          await logout();
        },
        style: "destructive",
      },
    ]);
  };

  // Função para adicionar ao carrinho
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    Alert.alert("Sucesso", `${product.name} adicionado ao carrinho!`);
  };

  // Buscar produtos da API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Iniciando busca de produtos via API...");
        setLoading(true);

        // Usar o serviço de API
        const result = await api.getProducts();

        if (result.success) {
          console.log("Produtos carregados:", result.data.length);
          setProducts(result.data);
        } else {
          console.error("Erro ao carregar produtos:", result.error);
          Alert.alert("Erro", "Não foi possível carregar os produtos");
        }
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        Alert.alert("Erro", "Erro ao carregar produtos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtrar produtos por categoria e busca
  useEffect(() => {
    let filtered = products;

    // Filtrar por categoria
    if (selectedCategory !== "Todos") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Filtrar por busca
    if (searchText) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchText.toLowerCase()) ||
          product.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [searchText, selectedCategory, products]);

  // Componente de cada produto
  const ProductCard = ({ item }) => {
    // Gerar imagem padrão por categoria
    const getDefaultImage = () => {
      const colors = {
        Bolos: "#FFB6C1",
        Cupcakes: "#FFC0CB",
        Tortas: "#FFD700",
        Doces: "#FF69B4",
        Pães: "#D2691E",
      };
      return colors[item.category] || "#E0E0E0";
    };

    return (
      <TouchableOpacity style={styles.productCard}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.productImage}
            onError={() => console.log("Erro ao carregar imagem:", item.image)}
          />
        ) : (
          <View
            style={[styles.productImage, { backgroundColor: getDefaultImage() }]}
          >
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
          <Text style={{ fontSize: 10, color: COLORS.gray }}>
            Cat: {item.category || "Geral"}
          </Text>
          <View style={styles.productFooter}>
            <Text style={styles.productPrice}>
              R$ {(item.price || 0).toFixed(2)}
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addToCart(item)}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 10 }}>Carregando produtos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Botão de Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>

      {/* Busca */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar produtos..."
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Categorias */}
      <FlatList
        horizontal
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === item && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === item && styles.categoryTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      />

      {/* Lista de Produtos */}
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => <ProductCard item={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
      />

      {/* Carrinho Info */}
      {cart.length > 0 && (
        <View style={styles.cartInfo}>
          <Text style={styles.cartText}>{cart.length} items no carrinho</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 10,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginRight: 10,
    alignSelf: "flex-end",
    marginTop: 10,
    marginRight: 15,
  },
  logoutText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.grayMedium,
    fontSize: 14,
  },
  categoriesContainer: {
    maxHeight: 50,
    marginHorizontal: 15,
    marginBottom: 15,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "500",
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  row: {
    justifyContent: "space-around",
    marginBottom: 10,
  },
  productCard: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: COLORS.grayLight,
    borderWidth: 1,
    borderColor: COLORS.grayMedium,
  },
  productImage: {
    width: "100%",
    height: 120,
    backgroundColor: COLORS.grayMedium,
  },
  productInfo: {
    padding: 10,
    flex: 1,
  },
  productName: {
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 3,
    color: COLORS.black,
  },
  productDescription: {
    fontSize: 10,
    color: COLORS.gray,
    marginBottom: 5,
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
  },
  productPrice: {
    fontWeight: "bold",
    color: COLORS.primary,
    fontSize: 12,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  cartInfo: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  cartText: {
    color: COLORS.white,
    fontWeight: "bold",
    textAlign: "center",
  },
});
