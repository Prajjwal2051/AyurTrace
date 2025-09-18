const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../backend/.env' });

// Import models
const User = require('../backend/src/models/User');
const HerbBatch = require('../backend/src/models/HerbBatch');

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ayurtrace', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Sample data
const sampleUsers = [
  // Farmers
  {
    name: 'Ramesh Kumar',
    email: 'ramesh.farmer@ayurtrace.com',
    password: 'Farmer123!',
    role: 'farmer',
    status: 'active',
    isVerified: true,
    profile: {
      phoneNumber: '+919876543210',
      address: {
        street: 'Village Khetri',
        city: 'Alwar',
        state: 'Rajasthan',
        country: 'India',
        pincode: '301001',
        coordinates: {
          latitude: 27.9506,
          longitude: 76.6337
        }
      },
      bio: 'Organic farming specialist with 15+ years experience in Ayurvedic herbs cultivation.'
    },
    farmerDetails: {
      farmId: 'FARM001',
      farmName: 'Ramesh Organic Herbs Farm',
      farmSize: 25,
      primaryCrops: ['Ashwagandha', 'Brahmi', 'Tulsi'],
      farmingMethod: 'organic',
      experienceYears: 15,
      certifications: [
        {
          name: 'Organic Certification',
          issuedBy: 'APEDA',
          validUntil: new Date('2025-12-31'),
          certificateNumber: 'ORG-2024-001'
        }
      ]
    },
    gdprConsent: {
      given: true,
      givenAt: new Date(),
      ipAddress: '192.168.1.100'
    }
  },
  
  {
    name: 'Sunita Devi',
    email: 'sunita.farmer@ayurtrace.com',
    password: 'Farmer123!',
    role: 'farmer',
    status: 'active',
    isVerified: true,
    profile: {
      phoneNumber: '+919876543211',
      address: {
        street: 'Village Mandawa',
        city: 'Jhunjhunu',
        state: 'Rajasthan',
        country: 'India',
        pincode: '333704',
        coordinates: {
          latitude: 28.0513,
          longitude: 75.1417
        }
      },
      bio: 'Traditional Ayurvedic herb farmer focusing on medicinal plant cultivation.'
    },
    farmerDetails: {
      farmId: 'FARM002',
      farmName: 'Sunita Herbal Gardens',
      farmSize: 18,
      primaryCrops: ['Neem', 'Turmeric', 'Amla'],
      farmingMethod: 'organic',
      experienceYears: 12,
      certifications: [
        {
          name: 'Organic Certification',
          issuedBy: 'NPOP',
          validUntil: new Date('2025-06-30'),
          certificateNumber: 'ORG-2024-002'
        }
      ]
    },
    gdprConsent: {
      given: true,
      givenAt: new Date(),
      ipAddress: '192.168.1.101'
    }
  },

  // Manufacturers
  {
    name: 'Dr. Arvind Sharma',
    email: 'arvind.manufacturer@ayurtrace.com',
    password: 'Manufacturer123!',
    role: 'manufacturer',
    status: 'active',
    isVerified: true,
    profile: {
      phoneNumber: '+919876543212',
      address: {
        street: '123 Industrial Area',
        city: 'Haridwar',
        state: 'Uttarakhand',
        country: 'India',
        pincode: '249401',
        coordinates: {
          latitude: 29.9457,
          longitude: 78.1642
        }
      },
      bio: 'Ayurvedic medicine manufacturer with expertise in herbal processing and quality control.'
    },
    manufacturerDetails: {
      companyId: 'MFG001',
      companyName: 'Himalayan Herbal Industries',
      establishedYear: 2010,
      licenseNumber: 'AYUSH-MFG-2024-001',
      facilityType: 'full_facility',
      capacity: {
        daily: 1000,
        monthly: 30000,
        unit: 'kg'
      },
      ayushLicense: {
        number: 'AYUSH-LIC-001',
        validUntil: new Date('2025-12-31'),
        issuedBy: 'Ministry of AYUSH'
      },
      qualityStandards: ['GMP', 'ISO', 'AYUSH', 'WHO-GMP']
    },
    gdprConsent: {
      given: true,
      givenAt: new Date(),
      ipAddress: '192.168.1.102'
    }
  },

  // Consumers
  {
    name: 'Priya Singh',
    email: 'priya.consumer@ayurtrace.com',
    password: 'Consumer123!',
    role: 'consumer',
    status: 'active',
    isVerified: true,
    profile: {
      phoneNumber: '+919876543213',
      address: {
        street: '456 Green Avenue',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        pincode: '400001',
        coordinates: {
          latitude: 19.0760,
          longitude: 72.8777
        }
      },
      bio: 'Health-conscious consumer interested in authentic Ayurvedic products.'
    },
    gdprConsent: {
      given: true,
      givenAt: new Date(),
      ipAddress: '192.168.1.103'
    }
  },

  // Admins
  {
    name: 'Admin User',
    email: 'admin@ayurtrace.com',
    password: 'Admin123!',
    role: 'admin',
    status: 'active',
    isVerified: true,
    profile: {
      phoneNumber: '+919876543214',
      address: {
        street: 'Government Office',
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India',
        pincode: '110001',
        coordinates: {
          latitude: 28.6139,
          longitude: 77.2090
        }
      }
    },
    gdprConsent: {
      given: true,
      givenAt: new Date(),
      ipAddress: '192.168.1.104'
    }
  },

  {
    name: 'AYUSH Government Admin',
    email: 'ayush.admin@gov.in',
    password: 'GovAdmin123!',
    role: 'gov_admin',
    status: 'active',
    isVerified: true,
    profile: {
      phoneNumber: '+919876543215',
      address: {
        street: 'Ministry of AYUSH',
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India',
        pincode: '110011',
        coordinates: {
          latitude: 28.6139,
          longitude: 77.2090
        }
      },
      bio: 'Government administrator overseeing AYUSH compliance and regulations.'
    },
    gdprConsent: {
      given: true,
      givenAt: new Date(),
      ipAddress: '192.168.1.105'
    }
  }
];

