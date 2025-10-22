import React, { createContext, useContext, useState, useEffect } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getFirestore, doc, getDoc } from "firebase/firestore"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)   // user logado
  const [userType, setUserType] = useState(null) //  client ou vedor
  const [loading, setLoading] = useState(true)   // crregamento de dados

  // fire init
  const auth = getAuth()
  const db = getFirestore()
   
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        
        setUser(currentUser) // User logado
        
        
        try { // Buscar tipo de usuário no Firestore
          const userDoc = await getDoc(doc(db, "users", currentUser.uid))
          if (userDoc.exists()) {
            // pegar tipo de usuário
            setUserType(userDoc.data().userType)
          }
        } catch (error) {
          console.log("Erro ao buscar tipo de usuário:", error)
        }
      } else {
        // User não logado
        setUser(null)
        setUserType(null)
      }
      // final
      setLoading(false)
    })

    // desinscrever quando componente desmontar
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, userType, loading }}>
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
