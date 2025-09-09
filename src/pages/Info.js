import React from 'react';
import { motion } from 'framer-motion';
import { Info as InfoIcon, Database, Users, Globe, Mail } from 'lucide-react';

const InfoPage = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About the N1C Gene Registry
          </h1>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center gap-3 mb-4">
              <InfoIcon className="w-6 h-6 text-primary-500" />
              <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              The N1C Gene Registry is a comprehensive, searchable database of therapeutic approaches 
              for rare genetic variants, curated by the N=1 Collaborative. Our mission is to facilitate 
              collaboration and accelerate the development of treatments for rare genetic conditions by 
              providing a centralized platform for researchers, clinicians, and patients to discover 
              ongoing therapeutic developments.
            </p>
          </motion.div>

          {/* What We Do */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-primary-500" />
              <h2 className="text-2xl font-bold text-gray-800">What We Do</h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <p>
                We maintain three main registries to provide comprehensive coverage of genetic therapy development:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>N-of-1 Projects:</strong> Track individual therapeutic developments for specific genetic variants</li>
                <li><strong>Marketed Genetic Therapies:</strong> Catalog approved and commercially available genetic treatments</li>
                <li><strong>Assessed Variants:</strong> Document variants that have been evaluated for therapeutic eligibility</li>
              </ul>
            </div>
          </motion.div>

          {/* Our Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card"
          >
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-primary-500" />
              <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              The N=1 Collaborative is dedicated to advancing the development of treatments for ultra-rare 
              genetic conditions. We believe that every patient deserves access to potential therapeutic 
              options, regardless of how rare their condition may be. By maintaining this registry, we 
              aim to connect researchers, clinicians, and patients with the information they need to 
              accelerate the development of life-changing treatments.
            </p>
          </motion.div>

          {/* How to Contribute */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="card"
          >
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-primary-500" />
              <h2 className="text-2xl font-bold text-gray-800">How to Contribute</h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <p>
                We welcome contributions from researchers, clinicians, and organizations working on 
                genetic therapies. You can contribute by:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Submitting information about your therapeutic development projects</li>
                <li>Providing updates on the status of existing entries</li>
                <li>Sharing data about marketed genetic therapies</li>
                <li>Contributing variant assessments and eligibility evaluations</li>
              </ul>
              <p className="mt-4">
                To submit your project, use our online form or download the submission template 
                for bulk entries.
              </p>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="card"
          >
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-primary-500" />
              <h2 className="text-2xl font-bold text-gray-800">Contact Us</h2>
            </div>
            <div className="space-y-3 text-gray-600">
              <p>
                For questions about the Gene Registry or to submit updates, please contact us at:
              </p>
              <p className="font-semibold text-primary-600">
                generegistry@n1collaborative.org
              </p>
              <p>
                We welcome feedback, suggestions, and contributions from the research community.
              </p>
            </div>
          </motion.div>

          {/* Additional Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="card"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Additional Resources</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                <strong>N=1 Collaborative Website:</strong>{' '}
                <a 
                  href="https://www.n1collaborative.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-500 hover:text-primary-600 underline"
                >
                  www.n1collaborative.org
                </a>
              </p>
              <p>
                <strong>Main Registry:</strong>{' '}
                <a 
                  href="https://generegistry.n1collaborative.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-500 hover:text-primary-600 underline"
                >
                  generegistry.n1collaborative.org
                </a>
              </p>
              <p>
                <strong>API Documentation:</strong>{' '}
                <a 
                  href="/api" 
                  className="text-primary-500 hover:text-primary-600 underline"
                >
                  View API documentation
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
