import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import Index from '@/pages/Index';
import Settings from '@/pages/Settings';
import Header from '@/components/Header';
import BottomTab from '@/components/BottomTab';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
// Add page imports here

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

const AuthenticatedApp = () => {
  const location = useLocation();

  // Render the main app
  return (
    <div style={{ paddingTop: 'max(0, env(safe-area-inset-top))' }}>
      <Header />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Add your page Route elements here */}
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </AnimatePresence>
      <BottomTab />
    </div>
  );
};


function App() {

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
          <Toaster />
        </Router>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App