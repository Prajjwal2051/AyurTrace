import React, { useState, useCallback } from 'react';
import localStorageManager from '../../utils/localStorage';

const DataExportManager = ({ onClose }) => {
  const [selectedDataTypes, setSelectedDataTypes] = useState(['batches']);
  const [exportFormat, setExportFormat] = useState('json');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filters, setFilters] = useState({});
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const dataTypes = {
    batches: {
      name: 'Herb Batches',
      description: 'All herb batch records with farming details',
      icon: '🌱',
      count: 0
    },
    products: {
      name: 'Products',
      description: 'Processed products and manufacturing data',
      icon: '📦',
      count: 0
    },
    verifications: {
      name: 'Verifications',
      description: 'Consumer verification records',
      icon: '✅',
      count: 0
    },
    analytics: {
      name: 'Analytics',
      description: 'Platform usage and statistics data',
      icon: '📊',
      count: 0
    }
  };

  const exportFormats = {
    json: { name: 'JSON', extension: '.json', icon: '📄' },
    csv: { name: 'CSV', extension: '.csv', icon: '📊' },
    xml: { name: 'XML', extension: '.xml', icon: '📋' },
    pdf: { name: 'PDF Report', extension: '.pdf', icon: '📑' }
  };

  // Initialize data counts
  React.useEffect(() => {
    const batches = localStorageManager.getBatches();
    const products = localStorageManager.getProducts();
    const verifications = localStorageManager.getVerifications();
    const analytics = localStorageManager.getAnalytics();

    dataTypes.batches.count = batches.length;
    dataTypes.products.count = products.length;
    dataTypes.verifications.count = verifications.length;
    dataTypes.analytics.count = analytics.length;
  }, []);

  // Generate CSV from data
  const generateCSV = (data, headers) => {
    const csvHeader = headers.join(',');
    const csvRows = data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value.replace(/"/g, '""')}"` 
          : value || '';
      }).join(',')
    );
    return [csvHeader, ...csvRows].join('\n');
  };

  // Generate XML from data
  const generateXML = (data, rootElement) => {
    const xmlItems = data.map(item => {
      const xmlProps = Object.entries(item).map(([key, value]) => 
        `    <${key}>${value || ''}</${key}>`
      ).join('\n');
      return `  <item>\n${xmlProps}\n  </item>`;
    }).join('\n');
    
    return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootElement}>\n${xmlItems}\n</${rootElement}>`;
  };

  // Generate PDF report
  const generatePDFReport = (data) => {
    // This would normally use a library like jsPDF
    // For demo purposes, we'll create a formatted text report
    const reportContent = `
AyurTrace Data Export Report
Generated: ${new Date().toLocaleDateString()}

Data Summary:
- Herb Batches: ${dataTypes.batches.count}
- Products: ${dataTypes.products.count}
- Verifications: ${dataTypes.verifications.count}
- Analytics Records: ${dataTypes.analytics.count}

Export Details:
${selectedDataTypes.map(type => `- ${dataTypes[type].name}: ${data[type]?.length || 0} records`).join('\n')}

Date Range: ${dateRange.start || 'All'} to ${dateRange.end || 'All'}
    `;
    
    return reportContent;
  };

  // Filter data based on criteria
  const filterData = useCallback((data, type) => {
    let filtered = [...data];

    // Date range filter
    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.createdAt || item.verificationDate || item.timestamp);
        const startDate = dateRange.start ? new Date(dateRange.start) : new Date('1900-01-01');
        const endDate = dateRange.end ? new Date(dateRange.end) : new Date();
        
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    // Type-specific filters
    if (filters[type]) {
      Object.entries(filters[type]).forEach(([key, value]) => {
        if (value) {
          filtered = filtered.filter(item => 
            item[key] && item[key].toString().toLowerCase().includes(value.toLowerCase())
          );
        }
      });
    }

    return filtered;
  }, [dateRange, filters]);

  // Get data for export
  const getExportData = useCallback(() => {
    const exportData = {};

    selectedDataTypes.forEach(type => {
      let data = [];
      
      switch (type) {
        case 'batches':
          data = localStorageManager.getBatches();
          break;
        case 'products':
          data = localStorageManager.getProducts();
          break;
        case 'verifications':
          data = localStorageManager.getVerifications();
          break;
        case 'analytics':
          data = localStorageManager.getAnalytics();
          break;
        default:
          data = [];
      }

      exportData[type] = filterData(data, type);
    });

    return exportData;
  }, [selectedDataTypes, filterData]);

  // Export data in selected format
  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate processing steps
      const steps = ['Gathering data...', 'Applying filters...', 'Formatting...', 'Generating file...'];
      
      for (let i = 0; i < steps.length; i++) {
        setExportProgress((i + 1) * 25);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const data = getExportData();
      let exportContent;
      let fileName;

      switch (exportFormat) {
        case 'csv':
          // Export each data type as separate CSV
          selectedDataTypes.forEach(type => {
            if (data[type] && data[type].length > 0) {
              const headers = Object.keys(data[type][0]);
              const csvContent = generateCSV(data[type], headers);
              downloadFile(csvContent, `ayurtrace_${type}_${Date.now()}.csv`, 'text/csv');
            }
          });
          break;

        case 'xml':
          selectedDataTypes.forEach(type => {
            if (data[type] && data[type].length > 0) {
              const xmlContent = generateXML(data[type], type);
              downloadFile(xmlContent, `ayurtrace_${type}_${Date.now()}.xml`, 'application/xml');
            }
          });
          break;

        case 'pdf':
          const pdfContent = generatePDFReport(data);
          downloadFile(pdfContent, `ayurtrace_report_${Date.now()}.txt`, 'text/plain');
          break;

        default: // json
          exportContent = JSON.stringify(data, null, 2);
          fileName = `ayurtrace_export_${Date.now()}.json`;
          downloadFile(exportContent, fileName, 'application/json');
      }

      setExportProgress(100);
      
      // Show success message
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 1000);

    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  // Download file helper
  const downloadFile = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle data type selection
  const handleDataTypeChange = (type) => {
    setSelectedDataTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 249, 250, 0.95))',
        backdropFilter: 'blur(20px)',
        borderRadius: '25px',
        padding: '0',
        maxWidth: '800px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
          padding: '25px 35px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold' }}>
              📊 Data Export Manager
            </h4>
            <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
              Export your AyurTrace data in various formats
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              color: 'white',
              fontSize: '18px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '35px', maxHeight: 'calc(90vh - 160px)', overflowY: 'auto' }}>
          {/* Data Type Selection */}
          <div style={{ marginBottom: '30px' }}>
            <h5 style={{ marginBottom: '15px', color: '#333' }}>Select Data Types</h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
              {Object.entries(dataTypes).map(([key, type]) => (
                <div
                  key={key}
                  style={{
                    background: selectedDataTypes.includes(key) 
                      ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(139, 195, 74, 0.1))'
                      : 'rgba(248, 249, 250, 0.8)',
                    border: selectedDataTypes.includes(key) 
                      ? '2px solid #4CAF50' 
                      : '2px solid #e9ecef',
                    borderRadius: '15px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => handleDataTypeChange(key)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '24px', marginRight: '12px' }}>{type.icon}</span>
                    <div>
                      <div style={{ fontWeight: '600', color: '#333' }}>{type.name}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{type.count} records</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.4' }}>
                    {type.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Format Selection */}
          <div style={{ marginBottom: '30px' }}>
            <h5 style={{ marginBottom: '15px', color: '#333' }}>Export Format</h5>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {Object.entries(exportFormats).map(([key, format]) => (
                <button
                  key={key}
                  onClick={() => setExportFormat(key)}
                  style={{
                    background: exportFormat === key 
                      ? 'linear-gradient(45deg, #4CAF50, #8BC34A)'
                      : 'rgba(248, 249, 250, 0.8)',
                    color: exportFormat === key ? 'white' : '#666',
                    border: exportFormat === key ? 'none' : '2px solid #e9ecef',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>{format.icon}</span>
                  {format.name}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div style={{ marginBottom: '30px' }}>
            <h5 style={{ marginBottom: '15px', color: '#333' }}>Date Range Filter (Optional)</h5>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#666' }}>
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  style={{
                    padding: '10px 15px',
                    borderRadius: '8px',
                    border: '2px solid #e9ecef',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#666' }}>
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  style={{
                    padding: '10px 15px',
                    borderRadius: '8px',
                    border: '2px solid #e9ecef',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Export Progress */}
          {isExporting && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                  Exporting... {exportProgress}%
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: '#f0f0f0',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${exportProgress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          )}

          {/* Export Actions */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(108, 117, 125, 0.2)',
                border: '2px solid rgba(108, 117, 125, 0.3)',
                color: '#6c757d',
                padding: '12px 24px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={selectedDataTypes.length === 0 || isExporting}
              style={{
                background: selectedDataTypes.length === 0 || isExporting
                  ? 'rgba(108, 117, 125, 0.5)'
                  : 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                cursor: selectedDataTypes.length === 0 || isExporting ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                opacity: selectedDataTypes.length === 0 || isExporting ? 0.6 : 1
              }}
            >
              {isExporting ? '⏳ Exporting...' : '📤 Export Data'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExportManager;
