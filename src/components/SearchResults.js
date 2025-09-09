import React from 'react';
import { motion } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import DataTable from './DataTable';

const SearchResults = ({ results, onClose }) => {
  if (results.error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto px-4 mb-16"
      >
        <div className="card">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertCircle size={24} />
            <h3 className="text-xl font-semibold">Search Error</h3>
          </div>
          <p className="text-gray-600">{results.error}</p>
        </div>
      </motion.div>
    );
  }

  const hasResults = results.n1c?.length > 0 || results.marketed?.length > 0 || results.variants?.length > 0;

  if (!hasResults) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto px-4 mb-16"
      >
        <div className="card text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Results Found</h3>
          <p className="text-gray-600">Try adjusting your search terms or browse the individual registries.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 mb-16"
    >
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Search Results</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <X size={24} />
            </button>
          )}
        </div>

        <div className="space-y-8">
          {results.n1c?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-primary-500 mb-4">N1C Projects</h3>
              <DataTable 
                data={results.n1c} 
                type="n1c" 
                headers={["Gene", "RefSeq Transcript", "Coding DNA change (c.)", "Predicted protein change (p.)", "Therapeutic Modality", "Status"]}
              />
            </div>
          )}

          {results.marketed?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-green-600 mb-4">Marketed Drugs</h3>
              <DataTable 
                data={results.marketed} 
                type="marketed" 
                headers={["Marketed drug", "Condition/indication", "Gene", "Modality", "Mechanism", "Company", "DrugBank ID"]}
              />
            </div>
          )}

          {results.variants?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-purple-600 mb-4">Assessed Variants</h3>
              <DataTable 
                data={results.variants} 
                type="variants" 
                headers={["Gene", "RefSeq Transcript", "Coding DNA change (c.)", "Predicted protein change (p.)", "Therapeutic Modality", "Approach", "Eligibility"]}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SearchResults;
