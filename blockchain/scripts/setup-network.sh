#!/bin/bash

# AyurTrace Hyperledger Fabric Network Setup Script
# This script sets up a complete Hyperledger Fabric network for AyurTrace

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
FABRIC_VERSION="2.5"
FABRIC_CA_VERSION="1.5"
NETWORK_NAME="ayurtrace-network"
CHANNEL_NAME="ayurchannel"
CHAINCODE_NAME="ayurtrace"

# Directories
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BLOCKCHAIN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
NETWORK_DIR="$BLOCKCHAIN_DIR/network"

echo -e "${BLUE}🚀 AyurTrace Blockchain Network Setup${NC}"
echo -e "${BLUE}======================================${NC}"

# Check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}📋 Checking prerequisites...${NC}"
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker not found. Please install Docker.${NC}"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}❌ Docker Compose not found. Please install Docker Compose.${NC}"
        exit 1
    fi
    
    # Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        echo -e "${RED}❌ Docker daemon is not running. Please start Docker.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Prerequisites check passed${NC}"
}

# Download Hyperledger Fabric binaries and Docker images
download_fabric() {
    echo -e "${YELLOW}📦 Downloading Hyperledger Fabric binaries and images...${NC}"
    
    if [ ! -d "$BLOCKCHAIN_DIR/bin" ]; then
        mkdir -p "$BLOCKCHAIN_DIR/bin"
        cd "$BLOCKCHAIN_DIR"
        
        # Download Fabric binaries
        curl -sSL https://bit.ly/2ysbOFE | bash -s -- ${FABRIC_VERSION} ${FABRIC_CA_VERSION} -d -s
        
        # Move binaries to bin directory
        mv fabric-samples/bin/* bin/
        rm -rf fabric-samples
    fi
    
    # Pull Docker images if not already present
    docker pull hyperledger/fabric-peer:${FABRIC_VERSION}
    docker pull hyperledger/fabric-orderer:${FABRIC_VERSION}
    docker pull hyperledger/fabric-ca:${FABRIC_CA_VERSION}
    docker pull hyperledger/fabric-tools:${FABRIC_VERSION}
    docker pull hyperledger/fabric-ccenv:${FABRIC_VERSION}
    
    echo -e "${GREEN}✅ Fabric binaries and images downloaded${NC}"
}

# Generate crypto material
generate_crypto() {
    echo -e "${YELLOW}🔐 Generating crypto material...${NC}"
    
    cd "$BLOCKCHAIN_DIR"
    
    # Create network directory structure
    mkdir -p "$NETWORK_DIR"/{organizations,channel-artifacts,scripts}
    
    # Generate crypto-config.yaml
    cat > "$NETWORK_DIR/crypto-config.yaml" << EOF
OrdererOrgs:
  - Name: Orderer
    Domain: orderer.ayurtrace.com
    Specs:
      - Hostname: orderer
        
PeerOrgs:
  - Name: Org1
    Domain: org1.ayurtrace.com
    EnableNodeOUs: true
    Template:
      Count: 1
    Users:
      Count: 1
EOF

    # Generate configtx.yaml
    cat > "$NETWORK_DIR/configtx.yaml" << EOF
Organizations:
  - &OrdererOrg
    Name: OrdererMSP
    ID: OrdererMSP
    MSPDir: organizations/ordererOrganizations/orderer.ayurtrace.com/msp
    Policies:
      Readers:
        Type: Signature
        Rule: "OR('OrdererMSP.member')"
      Writers:
        Type: Signature
        Rule: "OR('OrdererMSP.member')"
      Admins:
        Type: Signature
        Rule: "OR('OrdererMSP.admin')"
    OrdererEndpoints:
      - orderer.ayurtrace.com:7050

  - &Org1
    Name: Org1MSP
    ID: Org1MSP
    MSPDir: organizations/peerOrganizations/org1.ayurtrace.com/msp
    Policies:
      Readers:
        Type: Signature
        Rule: "OR('Org1MSP.admin', 'Org1MSP.peer', 'Org1MSP.client')"
      Writers:
        Type: Signature
        Rule: "OR('Org1MSP.admin', 'Org1MSP.client')"
      Admins:
        Type: Signature
        Rule: "OR('Org1MSP.admin')"
      Endorsement:
        Type: Signature
        Rule: "OR('Org1MSP.peer')"
    AnchorPeers:
      - Host: peer0.org1.ayurtrace.com
        Port: 7051

Capabilities:
  Channel: &ChannelCapabilities
    V2_0: true
  Orderer: &OrdererCapabilities
    V2_0: true
  Application: &ApplicationCapabilities
    V2_0: true

Application: &ApplicationDefaults
  Organizations:
  Policies:
    Readers:
      Type: ImplicitMeta
      Rule: "ANY Readers"
    Writers:
      Type: ImplicitMeta
      Rule: "ANY Writers"
    Admins:
      Type: ImplicitMeta
      Rule: "MAJORITY Admins"
    LifecycleEndorsement:
      Type: ImplicitMeta
      Rule: "MAJORITY Endorsement"
    Endorsement:
      Type: ImplicitMeta
      Rule: "MAJORITY Endorsement"
  Capabilities:
    <<: *ApplicationCapabilities

Orderer: &OrdererDefaults
  OrdererType: etcdraft
  Addresses:
    - orderer.ayurtrace.com:7050
  EtcdRaft:
    Consenters:
    - Host: orderer.ayurtrace.com
      Port: 7050
      ClientTLSCert: organizations/ordererOrganizations/orderer.ayurtrace.com/orderers/orderer.ayurtrace.com/tls/server.crt
      ServerTLSCert: organizations/ordererOrganizations/orderer.ayurtrace.com/orderers/orderer.ayurtrace.com/tls/server.crt
  BatchTimeout: 2s
  BatchSize:
    MaxMessageCount: 10
    AbsoluteMaxBytes: 99 MB
    PreferredMaxBytes: 512 KB
  Organizations:
  Policies:
    Readers:
      Type: ImplicitMeta
      Rule: "ANY Readers"
    Writers:
      Type: ImplicitMeta
      Rule: "ANY Writers"
    Admins:
      Type: ImplicitMeta
      Rule: "MAJORITY Admins"
    BlockValidation:
      Type: ImplicitMeta
      Rule: "ANY Writers"

Channel: &ChannelDefaults
  Policies:
    Readers:
      Type: ImplicitMeta
      Rule: "ANY Readers"
    Writers:
      Type: ImplicitMeta
      Rule: "ANY Writers"
    Admins:
      Type: ImplicitMeta
      Rule: "MAJORITY Admins"
  Capabilities:
    <<: *ChannelCapabilities

Profiles:
  AyurTraceGenesis:
    <<: *ChannelDefaults
    Orderer:
      <<: *OrdererDefaults
      Organizations:
        - *OrdererOrg
      Capabilities:
        <<: *OrdererCapabilities
    Consortiums:
      AyurTraceConsortium:
        Organizations:
          - *Org1

  AyurTraceChannel:
    Consortium: AyurTraceConsortium
    <<: *ChannelDefaults
    Application:
      <<: *ApplicationDefaults
      Organizations:
        - *Org1
      Capabilities:
        <<: *ApplicationCapabilities
EOF

    # Generate crypto material using cryptogen
    "$BLOCKCHAIN_DIR/bin/cryptogen" generate --config="$NETWORK_DIR/crypto-config.yaml" --output="$NETWORK_DIR/organizations"
    
    # Generate genesis block
    export FABRIC_CFG_PATH="$NETWORK_DIR"
    "$BLOCKCHAIN_DIR/bin/configtxgen" -profile AyurTraceGenesis -channelID system-channel -outputBlock "$NETWORK_DIR/channel-artifacts/genesis.block"
    
    # Generate channel configuration transaction
    "$BLOCKCHAIN_DIR/bin/configtxgen" -profile AyurTraceChannel -outputCreateChannelTx "$NETWORK_DIR/channel-artifacts/${CHANNEL_NAME}.tx" -channelID ${CHANNEL_NAME}
    
    # Generate anchor peer transactions
    "$BLOCKCHAIN_DIR/bin/configtxgen" -profile AyurTraceChannel -outputAnchorPeersUpdate "$NETWORK_DIR/channel-artifacts/Org1MSPanchors.tx" -channelID ${CHANNEL_NAME} -asOrg Org1MSP
    
    echo -e "${GREEN}✅ Crypto material generated${NC}"
}

# Start the network
start_network() {
    echo -e "${YELLOW}🌐 Starting Hyperledger Fabric network...${NC}"
    
    cd "$BLOCKCHAIN_DIR/.."
    
    # Start the network using Docker Compose
    docker-compose -f docker-compose.yml up -d fabric-ca-org1 orderer peer0-org1
    
    # Wait for containers to be ready
    sleep 10
    
    echo -e "${GREEN}✅ Network started successfully${NC}"
}

# Create and join channel
setup_channel() {
    echo -e "${YELLOW}📡 Setting up channel...${NC}"
    
    # Set environment variables
    export CORE_PEER_TLS_ENABLED=false
    export CORE_PEER_LOCALMSPID="Org1MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE="$NETWORK_DIR/organizations/peerOrganizations/org1.ayurtrace.com/peers/peer0.org1.ayurtrace.com/tls/ca.crt"
    export CORE_PEER_MSPCONFIGPATH="$NETWORK_DIR/organizations/peerOrganizations/org1.ayurtrace.com/users/Admin@org1.ayurtrace.com/msp"
    export CORE_PEER_ADDRESS=localhost:7051
    
    # Create channel
    docker exec -e CORE_PEER_TLS_ENABLED=false \
                -e CORE_PEER_LOCALMSPID=Org1MSP \
                -e CORE_PEER_MSPCONFIGPATH=/var/hyperledger/organizations/peerOrganizations/org1.ayurtrace.com/users/Admin@org1.ayurtrace.com/msp \
                -e CORE_PEER_ADDRESS=peer0-org1:7051 \
                ayurtrace-peer0-org1 \
                peer channel create -o orderer:7050 -c ${CHANNEL_NAME} -f /var/hyperledger/channel-artifacts/${CHANNEL_NAME}.tx --outputBlock /var/hyperledger/channel-artifacts/${CHANNEL_NAME}.block
    
    # Join channel
    docker exec -e CORE_PEER_TLS_ENABLED=false \
                -e CORE_PEER_LOCALMSPID=Org1MSP \
                -e CORE_PEER_MSPCONFIGPATH=/var/hyperledger/organizations/peerOrganizations/org1.ayurtrace.com/users/Admin@org1.ayurtrace.com/msp \
                -e CORE_PEER_ADDRESS=peer0-org1:7051 \
                ayurtrace-peer0-org1 \
                peer channel join -b /var/hyperledger/channel-artifacts/${CHANNEL_NAME}.block
    
    echo -e "${GREEN}✅ Channel setup completed${NC}"
}

# Deploy chaincode
deploy_chaincode() {
    echo -e "${YELLOW}📦 Deploying chaincode...${NC}"
    
    # Package chaincode
    cd "$BLOCKCHAIN_DIR"
    
    # Create chaincode package
    "$BLOCKCHAIN_DIR/bin/peer" lifecycle chaincode package ${CHAINCODE_NAME}.tar.gz \
        --path "$BLOCKCHAIN_DIR/chaincodes/" \
        --lang node \
        --label ${CHAINCODE_NAME}_1.0
    
    # Install chaincode on peer
    docker exec -e CORE_PEER_TLS_ENABLED=false \
                -e CORE_PEER_LOCALMSPID=Org1MSP \
                -e CORE_PEER_MSPCONFIGPATH=/var/hyperledger/organizations/peerOrganizations/org1.ayurtrace.com/users/Admin@org1.ayurtrace.com/msp \
                -e CORE_PEER_ADDRESS=peer0-org1:7051 \
                -v "$BLOCKCHAIN_DIR:/var/hyperledger" \
                ayurtrace-peer0-org1 \
                peer lifecycle chaincode install /var/hyperledger/${CHAINCODE_NAME}.tar.gz
    
    # Query installed chaincodes to get package ID
    PACKAGE_ID=$(docker exec -e CORE_PEER_TLS_ENABLED=false \
                            -e CORE_PEER_LOCALMSPID=Org1MSP \
                            -e CORE_PEER_MSPCONFIGPATH=/var/hyperledger/organizations/peerOrganizations/org1.ayurtrace.com/users/Admin@org1.ayurtrace.com/msp \
                            -e CORE_PEER_ADDRESS=peer0-org1:7051 \
                            ayurtrace-peer0-org1 \
                            peer lifecycle chaincode queryinstalled | grep "${CHAINCODE_NAME}_1.0" | cut -d' ' -f3 | cut -d',' -f1)
    
    # Approve chaincode for org
    docker exec -e CORE_PEER_TLS_ENABLED=false \
                -e CORE_PEER_LOCALMSPID=Org1MSP \
                -e CORE_PEER_MSPCONFIGPATH=/var/hyperledger/organizations/peerOrganizations/org1.ayurtrace.com/users/Admin@org1.ayurtrace.com/msp \
                -e CORE_PEER_ADDRESS=peer0-org1:7051 \
                ayurtrace-peer0-org1 \
                peer lifecycle chaincode approveformyorg -o orderer:7050 --channelID ${CHANNEL_NAME} --name ${CHAINCODE_NAME} --version 1.0 --package-id ${PACKAGE_ID} --sequence 1
    
    # Commit chaincode
    docker exec -e CORE_PEER_TLS_ENABLED=false \
                -e CORE_PEER_LOCALMSPID=Org1MSP \
                -e CORE_PEER_MSPCONFIGPATH=/var/hyperledger/organizations/peerOrganizations/org1.ayurtrace.com/users/Admin@org1.ayurtrace.com/msp \
                -e CORE_PEER_ADDRESS=peer0-org1:7051 \
                ayurtrace-peer0-org1 \
                peer lifecycle chaincode commit -o orderer:7050 --channelID ${CHANNEL_NAME} --name ${CHAINCODE_NAME} --version 1.0 --sequence 1
    
    echo -e "${GREEN}✅ Chaincode deployed successfully${NC}"
}

# Initialize chaincode
initialize_chaincode() {
    echo -e "${YELLOW}🔧 Initializing chaincode...${NC}"
    
    # Invoke init function
    docker exec -e CORE_PEER_TLS_ENABLED=false \
                -e CORE_PEER_LOCALMSPID=Org1MSP \
                -e CORE_PEER_MSPCONFIGPATH=/var/hyperledger/organizations/peerOrganizations/org1.ayurtrace.com/users/Admin@org1.ayurtrace.com/msp \
                -e CORE_PEER_ADDRESS=peer0-org1:7051 \
                ayurtrace-peer0-org1 \
                peer chaincode invoke -o orderer:7050 -C ${CHANNEL_NAME} -n ${CHAINCODE_NAME} -c '{"function":"initLedger","Args":[]}'
    
    echo -e "${GREEN}✅ Chaincode initialized with sample data${NC}"
}

# Clean up function
cleanup() {
    echo -e "${YELLOW}🧹 Cleaning up existing network...${NC}"
    
    cd "$BLOCKCHAIN_DIR/.."
    
    # Stop containers
    docker-compose down -v
    
    # Remove volumes
    docker volume prune -f
    
    # Clean network directory
    rm -rf "$NETWORK_DIR"
    
    echo -e "${GREEN}✅ Cleanup completed${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}Starting AyurTrace Blockchain Network Setup...${NC}"
    
    # Parse arguments
    if [ "$1" = "clean" ]; then
        cleanup
        exit 0
    fi
    
    check_prerequisites
    download_fabric
    generate_crypto
    start_network
    setup_channel
    deploy_chaincode
    initialize_chaincode
    
    echo -e "${GREEN}🎉 AyurTrace Blockchain Network Setup Complete!${NC}"
    echo -e "${BLUE}=================================================${NC}"
    echo -e "${GREEN}Network Status:${NC}"
    echo -e "  📡 Channel: ${CHANNEL_NAME}"
    echo -e "  📦 Chaincode: ${CHAINCODE_NAME}"
    echo -e "  🔗 Peers: peer0.org1.ayurtrace.com:7051"
    echo -e "  📋 Orderer: orderer.ayurtrace.com:7050"
    echo -e "  🏢 CA: ca.org1.ayurtrace.com:7054"
    echo -e ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo -e "  1. Start the backend server: npm run dev"
    echo -e "  2. Start the frontend: npm start"
    echo -e "  3. Access the application at: http://localhost:3000"
    echo -e ""
    echo -e "${BLUE}To stop the network: docker-compose down${NC}"
    echo -e "${BLUE}To clean everything: $0 clean${NC}"
}

# Execute main function
main "$@"
