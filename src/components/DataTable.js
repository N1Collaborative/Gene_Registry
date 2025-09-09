import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const DataTable = ({ data, type, headers }) => {
  const navigate = useNavigate();

  // Sort data by c. notation position
  const sortedData = useMemo(() => {
    if (type === 'marketed') {
      // For marketed drugs, sort alphabetically
      return [...data].sort((a, b) => {
        const aKey = (a['Marketed drug'] || "").toLowerCase();
        const bKey = (b['Marketed drug'] || "").toLowerCase();
        return aKey.localeCompare(bKey);
      });
    }

    // For gene-based tables, sort by c. notation position
    const extractPosition = (cNotation) => {
      const match = cNotation.match(/c\.(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    };

    return [...data].sort((a, b) => {
      const aC = a["Coding DNA change (c.)"] || "";
      const bC = b["Coding DNA change (c.)"] || "";
      
      const aPos = extractPosition(aC);
      const bPos = extractPosition(bC);
      
      return aPos - bPos;
    });
  }, [data, type]);

  const handleRowClick = (item) => {
    if (type === 'n1c') {
      navigate(`/entry/${item.ID}`);
    } else if (type === 'variants') {
      navigate(`/variant-entry/${item.ID}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {data.length} total entries
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {headers.map(header => (
                <th key={header} className="table-header">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => (
              <motion.tr
                key={item.ID || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                onClick={() => handleRowClick(item)}
                className={`table-row ${(type === 'n1c' || type === 'variants') ? 'cursor-pointer' : ''}`}
              >
                {headers.map(header => (
                  <td key={header} className="table-cell">
                    {item[header] || 'N/A'}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