// Sample herb batches
const createSampleBatches = async (farmers) => {
  const sampleBatches = [
    {
      herbType: 'Ashwagandha',
      farmerId: farmers[0]._id,
      farmerInfo: {
        name: farmers[0].name,
        farmName: farmers[0].farmerDetails.farmName,
        licenseNumber: farmers[0].farmerDetails.certifications[0].certificateNumber,
        contactNumber: farmers[0].profile.phoneNumber
      },
      quantity: {
        amount: 250,
        unit: 'kg'
      },
      harvestLocation: {
        coordinates: {
          latitude: 27.9506,
          longitude: 76.6337
        },
        address: {
          village: 'Khetri',
          district: 'Alwar',
          state: 'Rajasthan',
          country: 'India',
          pincode: '301001'
        },
        altitude: 250,
        soilType: 'alluvial'
      },
      harvestDate: new Date('2024-01-15'),
      harvestSeason: 'rabi',
      weatherConditions: {
        temperature: 25,
        humidity: 60,
        rainfall: 2.5,
        sunlight: 8
      },
      qualityGrade: 'A',
      qualityParameters: {
        moisture: 8.5,
        purity: 96.5,
        activeCompounds: [
          {
            name: 'Withanolides',
            value: 2.8,
            unit: '%'
          }
        ]
      },
      images: {
        harvest: ['ashwagandha_harvest_001.jpg'],
        plant: ['ashwagandha_plant_001.jpg'],
        location: ['farm_location_001.jpg']
      },
      currentOwner: farmers[0]._id,
      ownerType: 'farmer',
      compliance: {
        organicCertified: true,
        certifications: [
          {
            type: 'Organic',
            number: 'ORG-2024-001',
            issuedBy: 'APEDA',
            validUntil: new Date('2025-12-31')
          }
        ]
      },
      environmentalData: {
        climateData: {
          avgTemperature: 25,
          totalRainfall: 150,
          soilPh: 6.8,
          organicMatter: 3.2
        }
      },
      tags: ['organic', 'premium', 'traditional']
    },

    {
      herbType: 'Tulsi',
      farmerId: farmers[0]._id,
      farmerInfo: {
        name: farmers[0].name,
        farmName: farmers[0].farmerDetails.farmName,
        licenseNumber: farmers[0].farmerDetails.certifications[0].certificateNumber,
        contactNumber: farmers[0].profile.phoneNumber
      },
      quantity: {
        amount: 180,
        unit: 'kg'
      },
      harvestLocation: {
        coordinates: {
          latitude: 27.9506,
          longitude: 76.6337
        },
        address: {
          village: 'Khetri',
          district: 'Alwar',
          state: 'Rajasthan',
          country: 'India',
          pincode: '301001'
        },
        altitude: 250,
        soilType: 'alluvial'
      },
      harvestDate: new Date('2024-01-20'),
      harvestSeason: 'rabi',
      weatherConditions: {
        temperature: 28,
        humidity: 65,
        rainfall: 1.8,
        sunlight: 9
      },
      qualityGrade: 'A',
      qualityParameters: {
        moisture: 7.2,
        purity: 98.1,
        activeCompounds: [
          {
            name: 'Eugenol',
            value: 1.2,
            unit: '%'
          },
          {
            name: 'Ursolic acid',
            value: 0.8,
            unit: '%'
          }
        ]
      },
      images: {
        harvest: ['tulsi_harvest_002.jpg'],
        plant: ['tulsi_plant_002.jpg'],
        location: ['farm_location_002.jpg']
      },
      currentOwner: farmers[0]._id,
      ownerType: 'farmer',
      compliance: {
        organicCertified: true
      },
      tags: ['organic', 'aromatic', 'medicinal']
    },

    {
      herbType: 'Neem',
      farmerId: farmers[1]._id,
      farmerInfo: {
        name: farmers[1].name,
        farmName: farmers[1].farmerDetails.farmName,
        licenseNumber: farmers[1].farmerDetails.certifications[0].certificateNumber,
        contactNumber: farmers[1].profile.phoneNumber
      },
      quantity: {
        amount: 320,
        unit: 'kg'
      },
      harvestLocation: {
        coordinates: {
          latitude: 28.0513,
          longitude: 75.1417
        },
        address: {
          village: 'Mandawa',
          district: 'Jhunjhunu',
          state: 'Rajasthan',
          country: 'India',
          pincode: '333704'
        },
        altitude: 280,
        soilType: 'sandy'
      },
      harvestDate: new Date('2024-02-10'),
      harvestSeason: 'rabi',
      weatherConditions: {
        temperature: 30,
        humidity: 55,
        rainfall: 0.5,
        sunlight: 10
      },
      qualityGrade: 'B',
      qualityParameters: {
        moisture: 9.1,
        purity: 94.5,
        activeCompounds: [
          {
            name: 'Azadirachtin',
            value: 0.3,
            unit: '%'
          },
          {
            name: 'Nimbin',
            value: 0.2,
            unit: '%'
          }
        ]
      },
      images: {
        harvest: ['neem_harvest_003.jpg'],
        plant: ['neem_plant_003.jpg'],
        location: ['farm_location_003.jpg']
      },
      currentOwner: farmers[1]._id,
      ownerType: 'farmer',
      compliance: {
        organicCertified: true
      },
      tags: ['organic', 'antimicrobial', 'traditional']
    }
  ];

  return sampleBatches;
};

