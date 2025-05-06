import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { User } from "firebase/auth";
import { 
  auth, 
  signInWithGoogle as firebaseSignInWithGoogle, 
  logoutUser, 
  registerWithEmail as firebaseRegisterWithEmail, 
  loginWithEmail as firebaseLoginWithEmail 
} from "../lib/firebase";
import { apiRequest } from "../lib/queryClient";

interface AuthContextType {
  currentUser: User | null;
  userRole: string | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  getUserDetails: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userRole: null,
  loading: true,
  loginWithGoogle: async () => {},
  loginWithEmail: async () => {},
  registerWithEmail: async () => {},
  logout: async () => {},
  getUserDetails: async () => ({}),
});

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loginWithGoogle() {
    try {
      const user = await firebaseSignInWithGoogle();
      if (user) {
        // Get or create user in our backend
        await createUserInBackend(user);
      }
    } catch (error) {
      console.error("Failed to login with Google:", error);
      throw error;
    }
  }

  async function loginWithEmail(email: string, password: string) {
    try {
      const user = await firebaseLoginWithEmail(email, password);
      if (user) {
        // Get or create user in our backend
        await createUserInBackend(user);
      }
    } catch (error) {
      console.error("Failed to login with email:", error);
      throw error;
    }
  }

  async function registerWithEmail(email: string, password: string, displayName: string) {
    try {
      const user = await firebaseRegisterWithEmail(email, password, displayName);
      if (user) {
        // Create user in our backend
        await createUserInBackend(user);
      }
    } catch (error) {
      console.error("Failed to register with email:", error);
      throw error;
    }
  }

  async function logout() {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Failed to logout:", error);
      throw error;
    }
  }

  async function createUserInBackend(user: User) {
    try {
      const idToken = await user.getIdToken();
      const response = await apiRequest("POST", "/api/auth/register", {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
      });
      
      const data = await response.json();
      setUserRole(data.role);
      return data;
    } catch (error) {
      console.error("Error creating user in backend:", error);
      throw error;
    }
  }

  async function getUserDetails() {
    if (!currentUser) return null;
    
    try {
      const response = await apiRequest("GET", `/api/users/${currentUser.uid}`);
      const data = await response.json();
      setUserRole(data.role);
      return data;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          await getUserDetails();
        } catch (error) {
          console.error("Error loading user details:", error);
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    loading,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
    getUserDetails,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
