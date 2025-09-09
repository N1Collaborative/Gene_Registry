import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Home from './pages/Home';
import N1CProjects from './pages/N1CProjects';
import MarketedDrugs from './pages/MarketedDrugs';
import AssessedVariants from './pages/AssessedVariants';
import EntryDetail from './pages/EntryDetail';
import VariantEntryDetail from './pages/VariantEntryDetail';
import InfoPage from './pages/Info';
import ApiDocs from './pages/ApiDocs';

function App() {
  return (
    <Router>
      <div className="min-h-screen" style={{backgroundColor: 'rgb(0, 30, 74)'}}>
        <Header />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="pt-20"
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/n1c-projects" element={<N1CProjects />} />
            <Route path="/marketed-drugs" element={<MarketedDrugs />} />
            <Route path="/assessed-variants" element={<AssessedVariants />} />
            <Route path="/entry/:id" element={<EntryDetail />} />
            <Route path="/variant-entry/:id" element={<VariantEntryDetail />} />
            <Route path="/info" element={<InfoPage />} />
            <Route path="/api" element={<ApiDocs />} />
          </Routes>
        </motion.div>
      </div>
    </Router>
  );
}

export default App;
