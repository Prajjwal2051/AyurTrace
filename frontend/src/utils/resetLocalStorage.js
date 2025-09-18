/* eslint-disable no-console */
// Reset localStorage for testing - Run this in browser console

import localStorageManager from './localStorage';

// Function to reset and reinitialize localStorage with latest data
export const resetLocalStorageForTesting = () => {
  console.log('🔄 Resetting localStorage with updated data...');
  
  // Clear all existing data
  localStorageManager.clearAllData();
  
  // Force re-initialization
  localStorageManager.initializeData();
  
  // Verify the data is loaded
  const batches = localStorageManager.getBatches();
  const batch015 = batches.find(b => b.id === 'BATCH-F-2024-015');
  
  console.log('✅ Available batches:', batches.map(b => b.id));
  console.log('✅ BATCH-F-2024-015 exists:', !!batch015);
  console.log('✅ Products for BATCH-F-2024-015:', localStorageManager.getProducts().filter(p => p.batchId === 'BATCH-F-2024-015').length);
  console.log('✅ Verifications for BATCH-F-2024-015:', localStorageManager.getVerifications().filter(v => v.batchId === 'BATCH-F-2024-015').length);
  console.log('✅ Manufacturing records for BATCH-F-2024-015:', localStorageManager.getManufacturingRecords().filter(r => r.batchId === 'BATCH-F-2024-015').length);
  
  // Test journey retrieval
  const journeyData = localStorageManager.getSupplyChainJourney('BATCH-F-2024-015');
  console.log('✅ Supply chain journey for BATCH-F-2024-015:', !!journeyData);
  
  if (journeyData) {
    console.log('✅ Journey stages:', journeyData.journey.length);
    console.log('✅ Products in journey:', journeyData.products.length);
    console.log('✅ Verifications in journey:', journeyData.verifications.length);
  }
  
  console.log('🎉 localStorage reset complete! All BATCH-F-2024-015 data should now be available.');
};

// For browser console usage
if (typeof window !== 'undefined') {
  window.resetAyurTraceStorage = resetLocalStorageForTesting;
  console.log('💡 Run resetAyurTraceStorage() in console to reset localStorage');
}

export default resetLocalStorageForTesting;