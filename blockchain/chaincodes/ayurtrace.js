/*
 * SPDX-License-Identifier: Apache-2.0
 * AyurTrace Smart Contract for Hyperledger Fabric
 * Manages Ayurvedic herb supply chain from farm to consumer
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class AyurTraceContract extends Contract {

    /**
     * Initialize the ledger with sample data
     */
    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        
        const sampleBatches = [
            {
                id: 'BATCH001',
                herbType: 'Ashwagandha',
                farmerId: 'FARMER001',
                farmerName: 'Ramesh Kumar',
                location: {
                    latitude: 28.7041,
                    longitude: 77.1025,
                    address: 'Delhi, India'
                },
                harvestDate: '2024-01-15T10:30:00Z',
                qualityGrade: 'A',
                quantity: 100,
                unit: 'kg',
                seasonalValidation: true,
                batchImages: ['ashwagandha_harvest_001.jpg'],
                status: 'harvested',
                timestamps: {
                    created: '2024-01-15T10:30:00Z',
                    updated: '2024-01-15T10:30:00Z'
                },
                owner: 'FARMER001',
                ownerType: 'farmer'
            },
            {
                id: 'BATCH002',
                herbType: 'Tulsi',
                farmerId: 'FARMER002',
                farmerName: 'Sunita Devi',
                location: {
                    latitude: 26.9124,
                    longitude: 75.7873,
                    address: 'Jaipur, Rajasthan, India'
                },
                harvestDate: '2024-01-20T08:15:00Z',
                qualityGrade: 'A',
                quantity: 75,
                unit: 'kg',
                seasonalValidation: true,
                batchImages: ['tulsi_harvest_002.jpg'],
                status: 'processing',
                processingSteps: [
                    {
                        step: 'drying',
                        date: '2024-01-21T09:00:00Z',
                        facility: 'Modern Herb Processing Unit',
                        operator: 'MANUFACTURER001'
                    }
                ],
                timestamps: {
                    created: '2024-01-20T08:15:00Z',
                    updated: '2024-01-21T09:00:00Z'
                },
                owner: 'MANUFACTURER001',
                ownerType: 'manufacturer'
            }
        ];

        for (let i = 0; i < sampleBatches.length; i++) {
            await ctx.stub.putState(sampleBatches[i].id, Buffer.from(JSON.stringify(sampleBatches[i])));
            console.info('Added batch: ', sampleBatches[i]);
        }
        
        console.info('============= END : Initialize Ledger ===========');
        return JSON.stringify({ success: true, message: 'Ledger initialized successfully' });
    }

    /**
     * Create a new herb batch on the blockchain
     */
    async createHerbBatch(ctx, batchData) {
        console.info('============= START : Create Herb Batch ===========');
        
        const batch = JSON.parse(batchData);
        
        // Validate required fields
        if (!batch.id || !batch.herbType || !batch.farmerId) {
            throw new Error('Missing required batch data');
        }

        // Check if batch already exists
        const exists = await this.herbBatchExists(ctx, batch.id);
        if (exists) {
            throw new Error(`The batch ${batch.id} already exists`);
        }

        // Set default values and timestamps
        batch.status = batch.status || 'harvested';
        batch.timestamps = {
            created: new Date().toISOString(),
            updated: new Date().toISOString()
        };
        batch.owner = batch.farmerId;
        batch.ownerType = 'farmer';

        // Validate seasonal planting (basic validation)
        batch.seasonalValidation = this.validateSeason(batch.herbType, new Date(batch.harvestDate));

        await ctx.stub.putState(batch.id, Buffer.from(JSON.stringify(batch)));
        
        // Emit event
        const eventPayload = {
            type: 'BATCH_CREATED',
            batchId: batch.id,
            herbType: batch.herbType,
            farmerId: batch.farmerId,
            timestamp: new Date().toISOString()
        };
        ctx.stub.setEvent('BatchCreated', Buffer.from(JSON.stringify(eventPayload)));
        
        console.info('============= END : Create Herb Batch ===========');
        return JSON.stringify({ success: true, batchId: batch.id });
    }

    /**
     * Process herb - add manufacturing/processing steps
     */
    async processHerb(ctx, batchId, processingData) {
        console.info('============= START : Process Herb ===========');
        
        const batch = await this.getHerbBatch(ctx, batchId);
        const processing = JSON.parse(processingData);
        
        if (!batch) {
            throw new Error(`Batch ${batchId} does not exist`);
        }

        const batchObj = JSON.parse(batch);
        
        // Initialize processing steps if not exists
        if (!batchObj.processingSteps) {
            batchObj.processingSteps = [];
        }

        // Add new processing step
        const step = {
            ...processing,
            timestamp: new Date().toISOString(),
            stepId: `STEP_${Date.now()}`
        };
        
        batchObj.processingSteps.push(step);
        batchObj.status = 'processing';
        batchObj.timestamps.updated = new Date().toISOString();
        
        // Update owner if transferred to manufacturer
        if (processing.operator && processing.operator !== batchObj.owner) {
            batchObj.owner = processing.operator;
            batchObj.ownerType = 'manufacturer';
        }

        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(batchObj)));
        
        // Emit event
        const eventPayload = {
            type: 'BATCH_PROCESSED',
            batchId: batchId,
            step: processing.step,
            operator: processing.operator,
            timestamp: new Date().toISOString()
        };
        ctx.stub.setEvent('BatchProcessed', Buffer.from(JSON.stringify(eventPayload)));
        
        console.info('============= END : Process Herb ===========');
        return JSON.stringify({ success: true, stepId: step.stepId });
    }

    /**
     * Query a specific herb batch
     */
    async queryHerb(ctx, batchId) {
        const batchAsBytes = await ctx.stub.getState(batchId);
        if (!batchAsBytes || batchAsBytes.length === 0) {
            throw new Error(`The batch ${batchId} does not exist`);
        }
        return batchAsBytes.toString();
    }

    /**
     * Query all herb batches
     */
    async queryAllHerbs(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        
        return JSON.stringify(allResults);
    }

    /**
     * Get herb batch history
     */
    async getHerbHistory(ctx, batchId) {
        const resultsIterator = await ctx.stub.getHistoryForKey(batchId);
        const results = await this.getAllResults(resultsIterator, true);
        
        return JSON.stringify(results);
    }

    /**
     * Update quality test results
     */
    async updateQuality(ctx, batchId, qualityData) {
        console.info('============= START : Update Quality ===========');
        
        const batch = await this.getHerbBatch(ctx, batchId);
        if (!batch) {
            throw new Error(`Batch ${batchId} does not exist`);
        }

        const batchObj = JSON.parse(batch);
        const quality = JSON.parse(qualityData);
        
        // Initialize quality tests if not exists
        if (!batchObj.qualityTests) {
            batchObj.qualityTests = [];
        }

        // Add new quality test
        const test = {
            ...quality,
            timestamp: new Date().toISOString(),
            testId: `TEST_${Date.now()}`
        };
        
        batchObj.qualityTests.push(test);
        batchObj.timestamps.updated = new Date().toISOString();

        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(batchObj)));
        
        // Emit event
        const eventPayload = {
            type: 'QUALITY_UPDATED',
            batchId: batchId,
            testType: quality.testType,
            result: quality.result,
            timestamp: new Date().toISOString()
        };
        ctx.stub.setEvent('QualityUpdated', Buffer.from(JSON.stringify(eventPayload)));
        
        console.info('============= END : Update Quality ===========');
        return JSON.stringify({ success: true, testId: test.testId });
    }

    /**
     * Transfer ownership of a batch
     */
    async transferOwnership(ctx, batchId, newOwner, newOwnerType) {
        console.info('============= START : Transfer Ownership ===========');
        
        const batch = await this.getHerbBatch(ctx, batchId);
        if (!batch) {
            throw new Error(`Batch ${batchId} does not exist`);
        }

        const batchObj = JSON.parse(batch);
        const previousOwner = batchObj.owner;
        const previousOwnerType = batchObj.ownerType;
        
        batchObj.owner = newOwner;
        batchObj.ownerType = newOwnerType;
        batchObj.timestamps.updated = new Date().toISOString();
        
        // Add transfer record
        if (!batchObj.transfers) {
            batchObj.transfers = [];
        }
        
        batchObj.transfers.push({
            from: previousOwner,
            fromType: previousOwnerType,
            to: newOwner,
            toType: newOwnerType,
            timestamp: new Date().toISOString(),
            transferId: `TRANSFER_${Date.now()}`
        });

        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(batchObj)));
        
        // Emit event
        const eventPayload = {
            type: 'OWNERSHIP_TRANSFERRED',
            batchId: batchId,
            from: previousOwner,
            to: newOwner,
            timestamp: new Date().toISOString()
        };
        ctx.stub.setEvent('OwnershipTransferred', Buffer.from(JSON.stringify(eventPayload)));
        
        console.info('============= END : Transfer Ownership ===========');
        return JSON.stringify({ success: true, transferId: batchObj.transfers[batchObj.transfers.length - 1].transferId });
    }

    /**
     * Generate QR code data for a product
     */
    async generateQR(ctx, batchId, productDetails) {
        console.info('============= START : Generate QR ===========');
        
        const batch = await this.getHerbBatch(ctx, batchId);
        if (!batch) {
            throw new Error(`Batch ${batchId} does not exist`);
        }

        const batchObj = JSON.parse(batch);
        const product = JSON.parse(productDetails);
        
        // Create QR data
        const qrData = {
            batchId: batchId,
            productId: product.productId,
            productName: product.productName,
            manufacturer: product.manufacturer,
            manufacturingDate: product.manufacturingDate,
            expiryDate: product.expiryDate,
            verificationUrl: `https://ayurtrace.com/verify/${batchId}`,
            timestamp: new Date().toISOString()
        };

        // Update batch with product information
        batchObj.productDetails = product;
        batchObj.qrData = qrData;
        batchObj.status = 'packaged';
        batchObj.timestamps.updated = new Date().toISOString();

        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(batchObj)));
        
        // Emit event
        const eventPayload = {
            type: 'QR_GENERATED',
            batchId: batchId,
            productId: product.productId,
            timestamp: new Date().toISOString()
        };
        ctx.stub.setEvent('QRGenerated', Buffer.from(JSON.stringify(eventPayload)));
        
        console.info('============= END : Generate QR ===========');
        return JSON.stringify({ success: true, qrData: qrData });
    }

    // Helper Methods
    
    async herbBatchExists(ctx, batchId) {
        const batchAsBytes = await ctx.stub.getState(batchId);
        return batchAsBytes && batchAsBytes.length > 0;
    }

    async getHerbBatch(ctx, batchId) {
        const batchAsBytes = await ctx.stub.getState(batchId);
        if (!batchAsBytes || batchAsBytes.length === 0) {
            return null;
        }
        return batchAsBytes.toString();
    }

    validateSeason(herbType, harvestDate) {
        // Simple seasonal validation logic
        const month = harvestDate.getMonth() + 1; // 1-12
        
        const seasonalChart = {
            'Ashwagandha': [10, 11, 12, 1, 2, 3], // Oct-Mar
            'Brahmi': [6, 7, 8, 9, 10, 11], // Jun-Nov
            'Tulsi': [1, 2, 3, 4, 10, 11, 12], // Year-round but best in these months
            'Neem': [1, 2, 3, 4, 5, 6], // Jan-Jun
            'Turmeric': [1, 2, 3, 4, 12], // Dec-Apr
            'Amla': [11, 12, 1, 2] // Nov-Feb
        };

        const validMonths = seasonalChart[herbType] || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        return validMonths.includes(month);
    }

    async getAllResults(iterator, isHistory) {
        let allResults = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));
                if (isHistory && isHistory === true) {
                    jsonRes.TxId = res.value.txId;
                    jsonRes.Timestamp = res.value.timestamp;
                    jsonRes.IsDelete = res.value.isDelete.toString();
                    try {
                        jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Value = res.value.value.toString('utf8');
                    }
                } else {
                    jsonRes.Key = res.value.key;
                    try {
                        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Record = res.value.value.toString('utf8');
                    }
                }
                allResults.push(jsonRes);
            }
            res = await iterator.next();
        }
        iterator.close();
        return allResults;
    }
}

module.exports = AyurTraceContract;
