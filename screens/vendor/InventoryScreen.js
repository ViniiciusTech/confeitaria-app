
// Permite que vendedores gerenciem o inventário de produtos
import { addDoc, collection, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../contexts/AuthContext";
import * as api from "../../services/api";

export default function InventoryScreen() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [newQuantity, setNewQuantity] = useState("")
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Bolos",
    price: "",
    description: "",
    quantity: "",
  })
  const db = getFirestore()
  const { logout } = useAuth()

  const categories = ["Bolos", "Cupcakes", "Tortas", "Doces", "Pães"]

  // Função para fazer logout (compatível com web e mobile)
  const handleLogout = async () => {
    // No web, Alert.alert não suporta botões customizados — usar confirm
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Tem certeza que deseja sair?")
      if (!confirmed) return
      try {
        const logoutSuccess = await logout()
        if (!logoutSuccess) {
          Alert.alert("Erro", "Não foi possível fazer logout. Tente novamente.")
        }
      } catch (error) {
        console.error("Erro durante logout:", error)
        Alert.alert("Erro", "Ocorreu um erro ao fazer logout")
      }
      return
    }

    // Comportamento nativo (iOS/Android)
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      { text: "Cancelar", onPress: () => {}, style: "cancel" },
      {
        text: "Sair",
        onPress: async () => {
          try {
            const logoutSuccess = await logout()
            if (!logoutSuccess) {
              Alert.alert("Erro", "Não foi possível fazer logout. Tente novamente.")
            }
          } catch (error) {
            console.error("Erro durante logout:", error)
            Alert.alert("Erro", "Ocorreu um erro ao fazer logout")
          }
        },
        style: "destructive",
      },
    ])
  }

  // Buscar produtos do Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Tentar buscar da API primeiro
        const response = await api.getProducts()
        
        if (response.success) {
          setProducts(response.data || [])
          console.log("✅ Produtos carregados via API:", response.data?.length)
        } else {
          // Se a API não funcionar, usar Firestore como fallback
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
        }
      } catch (error) {
        console.error("Erro ao buscar produtos:", error)
        Alert.alert("Erro", "Não foi possível carregar os produtos")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Função para atualizar quantidade
  const handleUpdateQuantity = async () => {
    if (!newQuantity || isNaN(newQuantity)) {
      Alert.alert("Erro", "Por favor, insira uma quantidade válida")
      return
    }

    try {
      // Tentar atualizar via API
      const response = await api.patchProduct(selectedProduct.id, {
        quantity: Number.parseInt(newQuantity),
      })

      if (response.success) {
        console.log("✅ Quantidade atualizada via API")
        // Atualizar lista local
        setProducts(
          products.map((p) => (p.id === selectedProduct.id ? { ...p, quantity: Number.parseInt(newQuantity) } : p)),
        )
      } else {
        // Se a API falhar, usar Firestore
        console.warn("⚠️ API falhou, usando Firestore")
        await updateDoc(doc(db, "products", selectedProduct.id), {
          quantity: Number.parseInt(newQuantity),
        })
        setProducts(
          products.map((p) => (p.id === selectedProduct.id ? { ...p, quantity: Number.parseInt(newQuantity) } : p)),
        )
      }

      Alert.alert("Sucesso", "Quantidade atualizada com sucesso!")
      setModalVisible(false)
      setNewQuantity("")
      setSelectedProduct(null)
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error)
      Alert.alert("Erro", "Não foi possível atualizar a quantidade")
    }
  }

  // Função para criar novo produto
  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.quantity || !newProduct.description) {
      Alert.alert("Erro", "Por favor, preencha todos os campos")
      return
    }

    try {
      const productData = {
        name: newProduct.name,
        category: newProduct.category,
        price: Number.parseFloat(newProduct.price),
        description: newProduct.description,
        quantity: Number.parseInt(newProduct.quantity),
      }

      // Tentar criar via API
      const response = await api.createProduct(productData)

      if (response.success) {
        console.log("✅ Produto criado via API")
        const newId = response.data?.id || new Date().getTime().toString()
        const createdProduct = {
          id: newId,
          ...productData,
        }
        setProducts([...products, createdProduct])
      } else {
        // Se a API falhar, usar Firestore
        console.warn("⚠️ API falhou, usando Firestore")
        const docRef = await addDoc(collection(db, "products"), {
          ...productData,
          image: null,
          createdAt: new Date(),
        })
        setProducts([...products, {
          id: docRef.id,
          ...productData,
        }])
      }

      Alert.alert("Sucesso", `${newProduct.name} criado com sucesso!`)
      setCreateModalVisible(false)
      setNewProduct({
        name: "",
        category: "Bolos",
        price: "",
        description: "",
        quantity: "",
      })
    } catch (error) {
      console.error("Erro ao criar produto:", error)
      Alert.alert("Erro", "Não foi possível criar o produto")
    }
  }

  // Componente de cada produto
  const ProductItem = ({ item }) => (
    <View style={styles.productItem}>
      <View style={styles.productContent}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>R$ {(item.price || 0).toFixed(2)}</Text>
          <View style={[styles.quantityBadge, item.quantity < 5 && styles.quantityBadgeLow]}>
            <Text style={styles.quantityText}>{item.quantity || 0} em estoque</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {
          setSelectedProduct(item)
          setNewQuantity(item.quantity.toString())
          setModalVisible(true)
        }}
      >
        <Text style={styles.editButtonText}>Editar</Text>
      </TouchableOpacity>
    </View>
  )

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

        {/* Botão para criar novo produto */}
        <TouchableOpacity style={styles.createButton} onPress={() => setCreateModalVisible(true)}>
          <Text style={styles.createButtonText}>+ Novo Produto</Text>
        </TouchableOpacity>
      </View>

      {/* Cabeçalho com estatísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{products.length}</Text>
          <Text style={styles.statLabel}>Produtos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{products.reduce((sum, p) => sum + p.quantity, 0)}</Text>
          <Text style={styles.statLabel}>Total em Estoque</Text>
        </View>
      </View>

      {/* Lista de produtos */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductItem item={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
          </View>
        }
      />

      {/* Modal para editar quantidade */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Atualizar Quantidade</Text>
            {selectedProduct && <Text style={styles.modalProductName}>{selectedProduct.name}</Text>}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nova Quantidade</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite a quantidade"
                value={newQuantity}
                onChangeText={setNewQuantity}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleUpdateQuantity}>
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para criar novo produto */}
      <Modal visible={createModalVisible} transparent animationType="slide" onRequestClose={() => setCreateModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Criar Novo Produto</Text>

            <ScrollView style={styles.formContainer}>
              {/* Campo Nome */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nome do Produto</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Bolo de Chocolate"
                  value={newProduct.name}
                  onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
                />
              </View>

              {/* Campo Categoria */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Categoria</Text>
                <View style={styles.categoryContainer}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.categoryOption, newProduct.category === cat && styles.categoryOptionActive]}
                      onPress={() => setNewProduct({ ...newProduct, category: cat })}
                    >
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[styles.categoryOptionText, newProduct.category === cat && styles.categoryOptionTextActive]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Campo Preço */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Preço (R$)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 50.00"
                  value={newProduct.price}
                  onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
                  keyboardType="decimal-pad"
                />
              </View>

              {/* Campo Quantidade */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Quantidade em Estoque</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 10"
                  value={newProduct.quantity}
                  onChangeText={(text) => setNewProduct({ ...newProduct, quantity: text })}
                  keyboardType="numeric"
                />
              </View>

              {/* Campo Descrição */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Descrição</Text>
                <TextInput
                  style={[styles.input, styles.descriptionInput]}
                  placeholder="Ex: Bolo delicioso de chocolate com cobertura"
                  value={newProduct.description}
                  onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </ScrollView>

            {/* Botões */}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setCreateModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleCreateProduct}>
                <Text style={styles.confirmButtonText}>Criar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.grayLight,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  productItem: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.grayMedium,
    alignItems: "center",
  },
  productContent: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.black,
  },
  productCategory: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  quantityBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quantityBadgeLow: {
    backgroundColor: COLORS.warning,
  },
  quantityText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: "600",
  },
  editButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 12,
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: 12,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 8,
  },
  modalProductName: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 16,
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
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.grayMedium,
    alignItems: "center",
  },
  cancelButtonText: {
    color: COLORS.gray,
    fontSize: 14,
    fontWeight: "bold",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  logoutContainer: {
    padding: 12,
    backgroundColor: COLORS.grayLight,
    alignItems: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayMedium,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
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
  createButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  createButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  formContainer: {
    maxHeight: 400,
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    // espaçamento controlado por margem em cada opção para compatibilidade
  },
  categoryOption: {
    minWidth: 96,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.grayMedium,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    marginBottom: 8,
  },
  categoryOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryOptionText: {
    color: COLORS.gray,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 4,
  },
  categoryOptionTextActive: {
    color: COLORS.white,
  },
  descriptionInput: {
    height: 100,
    paddingTop: 12,
  },
})
