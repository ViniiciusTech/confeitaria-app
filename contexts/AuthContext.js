import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { doc, getDoc, getFirestore } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)   // user logado
  const [userType, setUserType] = useState(null) //  client ou vedor
  const [loading, setLoading] = useState(true)   // crregamento de dados

  // fire init
  const auth = getAuth()
  const db = getFirestore()
   
  useEffect(() => {
    let isMounted = true
    let timeoutId

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!isMounted) return

      console.log("onAuthStateChanged triggered, currentUser:", !!currentUser)

      try {
        if (currentUser) {
          console.log("User logged in:", currentUser.uid)
          setUser(currentUser)
          
          try {
            console.log("Fetching userType from Firestore...")
            const userDoc = await getDoc(doc(db, "users", currentUser.uid))
            if (userDoc.exists() && isMounted) {
              console.log("UserType found:", userDoc.data().userType)
              setUserType(userDoc.data().userType)
              setLoading(false)
            } else {
              console.log("User document not found")
              setLoading(false)
            }
          } catch (error) {
            console.error("Erro ao buscar tipo de usuário:", error)
            setLoading(false)
          }
        } else {
          console.log("No user logged in")
          if (isMounted) {
            setUser(null)
            setUserType(null)
            setLoading(false)
          }
        }
      } catch (error) {
        console.error("Erro geral em onAuthStateChanged:", error)
        setLoading(false)
      }
    })

    // Timeout de 10 segundos como fallback
    timeoutId = setTimeout(() => {
      if (isMounted) {
        console.log("Timeout acionado - setando loading para false")
        setLoading(false)
      }
    }, 10000)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
      unsubscribe()
    }
  }, [])

  // Função para fazer logout
  const logout = async () => {
    try {
      console.log("Iniciando logout...")
      setLoading(true)
      await signOut(auth)
      console.log("SignOut completado")
      setUser(null)
      setUserType(null)
      setLoading(false)
      console.log("Logout concluído com sucesso")
      return true
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      setUser(null)
      setUserType(null)
      setLoading(false)
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ user, userType, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// acessar dados de autenticação em qualquer componente
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider")
  }
  return context
}
