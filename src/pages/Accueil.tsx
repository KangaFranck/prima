import React from 'react';
import { motion } from 'framer-motion';
import { usePageRefresh } from '../hooks/usePageRefresh';
import LoadingSpinner from '../components/LoadingSpinner';

const Accueil: React.FC = () => {
  const { isLoading } = usePageRefresh();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1"
        >
          {/* Contenu de la page d'accueil */}
        </motion.div>
      )}
    </div>
  );
};

export default Accueil; 