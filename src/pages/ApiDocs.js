import React from 'react';
import { motion } from 'framer-motion';
import { Code, Database, Search } from 'lucide-react';

const ApiDocs = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            N1C API Documentation
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Access the N1C Gene Registry data programmatically through our REST API
          </p>
        </motion.div>

        {/* Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Code className="w-6 h-6 text-primary-500" />
            <h2 className="text-2xl font-bold text-gray-800">API Overview</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            The N1C Gene Registry API provides programmatic access to our comprehensive database 
            of genetic therapies and variants. All endpoints return JSON data and support CORS 
            for cross-origin requests.
          </p>
        </motion.div>

        {/* Base URL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card mb-8"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Base URL</h3>
          <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
            https://gene-registry.onrender.com/api
          </div>
        </motion.div>

        {/* Endpoints */}
        <div className="space-y-8">
          {/* Get Data Endpoint */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card"
          >
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-primary-500" />
              <h3 className="text-xl font-bold text-gray-800">Get Data</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Endpoint</h4>
                <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                  GET /data
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Parameters</h4>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>table</strong> (required): The table to retrieve data from
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <code>N1C_projects</code> - N-of-1 therapy developments</li>
                    <li>• <code>marketed_drugs</code> - Approved genetic therapies</li>
                    <li>• <code>assessed_variants</code> - Variant assessments</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Example Request</h4>
                <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                  GET /api/data?table=N1C_projects
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Response</h4>
                <div className="bg-gray-100 p-3 rounded font-mono text-sm text-xs">
                  <pre>{`[
  {
    "ID": "1",
    "Gene": "SOD1",
    "RefSeq Transcript": "NM_000454.4",
    "Coding DNA change (c.)": "c.112G>A",
    "Predicted protein change (p.)": "p.Gly38Arg",
    "Therapeutic Modality": "ASO",
    "Status": "Under Development"
  }
]`}</pre>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search Endpoint */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="card"
          >
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-6 h-6 text-primary-500" />
              <h3 className="text-xl font-bold text-gray-800">Search Data</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Endpoint</h4>
                <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                  GET /search
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Parameters</h4>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>table</strong> (required): The table to search in
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>q</strong> (required): Search query
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <code>N1C_projects</code> - Search N-of-1 projects</li>
                    <li>• <code>marketed_drugs</code> - Search marketed drugs</li>
                    <li>• <code>assessed_variants</code> - Search assessed variants</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Example Request</h4>
                <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                  GET /api/search?table=N1C_projects&q=SOD1
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Response</h4>
                <div className="bg-gray-100 p-3 rounded font-mono text-sm text-xs">
                  <pre>{`[
  {
    "ID": "1",
    "Gene": "SOD1",
    "RefSeq Transcript": "NM_000454.4",
    "Coding DNA change (c.)": "c.112G>A",
    "Predicted protein change (p.)": "p.Gly38Arg",
    "Therapeutic Modality": "ASO",
    "Status": "Under Development"
  }
]`}</pre>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Usage Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="card mt-8"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Usage Examples</h3>
          
          <div className="space-y-6">
            {/* JavaScript Example */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">JavaScript/Fetch</h4>
              <div className="bg-gray-100 p-4 rounded font-mono text-sm">
                <pre>{`// Get all N1C projects
fetch('https://gene-registry.onrender.com/api/data?table=N1C_projects')
  .then(response => response.json())
  .then(data => console.log(data));

// Search for specific gene
fetch('https://gene-registry.onrender.com/api/search?table=N1C_projects&q=SOD1')
  .then(response => response.json())
  .then(data => console.log(data));`}</pre>
              </div>
            </div>

            {/* Python Example */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Python/Requests</h4>
              <div className="bg-gray-100 p-4 rounded font-mono text-sm">
                <pre>{`import requests

# Get all marketed drugs
response = requests.get('https://gene-registry.onrender.com/api/data?table=marketed_drugs')
data = response.json()

# Search for specific condition
response = requests.get('https://gene-registry.onrender.com/api/search?table=marketed_drugs&q=spinal')
results = response.json()`}</pre>
              </div>
            </div>

            {/* cURL Example */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">cURL</h4>
              <div className="bg-gray-100 p-4 rounded font-mono text-sm">
                <pre>{`# Get assessed variants
curl "https://gene-registry.onrender.com/api/data?table=assessed_variants"

# Search for specific variant
curl "https://gene-registry.onrender.com/api/search?table=assessed_variants&q=c.112G%3EA"`}</pre>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error Handling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="card mt-8"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Error Handling</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Error Response Format</h4>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                <pre>{`{
  "error": "Error message description"
}`}</pre>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Common Error Codes</h4>
              <ul className="space-y-2 text-gray-600">
                <li><strong>400 Bad Request:</strong> Invalid or missing parameters</li>
                <li><strong>500 Internal Server Error:</strong> Server-side error</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Rate Limiting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="card mt-8"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Rate Limiting</h3>
          <p className="text-gray-600">
            The API is currently free to use with reasonable rate limits. Please be respectful 
            of the service and implement appropriate caching in your applications.
          </p>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="card mt-8"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Support</h3>
          <p className="text-gray-600 mb-4">
            For API support, questions, or to report issues, please contact us at:
          </p>
          <p className="font-semibold text-primary-600">
            generegistry@n1collaborative.org
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ApiDocs;
