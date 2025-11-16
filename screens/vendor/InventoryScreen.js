"use client";

// Permite que vendedores gerenciem o inventário de produtos
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore"
import { COLORS } from "../../constants/colors"

export default function InventoryScreen() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [newQuantity, setNewQuantity] = useState("")
  const db = getFirestore()

  // Buscar produtos do Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"))
        const productsData = []
        querySnapshot.forEach((doc) => {
          productsData.push({
            id: doc.id,
            ...doc.data(),
          })
        })
        setProducts(productsData)
      } catch (error) {
        console.log("Erro ao buscar produtos:", error)
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
      await updateDoc(doc(db, "products", selectedProduct.id), {
        quantity: Number.parseInt(newQuantity),
      })

      // Atualizar lista local
      setProducts(
        products.map((p) => (p.id === selectedProduct.id ? { ...p, quantity: Number.parseInt(newQuantity) } : p)),
      )

      Alert.alert("Sucesso", "Quantidade atualizada com sucesso!")
      setModalVisible(false)
      setNewQuantity("")
      setSelectedProduct(null)
    } catch (error) {
      console.log("Erro ao atualizar quantidade:", error)
      Alert.alert("Erro", "Não foi possível atualizar a quantidade")
    }
  }

  // Componente de cada produto
  const ProductItem = ({ item }) => (
    <View style={styles.productItem}>
      <View style={styles.productContent}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>R$ {item.price.toFixed(2)}</Text>
          <View style={[styles.quantityBadge, item.quantity < 5 && styles.quantityBadgeLow]}>
            <Text style={styles.quantityText}>{item.quantity} em estoque</Text>
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
})
