import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle, ExternalLink } from 'lucide-react';

const EntryDetail = () => {
  const { id } = useParams();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEntry = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/n1c-projects.json');
      if (!response.ok) throw new Error('Failed to load data');
      
      const data = await response.json();
      const foundEntry = data.find(item => item.ID === parseInt(id));
      
      if (foundEntry) {
        setEntry(foundEntry);
      } else {
        setError('Entry not found');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadEntry();
  }, [loadEntry]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading entry details...</p>
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
            <h3 className="text-xl font-semibold">Error</h3>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/n1c-projects" className="btn-primary">
            Back to Projects
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card max-w-md text-center"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Entry Not Found</h3>
          <p className="text-gray-600 mb-6">The requested entry could not be found.</p>
          <Link to="/n1c-projects" className="btn-primary">
            Back to Projects
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            to="/n1c-projects" 
            className="inline-flex items-center gap-2 text-white hover:text-primary-300 mb-4 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            Back to N1C Projects
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Project Details
          </h1>
        </motion.div>

        {/* Entry Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Gene</label>
                  <p className="text-lg text-gray-800">{entry.Gene || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">RefSeq Transcript</label>
                  <p className="text-lg text-gray-800">{entry['RefSeq Transcript'] || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Coding DNA Change</label>
                  <p className="text-lg text-gray-800">{entry['Coding DNA change (c.)'] || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Protein Change</label>
                  <p className="text-lg text-gray-800">{entry['Predicted protein change (p.)'] || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Therapeutic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Therapeutic Modality</label>
                  <p className="text-lg text-gray-800">{entry['Therapeutic Modality'] || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    entry.Status === 'Clinical Application' ? 'bg-green-100 text-green-800' :
                    entry.Status === 'Developed' ? 'bg-blue-100 text-blue-800' :
                    entry.Status === 'Under Development' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {entry.Status || 'N/A'}
                  </span>
                </div>
                {entry.ID && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Project ID</label>
                    <p className="text-lg text-gray-800">{entry.ID}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {Object.keys(entry).some(key => !['Gene', 'RefSeq Transcript', 'Coding DNA change (c.)', 'Predicted protein change (p.)', 'Therapeutic Modality', 'Status', 'ID'].includes(key) && entry[key]) && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Additional Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(entry).map(([key, value]) => {
                  if (['Gene', 'RefSeq Transcript', 'Coding DNA change (c.)', 'Predicted protein change (p.)', 'Therapeutic Modality', 'Status', 'ID'].includes(key) || !value) {
                    return null;
                  }
                  return (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">{key}</label>
                      <p className="text-gray-800">{value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card mt-8"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Get More Information</h3>
          <p className="text-gray-600 mb-4">
            For more detailed information about this project or to connect with the researchers involved, 
            please contact the N1C Gene Registry team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:generegistry@n1collaborative.org"
              className="btn-primary inline-flex items-center gap-2"
            >
              <ExternalLink size={20} />
              Contact Registry Team
            </a>
            <Link to="/n1c-projects" className="btn-secondary">
              Browse All Projects
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EntryDetail;
