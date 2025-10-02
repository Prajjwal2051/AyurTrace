const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

class SocketServer {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map();
  }

  initialize(server) {
    this.io = socketIo(server, {
      cors: {
        origin: process.env.CORS_ORIGIN ? 
          process.env.CORS_ORIGIN.split(',') : 
          ['http://localhost:3000', 'http://localhost:3001'],
        methods: ['GET', 'POST']
      }
    });

    this.setupSocketMiddleware();
    this.setupSocketEvents();
    this.startPeriodicUpdates();

    // WebSocket server initialized
    return this.io;
  }

  setupSocketMiddleware() {
    // Authentication middleware
    this.io.use((socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (token) {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ayurtrace_secret');
          socket.userId = decoded.id;
          socket.userRole = decoded.role;
          next();
        } else {
          // Allow anonymous connections for demo
          socket.userId = 'anonymous_' + Math.random().toString(36).substr(2, 9);
          socket.userRole = 'consumer';
          next();
        }
      } catch (err) {
        // Allow connection but mark as unauthenticated
        socket.userId = 'unauthenticated_' + Math.random().toString(36).substr(2, 9);
        socket.userRole = 'consumer';
        next();
      }
    });
  }

  setupSocketEvents() {
    this.io.on('connection', (socket) => {
      console.log(`User ${socket.userId} connected with role: ${socket.userRole}`);
      
      // Store connected user
      this.connectedUsers.set(socket.id, {
        userId: socket.userId,
        role: socket.userRole,
        connectedAt: new Date()
      });

      // Join role-based rooms
      socket.join(socket.userRole);
      socket.join(`user_${socket.userId}`);

      // Send welcome message
      socket.emit('connection_established', {
        message: 'Connected to AyurTrace real-time service',
        userId: socket.userId,
        role: socket.userRole,
        timestamp: new Date().toISOString()
      });

      // Handle batch tracking subscription
      socket.on('subscribe_batch_tracking', (batchId) => {
        socket.join(`batch_${batchId}`);
        console.log(`User ${socket.userId} subscribed to batch ${batchId}`);
        
        // Send current batch status
        this.sendBatchUpdate(batchId, {
          id: batchId,
          status: 'In Transit',
          location: { lat: 28.0, lng: 77.5, address: 'Highway NH-1, Near Delhi' },
          progress: 75,
          eta: '2024-09-18T14:30:00Z',
          timestamp: new Date().toISOString()
        });
      });

      // Handle analytics subscription
      socket.on('subscribe_analytics', () => {
        if (socket.userRole === 'admin' || socket.userRole === 'gov_admin') {
          socket.join('analytics_updates');
          logger.info(`User ${socket.userId} subscribed to analytics updates`);
        }
      });

      // Handle location updates (from mobile apps/GPS devices)
      socket.on('location_update', (data) => {
        const { batchId, lat, lng, additionalData } = data;
        
        if (batchId && lat && lng) {
          console.log(`Location update for batch ${batchId}:`, { lat, lng });
          
          // Broadcast to all subscribers of this batch
          this.io.to(`batch_${batchId}`).emit('batch_location_updated', {
            batchId,
            location: { lat, lng },
            additionalData,
            timestamp: new Date().toISOString(),
            updatedBy: socket.userId
          });
        }
      });

      // Handle quality test alerts
      socket.on('quality_alert', (data) => {
        const { batchId, alertType, message, severity } = data;
        
        console.log(`Quality alert for batch ${batchId}:`, { alertType, severity });
        
        // Send to admin users and batch subscribers
        this.io.to('admin').emit('quality_alert', {
          id: `ALERT_${Date.now()}`,
          batchId,
          type: alertType,
          message,
          severity,
          timestamp: new Date().toISOString(),
          reportedBy: socket.userId
        });
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        logger.info(`User ${socket.userId} disconnected`);
        this.connectedUsers.delete(socket.id);
      });

      // Handle errors
      socket.on('error', (error) => {
        logger.error(`Socket error for user ${socket.userId}:`, error);
      });
    });
  }

  // Send batch update to subscribers
  sendBatchUpdate(batchId, updateData) {
    this.io.to(`batch_${batchId}`).emit('batch_update', updateData);
  }

  // Send system-wide notification
  sendSystemNotification(notification) {
    this.io.emit('system_notification', {
      ...notification,
      timestamp: new Date().toISOString()
    });
  }

  // Send role-based notifications
  sendRoleNotification(role, notification) {
    this.io.to(role).emit('role_notification', {
      ...notification,
      timestamp: new Date().toISOString()
    });
  }

  // Send real-time analytics updates
  sendAnalyticsUpdate(data) {
    this.io.to('analytics_updates').emit('analytics_update', {
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  // Start periodic updates for demo purposes
  startPeriodicUpdates() {
    // Send analytics updates every 30 seconds
    setInterval(() => {
      const analyticsUpdate = {
        activeBatches: Math.floor(Math.random() * 200) + 100,
        batchesInTransit: Math.floor(Math.random() * 50) + 20,
        qualityTestsPending: Math.floor(Math.random() * 15) + 5,
        alertsActive: Math.floor(Math.random() * 10) + 1,
        systemLoad: Math.floor(Math.random() * 100) + 1
      };
      
      this.sendAnalyticsUpdate(analyticsUpdate);
    }, 30000);

    // Send batch location updates every 2 minutes
    setInterval(() => {
      const mockBatches = ['BATCH-F-2024-012', 'BATCH-F-2024-013', 'BATCH-M-2024-045'];
      
      mockBatches.forEach(batchId => {
        const randomLat = 28 + (Math.random() - 0.5) * 0.1;
        const randomLng = 77 + (Math.random() - 0.5) * 0.1;
        
        this.sendBatchUpdate(batchId, {
          id: batchId,
          status: 'In Transit',
          location: { 
            lat: randomLat, 
            lng: randomLng, 
            address: `Highway position ${randomLat.toFixed(4)}, ${randomLng.toFixed(4)}` 
          },
          progress: Math.floor(Math.random() * 100),
          timestamp: new Date().toISOString()
        });
      });
    }, 120000);

    // Send system status updates every 5 minutes
    setInterval(() => {
      const systemStatus = {
        status: 'operational',
        uptime: process.uptime(),
        activeConnections: this.connectedUsers.size,
        memoryUsage: process.memoryUsage(),
        timestamp: new Date().toISOString()
      };
      
      this.sendSystemNotification({
        type: 'system_status',
        data: systemStatus
      });
    }, 300000);
  }

  // Get connected users count
  getConnectedUsersCount() {
    return this.connectedUsers.size;
  }

  // Get users by role
  getUsersByRole(role) {
    return Array.from(this.connectedUsers.values())
      .filter(user => user.role === role)
      .length;
  }
}

module.exports = new SocketServer();
