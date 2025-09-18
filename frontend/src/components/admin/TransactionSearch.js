import React, { useState, useEffect } from 'react';
import { colorPalette, getGradient, shadows } from '../../styles/colorPalette';

const TransactionSearch = ({ onTransactionFound, transactions }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    dateRange: 'all',
    transactionType: 'all',
    status: 'all',
    participantType: 'all'
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const searchTypes = [
    { value: 'all', label: 'All Fields', icon: '🔍' },
    { value: 'hash', label: 'Transaction Hash', icon: '#️⃣' },
    { value: 'batch', label: 'Batch ID', icon: '🌱' },
    { value: 'product', label: 'Product ID', icon: '📦' },
    { value: 'participant', label: 'Participant', icon: '👤' }
  ];

  const sampleSearches = [
    { query: '0x1a2b3c4d', type: 'hash', description: 'Search by transaction hash' },
    { query: 'BATCH-F-2024-012', type: 'batch', description: 'Search by batch identifier' },
    { query: 'PROD-M-2024-001', type: 'product', description: 'Search by product ID' },
    { query: 'Rajesh Kumar', type: 'participant', description: 'Search by participant name' },
    { query: 'manufacturing', type: 'all', description: 'Search all manufacturing transactions' }
  ];

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [performSearch, searchQuery]);

  const performSearch = React.useCallback(async () => {
    setIsSearching(true);
    
    try {
      // Simulate search delay
      await new Promise(resolve => setTimeout(resolve, 500));

      let results = [...transactions];
      const query = searchQuery.toLowerCase().trim();

      // Apply search query filter
      if (query) {
        results = results.filter(tx => {
          switch (searchType) {
            case 'hash':
              return tx.hash?.toLowerCase().includes(query);
            case 'batch':
              return tx.batchId?.toLowerCase().includes(query);
            case 'product':
              return tx.productId?.toLowerCase().includes(query);
            case 'participant':
              return tx.from?.toLowerCase().includes(query) || 
                     tx.to?.toLowerCase().includes(query);
            case 'all':
            default:
              return tx.hash?.toLowerCase().includes(query) ||
                     tx.batchId?.toLowerCase().includes(query) ||
                     tx.productId?.toLowerCase().includes(query) ||
                     tx.from?.toLowerCase().includes(query) ||
                     tx.to?.toLowerCase().includes(query) ||
                     tx.description?.toLowerCase().includes(query) ||
                     tx.type?.toLowerCase().includes(query);
          }
        });
      }

      // Apply advanced filters
      if (selectedFilters.transactionType !== 'all') {
        results = results.filter(tx => tx.type === selectedFilters.transactionType);
      }

      if (selectedFilters.dateRange !== 'all') {
        const now = new Date();
        const filterDate = new Date();
        
        switch (selectedFilters.dateRange) {
          case 'today':
            filterDate.setHours(0, 0, 0, 0);
            break;
          case 'week':
            filterDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            filterDate.setMonth(now.getMonth() - 1);
            break;
          case 'year':
            filterDate.setFullYear(now.getFullYear() - 1);
            break;
          default:
            break;
        }

        if (selectedFilters.dateRange !== 'all') {
          results = results.filter(tx => new Date(tx.timestamp) >= filterDate);
        }
      }

      // Sort by relevance and recency
      results.sort((a, b) => {
        // First sort by exact match priority
        const aExactMatch = a.hash?.toLowerCase() === query || a.batchId?.toLowerCase() === query;
        const bExactMatch = b.hash?.toLowerCase() === query || b.batchId?.toLowerCase() === query;
        
        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;
        
        // Then sort by timestamp (most recent first)
        return new Date(b.timestamp) - new Date(a.timestamp);
      });

      setSearchResults(results);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, searchType, selectedFilters, transactions]);

  const handleSampleSearch = (sample) => {
    setSearchQuery(sample.query);
    setSearchType(sample.type);
  };

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedFilters({
      dateRange: 'all',
      transactionType: 'all',
      status: 'all',
      participantType: 'all'
    });
  };

  const formatHash = (hash) => {
    if (!hash) return 'N/A';
    return hash.length > 16 ? 
      `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}` : 
      hash;
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionTypeInfo = (type) => {
    const types = {
      'batch_creation': { icon: '🌱', color: colorPalette.success.main, label: 'Batch Creation' },
      'manufacturing': { icon: '🏭', color: colorPalette.warning.main, label: 'Manufacturing' },
      'product_creation': { icon: '📦', color: colorPalette.info.main, label: 'Product Creation' },
      'verification': { icon: '✅', color: colorPalette.primary.main, label: 'Verification' },
      'quality_test': { icon: '🧪', color: colorPalette.secondary.main, label: 'Quality Test' },
      'transfer': { icon: '🔄', color: colorPalette.neutral[500], label: 'Transfer' }
    };
    return types[type] || types['transfer'];
  };

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      {/* Search Header */}
      <div style={{
        background: colorPalette.primary[50],
        borderRadius: '15px',
        padding: '25px',
        marginBottom: '25px',
        border: `1px solid ${colorPalette.primary[200]}`
      }}>
        <h5 style={{
          margin: '0 0 15px 0',
          color: colorPalette.primary[700],
          fontSize: '18px',
          fontWeight: '600'
        }}>
          🔍 Search Blockchain Transactions
        </h5>
        <p style={{
          margin: 0,
          color: colorPalette.neutral[600],
          fontSize: '14px'
        }}>
          Search by transaction hash, batch ID, product ID, or participant name
        </p>
      </div>

      {/* Search Controls */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '25px',
        marginBottom: '25px',
        border: `1px solid ${colorPalette.neutral[200]}`
      }}>
        {/* Search Type Selector */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: colorPalette.neutral[700]
          }}>
            Search Type
          </label>
          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            {searchTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSearchType(type.value)}
                style={{
                  background: searchType === type.value ? getGradient('primary') : 'white',
                  color: searchType === type.value ? 'white' : colorPalette.neutral[600],
                  border: `2px solid ${searchType === type.value ? 'transparent' : colorPalette.neutral[300]}`,
                  borderRadius: '10px',
                  padding: '8px 15px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{type.icon}</span>
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: colorPalette.neutral[700]
          }}>
            Search Query
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Enter ${searchTypes.find(t => t.value === searchType)?.label.toLowerCase()}...`}
              style={{
                width: '100%',
                padding: '12px 45px 12px 18px',
                borderRadius: '12px',
                border: `2px solid ${colorPalette.primary[200]}`,
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = colorPalette.primary[400]}
              onBlur={(e) => e.currentTarget.style.borderColor = colorPalette.primary[200]}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: colorPalette.neutral[500],
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            )}
            {isSearching && (
              <div style={{
                position: 'absolute',
                right: '45px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                border: `2px solid ${colorPalette.primary[200]}`,
                borderTop: `2px solid ${colorPalette.primary[500]}`,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            )}
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          style={{
            background: 'none',
            border: `1px solid ${colorPalette.neutral[300]}`,
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '14px',
            color: colorPalette.neutral[600],
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: showAdvancedFilters ? '20px' : '0'
          }}
        >
          <span>{showAdvancedFilters ? '▼' : '▶'}</span>
          Advanced Filters
        </button>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div style={{
            background: colorPalette.neutral[50],
            borderRadius: '10px',
            padding: '15px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '15px'
          }}>
            <div>
              <label style={{ fontSize: '12px', color: colorPalette.neutral[600], marginBottom: '5px', display: 'block' }}>
                Date Range
              </label>
              <select
                value={selectedFilters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: `1px solid ${colorPalette.neutral[300]}`,
                  fontSize: '13px'
                }}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: colorPalette.neutral[600], marginBottom: '5px', display: 'block' }}>
                Transaction Type
              </label>
              <select
                value={selectedFilters.transactionType}
                onChange={(e) => handleFilterChange('transactionType', e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: `1px solid ${colorPalette.neutral[300]}`,
                  fontSize: '13px'
                }}
              >
                <option value="all">All Types</option>
                <option value="batch_creation">Batch Creation</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="product_creation">Product Creation</option>
                <option value="verification">Verification</option>
                <option value="quality_test">Quality Test</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Sample Searches */}
      {!searchQuery && (
        <div style={{
          background: colorPalette.warning[50],
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '25px',
          border: `1px solid ${colorPalette.warning.main}40`
        }}>
          <h6 style={{
            margin: '0 0 15px 0',
            color: colorPalette.warning.dark,
            fontSize: '16px',
            fontWeight: '600'
          }}>
            💡 Sample Searches
          </h6>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '10px'
          }}>
            {sampleSearches.map((sample, index) => (
              <button
                key={index}
                onClick={() => handleSampleSearch(sample)}
                style={{
                  background: 'white',
                  border: `1px solid ${colorPalette.neutral[300]}`,
                  borderRadius: '8px',
                  padding: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colorPalette.warning.main;
                  e.currentTarget.style.background = colorPalette.warning[50];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colorPalette.neutral[300];
                  e.currentTarget.style.background = 'white';
                }}
              >
                <div style={{
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: colorPalette.primary[600],
                  marginBottom: '3px'
                }}>
                  {sample.query}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: colorPalette.neutral[600]
                }}>
                  {sample.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchQuery && (
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          border: `1px solid ${colorPalette.neutral[200]}`
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h6 style={{
              margin: 0,
              color: colorPalette.neutral[800],
              fontSize: '16px',
              fontWeight: '600'
            }}>
              Search Results
            </h6>
            <div style={{
              background: colorPalette.primary[100],
              color: colorPalette.primary[700],
              padding: '5px 12px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              {searchResults.length} found
            </div>
          </div>

          {searchResults.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: colorPalette.neutral[500]
            }}>
              <div style={{ fontSize: '32px', marginBottom: '15px' }}>🔍</div>
              <h6 style={{ marginBottom: '8px' }}>No Results Found</h6>
              <p style={{ margin: 0, fontSize: '14px' }}>
                Try adjusting your search query or filters
              </p>
            </div>
          ) : (
            <div style={{
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              {searchResults.map((transaction, index) => {
                const typeInfo = getTransactionTypeInfo(transaction.type);
                
                return (
                  <div
                    key={transaction.hash}
                    onClick={() => onTransactionFound(transaction)}
                    style={{
                      background: colorPalette.neutral[50],
                      borderRadius: '12px',
                      padding: '15px',
                      marginBottom: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: `1px solid ${colorPalette.neutral[200]}`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.borderColor = typeInfo.color;
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = shadows.md;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = colorPalette.neutral[50];
                      e.currentTarget.style.borderColor = colorPalette.neutral[200];
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr auto',
                      alignItems: 'center',
                      gap: '15px'
                    }}>
                      <div style={{
                        background: `${typeInfo.color}20`,
                        borderRadius: '8px',
                        padding: '8px',
                        fontSize: '16px'
                      }}>
                        {typeInfo.icon}
                      </div>

                      <div>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: colorPalette.neutral[800],
                          marginBottom: '3px'
                        }}>
                          {typeInfo.label}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: colorPalette.neutral[600],
                          fontFamily: 'monospace'
                        }}>
                          {formatHash(transaction.hash)}
                        </div>
                        {transaction.batchId && (
                          <div style={{
                            fontSize: '11px',
                            color: colorPalette.neutral[500],
                            marginTop: '2px'
                          }}>
                            Batch: {transaction.batchId}
                          </div>
                        )}
                      </div>

                      <div style={{
                        textAlign: 'right',
                        fontSize: '12px',
                        color: colorPalette.neutral[600]
                      }}>
                        {formatTimestamp(transaction.timestamp)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TransactionSearch;
