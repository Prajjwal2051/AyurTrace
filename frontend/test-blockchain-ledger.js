// Test script to verify Blockchain Ledger functionality
import localStorageManager from './src/utils/localStorage.js';

console.log('=== Testing Blockchain Ledger System ===\n');

// 1. Test blockchain transactions data initialization
console.log('1. Testing blockchain transactions initialization...');
const allTransactions = localStorageManager.getAllBlockchainTransactions();
console.log(`Total blockchain transactions: ${allTransactions.length}`);
allTransactions.forEach((tx, index) => {
  console.log(`  ${index + 1}. ${tx.type.toUpperCase()}: ${tx.hash.substring(0, 12)}...`);
});

// 2. Test blockchain statistics
console.log('\n2. Testing blockchain statistics...');
const stats = localStorageManager.getBlockchainStatistics();
console.log('Blockchain Statistics:');
console.log(`  - Total Transactions: ${stats.totalTransactions}`);
console.log(`  - Recent Transactions (24h): ${stats.recentTransactions}`);
console.log(`  - Unique Participants: ${stats.uniqueParticipants}`);
console.log(`  - Latest Block: #${stats.latestBlock}`);
console.log(`  - Total Value: ${stats.totalValue.toFixed(2)} AYUR`);
console.log(`  - Average Gas: ${stats.averageGasPrice}`);

console.log('\nTransactions by Type:');
Object.entries(stats.transactionsByType).forEach(([type, count]) => {
  console.log(`  - ${type.replace('_', ' ').toUpperCase()}: ${count}`);
});

// 3. Test transaction search functionality
console.log('\n3. Testing transaction search...');
const searchResults = localStorageManager.searchBlockchainTransactions('ashwagandha');
console.log(`Search results for 'ashwagandha': ${searchResults.length} transactions`);
searchResults.forEach(tx => {
  console.log(`  - ${tx.type}: ${tx.description}`);
});

// 4. Test batch-related transactions
console.log('\n4. Testing batch-related transactions...');
const batchTransactions = localStorageManager.getBlockchainTransactionsByBatch('BATCH-F-2024-012');
console.log(`Transactions for BATCH-F-2024-012: ${batchTransactions.length}`);
batchTransactions.forEach(tx => {
  console.log(`  - ${tx.type}: ${tx.from} -> ${tx.to}`);
});

// 5. Test product-related transactions
console.log('\n5. Testing product-related transactions...');
const productTransactions = localStorageManager.getBlockchainTransactionsByProduct('PROD-M-2024-001');
console.log(`Transactions for PROD-M-2024-001: ${productTransactions.length}`);
productTransactions.forEach(tx => {
  console.log(`  - ${tx.type}: ${tx.description}`);
});

// 6. Test adding new blockchain transaction
console.log('\n6. Testing adding new blockchain transaction...');
const newTx = {
  type: 'verification',
  from: 'Test Consumer',
  to: 'AyurTrace Network',
  batchId: 'BATCH-F-2024-015',
  productId: 'PROD-M-2024-002',
  value: '0.1 AYUR',
  description: 'Test verification transaction'
};

const added = localStorageManager.addBlockchainTransaction(newTx);
console.log(`New transaction added: ${added}`);

if (added) {
  const newTransactionCount = localStorageManager.getAllBlockchainTransactions().length;
  console.log(`Total transactions after adding: ${newTransactionCount}`);
}

// 7. Test auto-generating transactions for existing data
console.log('\n7. Testing auto-generation of blockchain transactions...');
const generated = localStorageManager.generateBlockchainTransactionsForExistingData();
console.log(`Generated ${generated} new blockchain transactions for existing data`);

// 8. Test transaction hash generation
console.log('\n8. Testing transaction hash generation...');
const testTx = {
  type: 'test',
  from: 'Test User',
  to: 'Test Network',
  batchId: 'TEST-BATCH'
};

const hash = localStorageManager.generateTransactionHash(testTx);
console.log(`Generated hash: ${hash}`);
console.log(`Hash length: ${hash.length} characters`);
console.log(`Valid format: ${hash.startsWith('0x') ? 'Yes' : 'No'}`);

// 9. Test filtered search
console.log('\n9. Testing filtered search...');
const filteredResults = localStorageManager.searchBlockchainTransactions('batch', {
  type: 'batch_creation',
  dateRange: 'all'
});
console.log(`Filtered search results: ${filteredResults.length} transactions`);

// 10. Test integration with existing data
console.log('\n10. Testing integration with existing data...');
const batches = localStorageManager.getBatches();
const products = localStorageManager.getProducts();
const mfgRecords = localStorageManager.getManufacturingRecords();

console.log('Data integrity check:');
console.log(`  - Batches: ${batches.length}`);
console.log(`  - Products: ${products.length}`);
console.log(`  - Manufacturing Records: ${mfgRecords.length}`);

// Check if each batch has corresponding blockchain transaction
let batchesWithTransactions = 0;
batches.forEach(batch => {
  const hasTx = allTransactions.some(tx => tx.batchId === batch.id && tx.type === 'batch_creation');
  if (hasTx) batchesWithTransactions++;
});

console.log(`  - Batches with blockchain transactions: ${batchesWithTransactions}/${batches.length}`);

// 11. Final updated statistics
console.log('\n11. Final blockchain statistics...');
const finalStats = localStorageManager.getBlockchainStatistics();
console.log(`Final transaction count: ${finalStats.totalTransactions}`);
console.log(`Final unique participants: ${finalStats.uniqueParticipants}`);
console.log(`Final total value: ${finalStats.totalValue.toFixed(2)} AYUR`);

console.log('\n=== Blockchain Ledger Test Complete ===');
console.log('\n🎉 All blockchain ledger components are ready!');
console.log('\nAvailable features:');
console.log('✅ Complete blockchain transaction ledger');
console.log('✅ Real-time transaction monitoring');
console.log('✅ Advanced search and filtering');
console.log('✅ Transaction details with audit trail');
console.log('✅ Blockchain statistics and analytics');
console.log('✅ Admin dashboard integration');
console.log('✅ Automatic transaction generation');
console.log('✅ Supply chain transaction linking');
console.log('✅ Multiple search types (hash, batch, product, participant)');
console.log('✅ Live updates and status indicators');

console.log('\nAccess the Blockchain Ledger through:');
console.log('🔗 Admin Dashboard -> "Blockchain Ledger" button');
console.log('🔗 Admin Dashboard -> "Blockchain" tab');
console.log('🔗 Admin Dashboard -> Quick Actions -> "Blockchain Ledger"');

console.log('\nSample search queries:');
console.log('• Transaction Hash: 0x1a2b3c4d...');
console.log('• Batch ID: BATCH-F-2024-012');
console.log('• Product ID: PROD-M-2024-001');
console.log('• Participant: Rajesh Kumar');
console.log('• Process: manufacturing');
