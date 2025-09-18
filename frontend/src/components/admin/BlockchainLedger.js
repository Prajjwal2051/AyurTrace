import React, { useState, useEffect } from 'react';
import { colorPalette, getGradient, shadows } from '../../styles/colorPalette';
import localStorageManager from '../../utils/localStorage';
import TransactionSearch from './TransactionSearch';
import TransactionDetails from './TransactionDetails';

const BlockchainLedger = ({ onClose }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [activeTab, setActiveTab] = useState('ledger');
  const [filterType, setFilterType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [liveUpdateEnabled, setLiveUpdateEnabled] = useState(true);

  // Transaction type configurations
  const transactionTypes = {
    'batch_creation': {
      icon: '🌱',
      color: colorPalette.success.main,
      label: 'Batch Creation',
      description: 'New herb batch registered on blockchain'
    },
    'manufacturing': {
      icon: '🏭',
      color: colorPalette.warning.main,
      label: 'Manufacturing',
      description: 'Processing and manufacturing operations'
    },
    'product_creation': {
      icon: '📦',
      color: colorPalette.info.main,
      label: 'Product Creation',
      description: 'Final product registered and packaged'
    },
    'verification': {
      icon: '✅',
      color: colorPalette.primary.main,
      label: 'Verification',
      description: 'Consumer product verification'
    },
    'quality_test': {
      icon: '🧪',
      color: colorPalette.secondary.main,
      label: 'Quality Test',
      description: 'Quality testing and certification'
    },
    'transfer': {
      icon: '🔄',
      color: colorPalette.neutral[500],
      label: 'Transfer',
      description: 'Ownership or custody transfer'
    }
  };

  useEffect(() => {
    loadTransactions();
    
    // Set up live updates
    let interval;
    if (liveUpdateEnabled) {
      interval = setInterval(() => {
        loadTransactions();
      }, 5000); // Update every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [liveUpdateEnabled]);

  // eslint-disable-next-line no-use-before-define
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      // Simulate loading delay for realistic feel
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const blockchainTransactions = localStorageManager.getAllBlockchainTransactions();
      const sortedTransactions = blockchainTransactions.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      
      setTransactions(sortedTransactions);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = React.useCallback(() => {
    let filtered = [...transactions];

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(tx => tx.type === filterType);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.hash.toLowerCase().includes(query) ||
        tx.batchId?.toLowerCase().includes(query) ||
        tx.productId?.toLowerCase().includes(query) ||
        tx.from?.toLowerCase().includes(query) ||
        tx.to?.toLowerCase().includes(query) ||
        tx.description?.toLowerCase().includes(query)
      );
    }

    setFilteredTransactions(filtered);
  }, [transactions, filterType, searchQuery]);

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setActiveTab('details');
  };

  const handleSearchResult = (transaction) => {
    setSelectedTransaction(transaction);
    setActiveTab('details');
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatHash = (hash, length = 12) => {
    if (!hash) return 'N/A';
    return hash.length > length ? 
      `${hash.substring(0, 6)}...${hash.substring(hash.length - 6)}` : 
      hash;
  };

  const getTransactionStatus = (transaction) => {
    const now = Date.now();
    const txTime = new Date(transaction.timestamp).getTime();
    const ageMinutes = (now - txTime) / (1000 * 60);

    if (ageMinutes < 5) return { status: 'recent', label: 'New', color: colorPalette.success.main };
    if (ageMinutes < 60) return { status: 'pending', label: 'Processing', color: colorPalette.warning.main };
    return { status: 'confirmed', label: 'Confirmed', color: colorPalette.primary.main };
  };

  const renderTransactionRow = (transaction, index) => {
    const typeConfig = transactionTypes[transaction.type] || transactionTypes['transfer'];
    const status = getTransactionStatus(transaction);
    
    return (
      <div
        key={transaction.hash}
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '12px',
          border: `1px solid ${colorPalette.neutral[200]}`,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
        }}
        onClick={() => handleTransactionClick(transaction)}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = colorPalette.neutral[50];
          e.currentTarget.style.borderColor = typeConfig.color;
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = shadows.lg;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.borderColor = colorPalette.neutral[200];
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto auto',
          alignItems: 'center',
          gap: '15px'
        }}>
          {/* Type Icon */}
          <div style={{
            background: `${typeConfig.color}20`,
            borderRadius: '10px',
            padding: '12px',
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {typeConfig.icon}
          </div>

          {/* Transaction Info */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '5px'
            }}>
              <h6 style={{
                margin: 0,
                color: colorPalette.neutral[800],
                fontSize: '16px',
                fontWeight: '600'
              }}>
                {typeConfig.label}
              </h6>
              <span style={{
                background: status.color,
                color: 'white',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '600'
              }}>
                {status.label}
              </span>
            </div>
            <div style={{
              fontSize: '13px',
              color: colorPalette.neutral[600],
              marginBottom: '3px'
            }}>
              Hash: <span style={{ fontFamily: 'monospace', fontWeight: '500' }}>
                {formatHash(transaction.hash)}
              </span>
            </div>
            {transaction.batchId && (
              <div style={{
                fontSize: '13px',
                color: colorPalette.neutral[600]
              }}>
                Batch: <span style={{ fontFamily: 'monospace' }}>{transaction.batchId}</span>
              </div>
            )}
          </div>

          {/* Participants */}
          <div style={{ textAlign: 'center', minWidth: '120px' }}>
            <div style={{
              fontSize: '12px',
              color: colorPalette.neutral[500],
              marginBottom: '3px'
            }}>
              From
            </div>
            <div style={{
              fontSize: '13px',
              fontWeight: '600',
              color: colorPalette.neutral[700],
              marginBottom: '5px'
            }}>
              {transaction.from || 'System'}
            </div>
            <div style={{
              fontSize: '12px',
              color: colorPalette.neutral[500],
              marginBottom: '3px'
            }}>
              To
            </div>
            <div style={{
              fontSize: '13px',
              fontWeight: '600',
              color: colorPalette.neutral[700]
            }}>
              {transaction.to || 'Network'}
            </div>
          </div>

          {/* Timestamp & Value */}
          <div style={{ textAlign: 'right', minWidth: '140px' }}>
            <div style={{
              fontSize: '13px',
              fontWeight: '600',
              color: colorPalette.neutral[800],
              marginBottom: '3px'
            }}>
              {formatTimestamp(transaction.timestamp)}
            </div>
            {transaction.value && (
              <div style={{
                fontSize: '12px',
                color: colorPalette.success.dark,
                fontWeight: '600'
              }}>
                {transaction.value}
              </div>
            )}
            <div style={{
              fontSize: '11px',
              color: colorPalette.neutral[500],
              marginTop: '5px'
            }}>
              Block: #{transaction.blockNumber || 'Pending'}
            </div>
          </div>
        </div>

        {/* Transaction Description */}
        {transaction.description && (
          <div style={{
            marginTop: '12px',
            padding: '10px',
            background: colorPalette.neutral[50],
            borderRadius: '8px',
            fontSize: '13px',
            color: colorPalette.neutral[600],
            borderLeft: `3px solid ${typeConfig.color}`
          }}>
            {transaction.description}
          </div>
        )}
      </div>
    );
  };

  const tabs = [
    { id: 'ledger', label: 'Blockchain Ledger', icon: '⛓️' },
    { id: 'search', label: 'Search Transactions', icon: '🔍' },
    { id: 'details', label: 'Transaction Details', icon: '📋' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'search':
        return (
          <TransactionSearch
            onTransactionFound={handleSearchResult}
            transactions={transactions}
          />
        );
      case 'details':
        return (
          <TransactionDetails
            transaction={selectedTransaction}
            onBack={() => setActiveTab('ledger')}
          />
        );
      case 'ledger':
      default:
        return (
          <div style={{ height: '100%', overflow: 'auto' }}>
            {/* Controls */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '25px',
              flexWrap: 'wrap',
              gap: '15px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {/* Filter Dropdown */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: `2px solid ${colorPalette.neutral[300]}`,
                    fontSize: '14px',
                    fontWeight: '500',
                    outline: 'none',
                    background: 'white'
                  }}
                >
                  <option value="all">All Transactions</option>
                  {Object.entries(transactionTypes).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>

                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search by hash, batch ID, or participant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: `2px solid ${colorPalette.neutral[300]}`,
                    fontSize: '14px',
                    minWidth: '250px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {/* Live Update Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="liveUpdate"
                    checked={liveUpdateEnabled}
                    onChange={(e) => setLiveUpdateEnabled(e.target.checked)}
                  />
                  <label htmlFor="liveUpdate" style={{
                    fontSize: '14px',
                    color: colorPalette.neutral[700],
                    cursor: 'pointer'
                  }}>
                    Live Updates
                  </label>
                  {liveUpdateEnabled && (
                    <div style={{
                      width: '8px',
                      height: '8px',
                      background: colorPalette.success.main,
                      borderRadius: '50%',
                      animation: 'pulse 2s infinite'
                    }}></div>
                  )}
                </div>

                {/* Transaction Count */}
                <div style={{
                  background: colorPalette.primary[100],
                  color: colorPalette.primary[700],
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {filteredTransactions.length} Transactions
                </div>
              </div>
            </div>

            {/* Transaction List */}
            {isLoading ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '300px',
                flexDirection: 'column'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: `4px solid ${colorPalette.primary[200]}`,
                  borderTop: `4px solid ${colorPalette.primary[500]}`,
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginBottom: '15px'
                }}></div>
                <div style={{
                  color: colorPalette.neutral[600],
                  fontSize: '16px',
                  fontWeight: '500'
                }}>
                  Loading blockchain transactions...
                </div>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: colorPalette.neutral[500]
              }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>⛓️</div>
                <h5 style={{ marginBottom: '10px' }}>No Transactions Found</h5>
                <p>No transactions match your current filters.</p>
              </div>
            ) : (
              <div style={{
                maxHeight: '600px',
                overflowY: 'auto',
                paddingRight: '5px'
              }}>
                {filteredTransactions.map((transaction, index) => 
                  renderTransactionRow(transaction, index)
                )}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }}>
      <div style={{
        background: colorPalette.glass.white,
        backdropFilter: 'blur(20px)',
        borderRadius: '25px',
        width: '100%',
        maxWidth: '1200px',
        maxHeight: '95vh',
        overflow: 'hidden',
        boxShadow: shadows.xl,
        border: `1px solid ${colorPalette.glass.border}`,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          background: getGradient('primary'),
          padding: '25px 35px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold' }}>
              ⛓️ AyurTrace Blockchain Ledger
            </h4>
            <p style={{ margin: '5px 0 0 0', fontSize: '1rem', opacity: 0.9 }}>
              Real-time view of all transactions on the blockchain network
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '45px',
              height: '45px',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          background: colorPalette.neutral[50],
          borderBottom: `1px solid ${colorPalette.neutral[200]}`,
          padding: '0 35px',
          display: 'flex',
          gap: '0'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'white' : 'transparent',
                border: 'none',
                padding: '15px 25px',
                borderRadius: activeTab === tab.id ? '15px 15px 0 0' : '0',
                color: activeTab === tab.id ? colorPalette.primary[600] : colorPalette.neutral[600],
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: activeTab === tab.id ? '-1px' : '0',
                boxShadow: activeTab === tab.id ? shadows.sm : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '16px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{
          flex: 1,
          overflow: 'hidden',
          padding: '35px',
          background: 'white'
        }}>
          {renderTabContent()}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default BlockchainLedger;
