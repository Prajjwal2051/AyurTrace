import React, { useState, useEffect } from 'react';
import localStorageManager from '../../utils/localStorage';

const BlockchainViewer = ({ limit = 5, showSearch = true, compact = false }) => {
  const [blocks, setBlocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBlocks, setFilteredBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Generate mock blockchain data based on real batch data
  useEffect(() => {
    const generateBlockchainData = () => {
      setIsLoading(true);
      const batches = localStorageManager.getBatches();
      const products = localStorageManager.getProducts();
      const verifications = localStorageManager.getVerifications();
      
      const blockchainBlocks = [];
      let blockNumber = 1;

      // Genesis block
      blockchainBlocks.push({
        blockNumber: blockNumber++,
        hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        previousHash: null,
        timestamp: new Date('2024-01-01').toISOString(),
        transactionCount: 1,
        type: 'GENESIS',
        data: {
          message: 'AyurTrace Blockchain Genesis Block',
          network: 'AyurTrace Network v1.0'
        },
        merkleRoot: generateHash(),
        difficulty: 4,
        nonce: 0
      });

      // Batch creation transactions
      batches.forEach(batch => {
        blockchainBlocks.push({
          blockNumber: blockNumber++,
          hash: generateHash(),
          previousHash: blockchainBlocks[blockchainBlocks.length - 1].hash,
          timestamp: batch.createdAt,
          transactionCount: 1,
          type: 'HARVEST',
          data: {
            batchId: batch.id,
            herbType: batch.crop,
            farmerName: batch.farmerName,
            location: batch.location,
            quantity: batch.quantity,
            quality: batch.quality,
            transactionHash: generateHash()
          },
          merkleRoot: generateHash(),
          difficulty: 4,
          nonce: Math.floor(Math.random() * 1000000)
        });
      });

      // Product processing transactions
      products.forEach(product => {
        blockchainBlocks.push({
          blockNumber: blockNumber++,
          hash: generateHash(),
          previousHash: blockchainBlocks[blockchainBlocks.length - 1].hash,
          timestamp: product.createdAt,
          transactionCount: 1,
          type: 'PROCESS',
          data: {
            productId: product.id,
            batchId: product.batchId,
            productName: product.productName,
            manufacturerName: product.manufacturerName,
            processingDate: product.processingDate,
            transactionHash: generateHash()
          },
          merkleRoot: generateHash(),
          difficulty: 4,
          nonce: Math.floor(Math.random() * 1000000)
        });
      });

      // Verification transactions
      verifications.forEach(verification => {
        blockchainBlocks.push({
          blockNumber: blockNumber++,
          hash: generateHash(),
          previousHash: blockchainBlocks[blockchainBlocks.length - 1].hash,
          timestamp: verification.verificationDate,
          transactionCount: 1,
          type: 'VERIFY',
          data: {
            verificationId: verification.id,
            batchId: verification.batchId,
            status: verification.status,
            confidence: verification.confidence,
            location: verification.location,
            transactionHash: generateHash()
          },
          merkleRoot: generateHash(),
          difficulty: 4,
          nonce: Math.floor(Math.random() * 1000000)
        });
      });

      // Sort by timestamp (newest first) and limit
      const sortedBlocks = blockchainBlocks
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);

      setBlocks(sortedBlocks);
      setFilteredBlocks(sortedBlocks);
      setIsLoading(false);
    };

    generateBlockchainData();
  }, [limit]);

  const generateHash = () => {
    return '0x' + Math.random().toString(16).substring(2, 18) + 
           Math.random().toString(16).substring(2, 18) +
           Math.random().toString(16).substring(2, 18);
  };

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBlocks(blocks);
    } else {
      const filtered = blocks.filter(block => 
        block.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        block.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        JSON.stringify(block.data).toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBlocks(filtered);
    }
  }, [searchTerm, blocks]);

  const getTypeColor = (type) => {
    switch (type) {
      case 'GENESIS': return '#6c757d';
      case 'HARVEST': return '#4CAF50';
      case 'PROCESS': return '#FF9800';
      case 'VERIFY': return '#2196F3';
      default: return '#6c757d';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'GENESIS': return '🏗️';
      case 'HARVEST': return '🌱';
      case 'PROCESS': return '🏭';
      case 'VERIFY': return '✅';
      default: return '📦';
    }
  };

  const formatHash = (hash, length = 10) => {
    if (!hash) return '';
    return hash.length > length ? `${hash.substring(0, length)}...${hash.substring(hash.length - 6)}` : hash;
  };

  const BlockCard = ({ block, isCompact = false }) => (
    <div
      style={{
        background: selectedBlock?.blockNumber === block.blockNumber 
          ? `linear-gradient(135deg, ${getTypeColor(block.type)}20, ${getTypeColor(block.type)}10)`
          : 'white',
        borderRadius: '15px',
        padding: isCompact ? '15px' : '20px',
        margin: '10px 0',
        boxShadow: selectedBlock?.blockNumber === block.blockNumber 
          ? `0 15px 35px ${getTypeColor(block.type)}30`
          : '0 5px 15px rgba(0,0,0,0.1)',
        border: selectedBlock?.blockNumber === block.blockNumber 
          ? `2px solid ${getTypeColor(block.type)}`
          : '1px solid #e0e0e0',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={() => setSelectedBlock(selectedBlock?.blockNumber === block.blockNumber ? null : block)}
      onMouseEnter={(e) => {
        if (selectedBlock?.blockNumber !== block.blockNumber) {
          e.currentTarget.style.transform = 'translateX(5px)';
          e.currentTarget.style.boxShadow = `0 10px 25px ${getTypeColor(block.type)}20`;
        }
      }}
      onMouseLeave={(e) => {
        if (selectedBlock?.blockNumber !== block.blockNumber) {
          e.currentTarget.style.transform = 'translateX(0)';
          e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        }
      }}
    >
      {/* Block header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: isCompact ? '8px' : '15px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            fontSize: isCompact ? '16px' : '20px',
            marginRight: '10px'
          }}>
            {getTypeIcon(block.type)}
          </div>
          <div>
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: isCompact ? '14px' : '16px',
              color: '#333'
            }}>
              Block #{block.blockNumber}
            </div>
            <div style={{ 
              fontSize: isCompact ? '11px' : '12px', 
              color: getTypeColor(block.type),
              fontWeight: '600',
              textTransform: 'uppercase'
            }}>
              {block.type}
            </div>
          </div>
        </div>
        <div style={{ 
          textAlign: 'right',
          fontSize: isCompact ? '10px' : '11px',
          color: '#666'
        }}>
          {new Date(block.timestamp).toLocaleString()}
        </div>
      </div>

      {/* Block details */}
      <div style={{ fontSize: isCompact ? '11px' : '12px', color: '#666', marginBottom: '10px' }}>
        <div style={{ marginBottom: '5px' }}>
          <strong>Hash:</strong> <code style={{ 
            background: '#f8f9fa', 
            padding: '2px 6px', 
            borderRadius: '4px',
            fontSize: isCompact ? '10px' : '11px'
          }}>
            {formatHash(block.hash)}
          </code>
        </div>
        {!isCompact && block.previousHash && (
          <div style={{ marginBottom: '5px' }}>
            <strong>Previous:</strong> <code style={{ 
              background: '#f8f9fa', 
              padding: '2px 6px', 
              borderRadius: '4px',
              fontSize: '11px'
            }}>
              {formatHash(block.previousHash)}
            </code>
          </div>
        )}
        <div>
          <strong>Transactions:</strong> {block.transactionCount} | 
          <strong> Nonce:</strong> {block.nonce}
        </div>
      </div>

      {/* Transaction data preview */}
      <div style={{
        background: '#f8f9fa',
        borderRadius: '8px',
        padding: isCompact ? '8px' : '12px',
        fontSize: isCompact ? '11px' : '12px'
      }}>
        {block.type === 'HARVEST' && (
          <div>
            <strong>🌱 Batch:</strong> {block.data.batchId}<br />
            <strong>Herb:</strong> {block.data.herbType} ({block.data.quantity})<br />
            <strong>Farmer:</strong> {block.data.farmerName}
          </div>
        )}
        {block.type === 'PROCESS' && (
          <div>
            <strong>🏭 Product:</strong> {block.data.productName}<br />
            <strong>Batch:</strong> {block.data.batchId}<br />
            <strong>Manufacturer:</strong> {block.data.manufacturerName}
          </div>
        )}
        {block.type === 'VERIFY' && (
          <div>
            <strong>✅ Verification:</strong> {block.data.status}<br />
            <strong>Confidence:</strong> {block.data.confidence}%<br />
            <strong>Location:</strong> {block.data.location}
          </div>
        )}
        {block.type === 'GENESIS' && (
          <div>
            <strong>🏗️ Genesis:</strong> {block.data.message}<br />
            <strong>Network:</strong> {block.data.network}
          </div>
        )}
      </div>

      {/* Expand indicator */}
      <div style={{
        position: 'absolute',
        top: '15px',
        right: '15px',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: selectedBlock?.blockNumber === block.blockNumber 
          ? getTypeColor(block.type) 
          : '#e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        color: 'white',
        transition: 'all 0.3s ease'
      }}>
        {selectedBlock?.blockNumber === block.blockNumber ? '−' : '+'}
      </div>

      {/* Detailed view */}
      {selectedBlock?.blockNumber === block.blockNumber && (
        <div style={{
          marginTop: '15px',
          padding: '15px',
          background: 'white',
          borderRadius: '8px',
          border: `1px solid ${getTypeColor(block.type)}30`,
          fontSize: '12px'
        }}>
          <h6 style={{ color: getTypeColor(block.type), marginBottom: '10px' }}>
            📋 Detailed Block Information
          </h6>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <strong>Block Number:</strong> {block.blockNumber}<br />
              <strong>Merkle Root:</strong> <code>{formatHash(block.merkleRoot)}</code><br />
              <strong>Difficulty:</strong> {block.difficulty}
            </div>
            <div>
              <strong>Transaction Count:</strong> {block.transactionCount}<br />
              <strong>Block Size:</strong> {Math.floor(JSON.stringify(block).length / 1024)} KB<br />
              <strong>Mining Time:</strong> ~{Math.floor(Math.random() * 10) + 1}s
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <strong>Full Transaction Data:</strong>
            <pre style={{
              background: '#f8f9fa',
              padding: '10px',
              borderRadius: '4px',
              fontSize: '10px',
              overflow: 'auto',
              maxHeight: '150px',
              marginTop: '5px'
            }}>
              {JSON.stringify(block.data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #4CAF50',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }} />
        <h4>Loading Blockchain Data...</h4>
        <p style={{ color: '#666' }}>Fetching recent transactions from the AyurTrace network</p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: compact ? '20px' : '40px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        borderBottom: '1px solid #e0e0e0',
        paddingBottom: '20px'
      }}>
        <h3 style={{ 
          color: '#333', 
          marginBottom: '10px',
          fontSize: compact ? '1.2rem' : '1.5rem'
        }}>
          ⛓️ Blockchain Ledger
        </h3>
        <p style={{ color: '#666', fontSize: '14px', margin: '0' }}>
          Real-time view of transactions on the AyurTrace blockchain network
        </p>
      </div>

      {/* Search */}
      {showSearch && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by hash, type, or data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 40px 12px 15px',
                borderRadius: '25px',
                border: '2px solid #e0e0e0',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#4CAF50'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
            />
            <div style={{
              position: 'absolute',
              right: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#666'
            }}>
              🔍
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '15px',
        marginBottom: '25px'
      }}>
        <div style={{
          background: '#4CAF50',
          color: 'white',
          padding: '15px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.8em', fontWeight: 'bold' }}>{blocks.length}</div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>Total Blocks</div>
        </div>
        <div style={{
          background: '#2196F3',
          color: 'white',
          padding: '15px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.8em', fontWeight: 'bold' }}>
            {blocks.reduce((sum, block) => sum + block.transactionCount, 0)}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>Transactions</div>
        </div>
        <div style={{
          background: '#FF9800',
          color: 'white',
          padding: '15px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.8em', fontWeight: 'bold' }}>98.7%</div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>Network Health</div>
        </div>
      </div>

      {/* Blockchain blocks */}
      <div>
        {filteredBlocks.length > 0 ? (
          filteredBlocks.map((block) => (
            <BlockCard key={block.blockNumber} block={block} isCompact={compact} />
          ))
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#666'
          }}>
            <div style={{ fontSize: '3em', marginBottom: '15px' }}>🔍</div>
            <h4>No blocks found</h4>
            <p>Try adjusting your search terms</p>
          </div>
        )}
      </div>

      {/* Footer info */}
      {!compact && (
        <div style={{
          marginTop: '25px',
          padding: '15px',
          background: '#f8f9fa',
          borderRadius: '10px',
          fontSize: '12px',
          color: '#666',
          textAlign: 'center'
        }}>
          ℹ️ This is a demonstration of blockchain visualization. In production, this would connect to a real Hyperledger Fabric network.
        </div>
      )}

      {/* CSS for animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default BlockchainViewer;
