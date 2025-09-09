import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, ExternalLink, AlertCircle } from 'lucide-react';
import DataTable from '../components/DataTable';

const AssessedVariants = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load data from JSON file in public folder
      const response = await fetch('/assessed-variants.json');
      if (!response.ok) throw new Error('Failed to load data');
      
      const result = await response.json();
      setData(result);
      setFilteredData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredData(data);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = data.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(query)
      )
    );
    setFilteredData(filtered);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const headers = [
    "Gene", 
    "RefSeq Transcript", 
    "Coding DNA change (c.)", 
    "Predicted protein change (p.)", 
    "Therapeutic Modality", 
    "Approach", 
    "Eligibility"
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Assessed Variants...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card max-w-md"
        >
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertCircle size={24} />
            <h3 className="text-xl font-semibold">Error Loading Data</h3>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="btn-primary"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Assessed Variants
          </h1>
        </motion.div>

        {/* Submit Project Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="card text-center">
            <h2 className="text-2xl font-bold text-primary-500 mb-4">
              Submit Your Project
            </h2>
            <p className="text-gray-600 mb-6">
              Are you developing a therapeutic approach for a specific genetic variant?
              Share your work with the N1C Gene Registry to increase visibility and collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://forms.gle/9UBkdLkdGDEeC5cn7"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
              >
                <ExternalLink size={20} />
                Submit Your Project
              </a>
              <a
                href="/Submission_Template.xlsx"
                download
                className="btn-secondary inline-flex items-center gap-2"
              >
                <Download size={20} />
                Download Template
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Questions? Contact us at generegistry@n1collaborative.org
            </p>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="flex bg-white rounded-lg shadow-lg overflow-hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search assessed variants..."
              className="flex-1 px-6 py-4 text-lg focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 font-semibold transition-colors duration-200 flex items-center gap-2"
            >
              <Search size={20} />
              Search
            </button>
          </div>
        </motion.div>

        {/* Data Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <DataTable 
            data={filteredData} 
            type="variants" 
            headers={headers}
          />
        </motion.div>

        {/* API Documentation Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-white text-lg">
            Looking to integrate or access our data? Visit the{' '}
            <a href="/api" className="text-primary-300 hover:text-primary-200 font-semibold underline">
              N1C API documentation
            </a>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AssessedVariants;
