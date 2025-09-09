import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Database, FlaskConical, Activity, ExternalLink, ArrowRight } from 'lucide-react';
import SearchResults from '../components/SearchResults';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const registrySections = [
    {
      title: 'N-of-1 Projects',
      description: 'Explore available and ongoing N=1 therapy developments.',
      path: '/n1c-projects',
      icon: FlaskConical,
      color: 'from-primary-500 to-primary-600',
      hoverColor: 'hover:from-primary-600 hover:to-primary-700'
    },
    {
      title: 'Marketed Genetic Therapies',
      description: 'Browse currently approved and marketed genetic therapies.',
      path: '/marketed-drugs',
      icon: Database,
      color: 'from-primary-500 to-primary-600',
      hoverColor: 'hover:from-primary-600 hover:to-primary-700'
    },
    {
      title: 'Assessed Variants',
      description: 'View curated assessments of variants and their therapeutic eligibility.',
      path: '/assessed-variants',
      icon: Activity,
      color: 'from-primary-500 to-primary-600',
      hoverColor: 'hover:from-primary-600 hover:to-primary-700'
    }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    console.log('Searching for:', searchQuery);
    setIsSearching(true);
    try {
      // Load all data from JSON files
      const [n1cRes, drugRes, variantRes] = await Promise.all([
        fetch('/n1c-projects.json'),
        fetch('/marketed-drugs.json'),
        fetch('/assessed-variants.json')
      ]);

      const n1cData = await n1cRes.json();
      const drugData = await drugRes.json();
      const variantData = await variantRes.json();

      console.log('Loaded data:', { n1c: n1cData.length, drugs: drugData.length, variants: variantData.length });

      // Perform client-side search
      const query = searchQuery.toLowerCase();
      
      const searchInData = (data) => {
        return data.filter(item =>
          Object.values(item).some(value =>
            String(value).toLowerCase().includes(query)
          )
        );
      };

      const filteredN1c = searchInData(n1cData);
      const filteredDrugs = searchInData(drugData);
      const filteredVariants = searchInData(variantData);

      console.log('Search results:', { n1c: filteredN1c.length, drugs: filteredDrugs.length, variants: filteredVariants.length });

      setSearchResults({
        n1c: filteredN1c,
        marketed: filteredDrugs,
        variants: filteredVariants
      });
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({ error: 'Search failed. Please try again.' });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 px-4"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-6xl font-bold text-white mb-6"
        >
          N1C Gene Registry
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-white/90 max-w-3xl mx-auto mb-12"
        >
          A searchable database of therapeutic approaches for rare genetic variants, 
          curated by the N=1 Collaborative.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="flex bg-white rounded-lg shadow-lg overflow-hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search all registries..."
              className="flex-1 px-6 py-4 text-lg focus:outline-none"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 font-semibold transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              {isSearching ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Search size={20} />
              )}
              Search
            </button>
          </div>
        </motion.div>

        {/* Search Results */}
        {searchResults && (
          <SearchResults results={searchResults} />
        )}
      </motion.div>

      {/* Registry Sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="max-w-6xl mx-auto px-4 mb-16"
      >
        <div className="grid md:grid-cols-3 gap-8">
          {registrySections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="h-full"
            >
              <Link to={section.path} className="h-full block">
                <div className={`registry-card group bg-gradient-to-br ${section.color} ${section.hoverColor} transition-all duration-300 h-full flex flex-col`}>
                  <div className="text-center flex flex-col h-full">
                    <section.icon className="w-12 h-12 text-white mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {section.title}
                    </h3>
                    <p className="text-white/90 mb-6 flex-grow">
                      {section.description}
                    </p>
                    <div className="flex items-center justify-center text-white font-semibold group-hover:translate-x-1 transition-transform duration-200 mt-auto">
                      Explore
                      <ArrowRight size={16} className="ml-2" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Submit Project Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="max-w-4xl mx-auto px-4 mb-16"
      >
        <div className="card text-center">
          <h2 className="text-3xl font-bold text-primary-500 mb-4">
            Submit Your Project
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
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
              Download Template
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Questions? Contact us at generegistry@n1collaborative.org
          </p>
        </div>
      </motion.div>

      {/* API Documentation Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="text-center mb-16"
      >
        <p className="text-white text-lg">
          Looking to integrate or access our data? Visit the{' '}
          <Link to="/api" className="text-primary-300 hover:text-primary-200 font-semibold underline">
            N1C API documentation
          </Link>
          .
        </p>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="text-center py-8 text-white/70"
      >
        <p>© N=1 Collaborative</p>
        <p className="text-sm mt-2">
          Last updated: {new Date().toLocaleString()}
        </p>
      </motion.footer>
    </div>
  );
};

export default Home;
