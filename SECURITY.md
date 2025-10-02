# Security Policy and Best Practices

## 🔒 Security Overview

This document outlines security best practices and policies for the AyurTrace project. Following these guidelines is crucial for maintaining the security and integrity of the supply chain traceability system.

---

## 📋 Table of Contents

1. [Security Vulnerabilities](#security-vulnerabilities)
2. [Authentication & Authorization](#authentication--authorization)
3. [Environment Variables & Secrets](#environment-variables--secrets)
4. [Database Security](#database-security)
5. [API Security](#api-security)
6. [Blockchain Security](#blockchain-security)
7. [Production Deployment](#production-deployment)
8. [Security Checklist](#security-checklist)

---

## 🚨 Security Vulnerabilities

### Reporting Security Issues

If you discover a security vulnerability, please email **security@ayurtrace.com** (or your team's security contact). Do NOT create public GitHub issues for security vulnerabilities.

**Please include:**
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

**Response Timeline:**
- Acknowledgment within 24 hours
- Initial assessment within 72 hours
- Fix timeline based on severity

---

## 🔐 Authentication & Authorization

### JWT Tokens

**Current Implementation:**
- JWT-based authentication with role-based access control
- Token expiry: 7 days (configurable)
- Tokens stored in localStorage (client-side)

**Security Recommendations:**

1. **Generate Strong JWT Secrets:**
   ```bash
   # Generate a 64-byte random secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Token Storage:**
   - Consider using httpOnly cookies instead of localStorage for better XSS protection
   - Implement refresh token mechanism for long-lived sessions
   - Clear tokens on logout

3. **Password Requirements:**
   - Minimum 8 characters
   - Must include: uppercase, lowercase, number, special character
   - Passwords hashed using bcryptjs

### Role-Based Access Control (RBAC)

**Roles:**
- `farmer` - Create and manage herb batches
- `manufacturer` - Process batches, add quality tests
- `consumer` - Verify products, view supply chain
- `admin` - Full system access
- `gov_admin` - Government oversight and monitoring

**Implementation:**
```javascript
// Protect routes with role authorization
router.get('/admin/dashboard', 
  protect, 
  authorize('admin', 'gov_admin'), 
  getDashboard
);
```

---

## 🔑 Environment Variables & Secrets

### Critical Environment Variables

**Never commit these to version control:**
```bash
JWT_SECRET=                    # Generate using crypto.randomBytes
MONGODB_URI=                   # Contains database credentials
GPS_API_KEY=                   # External service API keys
```

### Secrets Management Best Practices

1. **Development:**
   - Use `.env` file (already in `.gitignore`)
   - Copy `.env.example` to `.env` and fill in values
   - Never share `.env` file

2. **Production:**
   - Use environment-specific secrets management:
     - **AWS**: AWS Secrets Manager, AWS Systems Manager Parameter Store
     - **Azure**: Azure Key Vault
     - **GCP**: Google Secret Manager
     - **Kubernetes**: Kubernetes Secrets
   - Rotate secrets regularly (every 90 days recommended)
   - Use different secrets for each environment

3. **Docker Deployment:**
   ```bash
   # Use Docker secrets (don't put secrets in docker-compose.yml)
   docker secret create jwt_secret jwt_secret.txt
   
   # Or use env_file with restricted permissions
   chmod 600 .env.production
   ```

---

## 🗄️ Database Security

### MongoDB Security

**Current Setup:**
- Connection string in environment variables
- Mongoose ODM for query sanitization

**Hardening Recommendations:**

1. **Enable Authentication:**
   ```javascript
   // Use authentication in production
   MONGODB_URI=mongodb://username:password@host:27017/ayurtrace?authSource=admin
   ```

2. **Enable SSL/TLS:**
   ```javascript
   MONGODB_URI=mongodb://username:password@host:27017/ayurtrace?ssl=true
   ```

3. **Network Security:**
   - Use VPC/Private network
   - Whitelist IP addresses
   - Use MongoDB Atlas for managed security

4. **Data Encryption:**
   - Enable encryption at rest
   - Use TLS for data in transit
   - Consider field-level encryption for sensitive data

5. **Regular Backups:**
   ```bash
   # Automated daily backups
   mongodump --uri="mongodb://localhost:27017/ayurtrace" --archive=backup.gz --gzip
   ```

---

## 🛡️ API Security

### Implemented Security Measures

1. **Helmet.js** - Security headers
2. **Rate Limiting** - 200 requests per 15 minutes
3. **CORS** - Configured allowed origins
4. **Input Sanitization** - NoSQL injection prevention
5. **XSS Protection** - Input/output sanitization
6. **HPP** - HTTP Parameter Pollution prevention

### Additional Recommendations

1. **API Rate Limiting (Tiered):**
   ```javascript
   // Stricter limits for sensitive endpoints
   const authLimiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 5  // 5 login attempts per 15 minutes
   });
   
   app.use('/api/auth/login', authLimiter);
   ```

2. **Request Size Limits:**
   ```javascript
   // Already implemented - 10MB limit
   app.use(express.json({ limit: '10mb' }));
   ```

3. **HTTPS Only:**
   ```javascript
   // Force HTTPS in production
   if (process.env.NODE_ENV === 'production') {
     app.use((req, res, next) => {
       if (req.header('x-forwarded-proto') !== 'https') {
         res.redirect(`https://${req.header('host')}${req.url}`);
       } else {
         next();
       }
     });
   }
   ```

4. **API Versioning:**
   ```javascript
   // Implement versioning for backward compatibility
   app.use('/api/v1/auth', authRoutes);
   ```

---

## ⛓️ Blockchain Security

### Hyperledger Fabric Security

**Network Security:**
1. **Certificate Management:**
   - Use Fabric CA for certificate issuance
   - Rotate certificates before expiry
   - Revoke compromised certificates immediately

2. **Chaincode Security:**
   - Input validation in smart contracts
   - Access control within chaincode
   - Regular security audits

3. **Private Data:**
   ```javascript
   // Use private data collections for sensitive info
   const collection = "farmersPrivateDetails";
   ```

---

## 🚀 Production Deployment

### Pre-Deployment Security Checklist

- [ ] All environment variables configured securely
- [ ] Strong JWT secret generated (64+ bytes)
- [ ] MongoDB authentication enabled
- [ ] SSL/TLS certificates installed
- [ ] CORS configured for production domains only
- [ ] Rate limiting tuned for production traffic
- [ ] Error messages don't expose sensitive info
- [ ] Logging configured (no sensitive data in logs)
- [ ] Security headers configured (Helmet.js)
- [ ] Regular backup strategy implemented
- [ ] Monitoring and alerting configured
- [ ] DDoS protection enabled (Cloudflare, AWS Shield, etc.)

### Infrastructure Security

1. **Firewall Rules:**
   ```bash
   # Only allow necessary ports
   - Port 80/443: HTTP/HTTPS (public)
   - Port 3001: API (internal/load balancer only)
   - Port 27017: MongoDB (internal only)
   - Port 22: SSH (restricted IPs only)
   ```

2. **Regular Updates:**
   ```bash
   # Keep dependencies updated
   npm audit
   npm audit fix
   
   # Update Docker images regularly
   docker pull node:18-alpine
   ```

3. **Container Security:**
   - Run containers as non-root user (already implemented in Dockerfile)
   - Use minimal base images (alpine)
   - Scan images for vulnerabilities
   ```bash
   docker scan ayurtrace-backend:latest
   ```

---

## ✅ Security Checklist

### Development

- [x] Environment variables properly configured
- [x] Input validation on all endpoints
- [x] Authentication and authorization implemented
- [x] Security headers configured
- [x] Rate limiting implemented
- [x] Dependencies updated (no known vulnerabilities)
- [ ] Unit tests for security functions
- [ ] Integration tests for auth flows

### Pre-Production

- [ ] Security audit completed
- [ ] Penetration testing performed
- [ ] Load testing completed
- [ ] SSL certificates obtained and configured
- [ ] Backup and recovery tested
- [ ] Monitoring dashboards configured
- [ ] Incident response plan documented

### Production

- [ ] All checklist items above completed
- [ ] Production secrets rotated
- [ ] Monitoring alerts configured
- [ ] Regular security scans scheduled
- [ ] Compliance requirements met (GDPR, etc.)

---

## 🔄 Regular Security Maintenance

### Weekly
- Review access logs for suspicious activity
- Check for failed authentication attempts
- Monitor rate limiting triggers

### Monthly
- Run `npm audit` and update dependencies
- Review and rotate API keys if needed
- Check backup integrity

### Quarterly
- Rotate JWT secrets
- Rotate database credentials
- Security assessment review
- Update SSL certificates if needed

### Annually
- Comprehensive security audit
- Penetration testing
- Disaster recovery drill
- Security policy review

---

## 📚 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)
- [Hyperledger Fabric Security](https://hyperledger-fabric.readthedocs.io/en/latest/security_model.html)

---

## 📞 Contact

For security concerns, contact:
- **Email**: security@ayurtrace.com
- **Bug Bounty**: [Link to bug bounty program if applicable]

---

**Last Updated**: October 2, 2025  
**Version**: 1.0