// Seeding function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await HerbBatch.deleteMany({});

    // Create users
    console.log('👥 Creating sample users...');
    const createdUsers = [];
    
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`   ✅ Created user: ${user.name} (${user.email})`);
    }

    // Get farmers for batch creation
    const farmers = createdUsers.filter(user => user.role === 'farmer');
    const manufacturers = createdUsers.filter(user => user.role === 'manufacturer');

    // Create herb batches
    console.log('🌿 Creating sample herb batches...');
    const sampleBatches = await createSampleBatches(farmers);
    
    for (const batchData of sampleBatches) {
      const batch = new HerbBatch(batchData);
      await batch.save();
      console.log(`   ✅ Created batch: ${batch.batchId} (${batch.herbType})`);
    }

    console.log('✨ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   - Farmers: ${farmers.length}`);
    console.log(`   - Manufacturers: ${manufacturers.length}`);
    console.log(`   - Consumers: ${createdUsers.filter(u => u.role === 'consumer').length}`);
    console.log(`   - Admins: ${createdUsers.filter(u => u.role.includes('admin')).length}`);
    console.log(`   Herb Batches: ${sampleBatches.length}`);

    console.log('\n🔐 Sample Login Credentials:');
    console.log('   Farmer: ramesh.farmer@ayurtrace.com / Farmer123!');
    console.log('   Manufacturer: arvind.manufacturer@ayurtrace.com / Manufacturer123!');
    console.log('   Consumer: priya.consumer@ayurtrace.com / Consumer123!');
    console.log('   Admin: admin@ayurtrace.com / Admin123!');
    console.log('   Gov Admin: ayush.admin@gov.in / GovAdmin123!');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await seedDatabase();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding process failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { seedDatabase, connectDB };
