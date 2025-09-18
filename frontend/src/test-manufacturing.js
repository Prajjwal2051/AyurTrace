// Test script for manufacturing records functionality
import localStorageManager from './utils/localStorage.js';

// Test the manufacturing records functionality
console.log('=== Testing Manufacturing Records Functionality ===\n');

// 1. Test getting batches available for processing
console.log('1. Available batches for processing:');
const availableBatches = localStorageManager.getBatchesForProcessing();
console.log(`Found ${availableBatches.length} batches available for processing:`);
availableBatches.forEach(batch => {
  console.log(`  - ${batch.id}: ${batch.crop} (${batch.status})`);
});

// 2. Test adding a manufacturing record
console.log('\n2. Adding manufacturing record...');
const testManufacturingRecord = {
  batchId: 'BATCH-F-2024-015',
  manufacturerId: 'MFG-002',
  manufacturerName: 'Test Manufacturer',
  facilityName: 'Test Processing Facility',
  process: 'Steam Distillation',
  qualityTestResult: 'Excellent - All parameters passed',
  expectedYield: '85%',
  processingNotes: 'Test processing with optimal conditions',
  processingDate: '2024-08-25'
};

const success = localStorageManager.addManufacturingRecord(testManufacturingRecord);
console.log(`Manufacturing record added: ${success}`);

// 3. Test retrieving manufacturing records
console.log('\n3. All manufacturing records:');
const allRecords = localStorageManager.getManufacturingRecords();
console.log(`Found ${allRecords.length} manufacturing records:`);
allRecords.forEach(record => {
  console.log(`  - ${record.id}: Batch ${record.batchId} (${record.process})`);
});

// 4. Test blockchain hash generation
console.log('\n4. Testing blockchain hash generation...');
const testData = { batchId: 'TEST-001', process: 'Testing', timestamp: Date.now() };
const hash = localStorageManager.generateBlockchainHash(testData);
console.log(`Generated hash: ${hash}`);

// 5. Test supply chain journey with manufacturing records
console.log('\n5. Testing supply chain journey...');
const journey = localStorageManager.getSupplyChainJourney('BATCH-F-2024-012');
if (journey) {
  console.log(`Supply chain journey for ${journey.batch.id}:`);
  console.log(`  - Batch: ${journey.batch.crop}`);
  console.log(`  - Manufacturing Records: ${journey.manufacturingRecords.length}`);
  console.log(`  - Journey stages: ${journey.journey.length}`);
  journey.journey.forEach((stage, index) => {
    console.log(`    ${index + 1}. ${stage.stage} - ${stage.status}`);
  });
}

// 6. Test analytics update
console.log('\n6. Testing analytics update...');
const analytics = localStorageManager.updateAnalytics();
console.log('Updated analytics:');
console.log(`  - Total Batches: ${analytics.totalBatches}`);
console.log(`  - Total Manufacturing Records: ${analytics.totalManufacturingRecords}`);
console.log(`  - Processed Batches: ${analytics.processedBatches}`);
console.log(`  - Average Processing Time: ${analytics.averageProcessingTime} days`);

console.log('\n=== Manufacturing Records Test Complete ===');
