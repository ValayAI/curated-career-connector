
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithLinkedIn: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is admin
  const checkAdminStatus = async (userId: string) => {
    if (!userId) return false;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
    
    return data?.is_admin || false;
  };

  useEffect(() => {
    // Set up the session listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user || null);
      
      if (newSession?.user) {
        checkAdminStatus(newSession.user.id).then(setIsAdmin);
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);

      if (event === 'SIGNED_IN') {
        toast.success("Successfully signed in");
        navigate('/');
      } else if (event === 'SIGNED_OUT') {
        toast.info("Signed out");
        navigate('/');
      }
    });

    // Get the initial session
    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user || null);
      
      if (data.session?.user) {
        const adminStatus = await checkAdminStatus(data.session.user.id);
        setIsAdmin(adminStatus);
      }
      
      setLoading(false);
    };
    
    initSession();

    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]);

  // Protect routes - redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      const publicRoutes = ['/', '/auth', '/index'];
      if (!publicRoutes.includes(location.pathname)) {
        toast.error("Please sign in to access this page");
        navigate('/auth');
      }
    }
  }, [loading, user, location.pathname, navigate]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      }
    });
  };

  const signInWithLinkedIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: window.location.origin,
      }
    });
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      isAdmin,
      signIn, 
      signUp, 
      signOut, 
      signInWithGoogle,
      signInWithLinkedIn 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
