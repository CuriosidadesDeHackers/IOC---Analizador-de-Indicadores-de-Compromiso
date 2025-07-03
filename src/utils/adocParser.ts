import { IOC, ParsedData } from '../types';

export class AdocParser {
  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private static detectIOCType(value: string): IOC['type'] {
    // Clean the value first
    const cleanValue = value.trim();
    
    // IP Address (including CIDR notation) - más estricto
    if (/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/(?:[0-9]|[1-2][0-9]|3[0-2]))?$/.test(cleanValue)) {
      return 'ip';
    }
    
    // Hash (MD5, SHA1, SHA256, SHA512) - más estricto
    if (/^[a-fA-F0-9]{32}$/.test(cleanValue) || 
        /^[a-fA-F0-9]{40}$/.test(cleanValue) || 
        /^[a-fA-F0-9]{64}$/.test(cleanValue) ||
        /^[a-fA-F0-9]{128}$/.test(cleanValue)) {
      return 'hash';
    }
    
    // URL - más estricto
    if (/^https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*(?:\?(?:[\w&=%.])*)?(?:\#(?:[\w.])*)?)?$/.test(cleanValue)) {
      return 'url';
    }
    
    // Email - más estricto
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(cleanValue)) {
      return 'email';
    }
    
    // Domain - más estricto, evitar falsos positivos
    if (/^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(cleanValue) && 
        !cleanValue.includes('..') && 
        cleanValue.split('.').length >= 2 &&
        cleanValue.length >= 4) {
      return 'domain';
    }
    
    // File path - más específico
    if (/^(?:[A-Za-z]:\\(?:[^<>:"/\\|?*\r\n]+\\)*[^<>:"/\\|?*\r\n]*|\/(?:[^<>\s"\\|?*\r\n]+\/)*[^<>\s"\\|?*\r\n]*|[^<>\s"\\|?*\r\n]*\.(?:exe|dll|bat|cmd|ps1|vbs|scr|jar|pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|7z|bin|sys|tmp))$/i.test(cleanValue)) {
      return 'file';
    }
    
    // Registry key
    if (/^HKEY_(?:CLASSES_ROOT|CURRENT_USER|LOCAL_MACHINE|USERS|CURRENT_CONFIG)\\/.test(cleanValue)) {
      return 'registry';
    }
    
    return 'other';
  }

  private static determineSeverity(description: string, tags: string[], section: string): IOC['severity'] {
    const text = (description + ' ' + tags.join(' ') + ' ' + section).toLowerCase();
    
    const criticalKeywords = ['critical', 'severe', 'ransomware', 'backdoor', 'trojan', 'apt', 'advanced persistent threat', 'crítico'];
    const highKeywords = ['high', 'malware', 'virus', 'worm', 'spyware', 'botnet', 'c2', 'command and control', 'alto'];
    const mediumKeywords = ['medium', 'suspicious', 'potential', 'phishing', 'scam', 'medio', 'sospechoso'];
    
    if (criticalKeywords.some(keyword => text.includes(keyword))) {
      return 'critical';
    }
    if (highKeywords.some(keyword => text.includes(keyword))) {
      return 'high';
    }
    if (mediumKeywords.some(keyword => text.includes(keyword))) {
      return 'medium';
    }
    
    return 'low';
  }

  private static normalizeHeaderName(header: string): string {
    return header.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .replace(/hash/i, 'hash')
      .replace(/archivo/i, 'archivo')
      .replace(/deteccion/i, 'deteccion')
      .replace(/descripcion/i, 'descripcion');
  }

  private static isValidIOC(value: string): boolean {
    const cleanValue = value.trim();
    
    // Lista de exclusiones para evitar falsos positivos
    const excludePatterns = [
      /^[0-9.]+$/, // Solo números y puntos
      /^[a-zA-Z]+$/, // Solo letras
      /^.{1,3}$/, // Muy corto
      /example\./i, // Ejemplos
      /test\./i, // Tests
      /localhost/i, // Localhost
      /127\.0\.0\.1/, // Loopback
      /192\.168\./, // IP privadas (opcional, depende del contexto)
      /10\.0\./, // IP privadas
      /github\.com/i, // GitHub
      /asciidoc/i, // AsciiDoc
      /\.adoc$/i, // Archivos adoc
      /^v?\d+\.\d+/, // Números de versión
      /^\d{1,2}:\d{2}/, // Tiempo
      /^\d{4}-\d{2}-\d{2}/, // Fechas
      /^[A-Z]{1,3}$/, // Siglas cortas
      /^www\.$/, // www. solo
      /^http:\/\/$/, // URL incompleta
      /^https:\/\/$/, // URL incompleta
    ];
    
    // Verificar exclusiones
    if (excludePatterns.some(pattern => pattern.test(cleanValue))) {
      return false;
    }
    
    // Verificar longitud mínima según tipo
    const type = this.detectIOCType(cleanValue);
    switch (type) {
      case 'hash':
        return [32, 40, 64, 128].includes(cleanValue.length);
      case 'ip':
        return cleanValue.length >= 7; // Mínimo x.x.x.x
      case 'domain':
        return cleanValue.length >= 4 && cleanValue.includes('.') && !cleanValue.startsWith('.') && !cleanValue.endsWith('.');
      case 'url':
        return cleanValue.length >= 10;
      case 'email':
        return cleanValue.length >= 5 && cleanValue.includes('@') && cleanValue.includes('.');
      case 'file':
        return cleanValue.length >= 4;
      case 'registry':
        return cleanValue.length >= 10;
      case 'other':
        return false; // No incluir "other" por defecto
      default:
        return false;
    }
  }

  static parseAdocContent(content: string): ParsedData {
    const lines = content.split('\n');
    const iocs: IOC[] = [];
    let currentSection = '';
    let inTable = false;
    let tableHeaders: string[] = [];
    let normalizedHeaders: string[] = [];
    let tablesFound = 0;
    let sectionsFound = 0;
    
    // Count total non-empty lines for statistics
    const totalLines = lines.filter(line => line.trim().length > 0).length;
    const contentLines = lines.filter(line => {
      const trimmed = line.trim();
      return trimmed.length > 0 && 
             !trimmed.startsWith('//') && 
             !trimmed.startsWith(':') &&
             !trimmed.match(/^=+\s+/) &&
             !trimmed.startsWith('|===');
    }).length;
    
    console.log('🔍 Parsing AsciiDoc content:');
    console.log('- Total lines:', lines.length);
    console.log('- Non-empty lines:', totalLines);
    console.log('- Content lines:', contentLines);
    
    // Log first few lines for debugging
    console.log('📝 First 10 lines:');
    lines.slice(0, 10).forEach((line, i) => {
      console.log(`${i + 1}: "${line}"`);
    });
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines and comments
      if (!line || line.startsWith('//') || line.startsWith(':')) {
        continue;
      }
      
      // Section headers (= == === etc.)
      if (line.match(/^=+\s+/)) {
        currentSection = line.replace(/^=+\s*/, '').trim();
        sectionsFound++;
        console.log(`📂 Found section ${sectionsFound}: "${currentSection}"`);
        inTable = false;
        continue;
      }
      
      // Table start/end
      if (line.startsWith('|===')) {
        inTable = !inTable;
        if (inTable) {
          tablesFound++;
          console.log(`📊 Starting table ${tablesFound} in section: "${currentSection}"`);
          // Look for table headers in the next line
          if (i + 1 < lines.length) {
            const nextLine = lines[i + 1].trim();
            if (nextLine.startsWith('|')) {
              tableHeaders = nextLine.split('|').map(h => h.trim()).filter(h => h);
              normalizedHeaders = tableHeaders.map(h => this.normalizeHeaderName(h));
              console.log('📋 Table headers:', tableHeaders);
              console.log('📋 Normalized headers:', normalizedHeaders);
              i++; // Skip the header line
            }
          }
        } else {
          console.log('📊 Ending table');
          tableHeaders = [];
          normalizedHeaders = [];
        }
        continue;
      }
      
      // Process table rows
      if (inTable && line.startsWith('|')) {
        const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
        console.log(`📋 Processing table row with ${cells.length} cells:`, cells);
        
        if (cells.length > 0 && tableHeaders.length > 0) {
          // Create table data object
          const tableData: Record<string, string> = {};
          cells.forEach((cell, index) => {
            if (index < tableHeaders.length) {
              const normalizedKey = normalizedHeaders[index];
              const originalKey = tableHeaders[index];
              tableData[normalizedKey] = cell;
              tableData[originalKey] = cell;
            }
          });
          
          console.log('📋 Table data object:', tableData);
          
          // Extract IOCs from each cell with validation
          cells.forEach((cell, cellIndex) => {
            const extractedIOCs = this.extractIOCsFromText(cell);
            const validIOCs = extractedIOCs.filter(ioc => this.isValidIOC(ioc));
            
            if (extractedIOCs.length > 0) {
              console.log(`🔍 Cell ${cellIndex} ("${cell}") - Extracted: ${extractedIOCs.length}, Valid: ${validIOCs.length}`);
              console.log('  - Extracted:', extractedIOCs);
              console.log('  - Valid:', validIOCs);
            }
            
            validIOCs.forEach(iocValue => {
              const description = this.buildDescriptionFromTable(tableData, currentSection);
              const tags = this.extractTags(cell, currentSection);
              
              const ioc: IOC = {
                id: this.generateId(),
                type: this.detectIOCType(iocValue),
                value: iocValue,
                description: description,
                severity: this.determineSeverity(description, tags, currentSection),
                source: 'CiberVengadores IOC Repository',
                dateAdded: new Date(),
                tags: tags,
                status: 'active',
                tableData: {
                  hash: tableData.hash || tableData.Hash,
                  archivo: tableData.archivo || tableData.Archivo,
                  deteccion: tableData.deteccion || tableData.Deteccion || tableData.detección || tableData.Detección,
                  descripcion: tableData.descripcion || tableData.Descripcion || tableData.descripción || tableData.Descripción,
                  ...tableData
                }
              };
              
              console.log(`✅ Created IOC: ${ioc.type} - ${ioc.value}`);
              iocs.push(ioc);
            });
          });
        }
        continue;
      }
      
      // Process regular text lines (outside tables)
      if (!inTable) {
        const extractedIOCs = this.extractIOCsFromText(line);
        const validIOCs = extractedIOCs.filter(ioc => this.isValidIOC(ioc));
        
        if (extractedIOCs.length > 0) {
          console.log(`🔍 Text line "${line}" - Extracted: ${extractedIOCs.length}, Valid: ${validIOCs.length}`);
          console.log('  - Extracted:', extractedIOCs);
          console.log('  - Valid:', validIOCs);
          
          const description = this.buildDescription(line, currentSection);
          const tags = this.extractTags(line, currentSection);
          
          validIOCs.forEach(iocValue => {
            const ioc: IOC = {
              id: this.generateId(),
              type: this.detectIOCType(iocValue),
              value: iocValue,
              description: description,
              severity: this.determineSeverity(description, tags, currentSection),
              source: 'CiberVengadores IOC Repository',
              dateAdded: new Date(),
              tags: tags,
              status: 'active'
            };
            
            console.log(`✅ Created IOC: ${ioc.type} - ${ioc.value}`);
            iocs.push(ioc);
          });
        }
      }
    }
    
    console.log('📊 Total IOCs extracted before deduplication:', iocs.length);
    
    // Remove duplicates based on value and type (más estricto)
    const uniqueIOCs = iocs.filter((ioc, index, self) => {
      const firstIndex = self.findIndex(i => 
        i.value.toLowerCase() === ioc.value.toLowerCase() && 
        i.type === ioc.type
      );
      return index === firstIndex;
    });
    
    console.log('✅ Unique IOCs after deduplication:', uniqueIOCs.length);
    
    // Log detailed breakdown
    const typeBreakdown = uniqueIOCs.reduce((acc, ioc) => {
      acc[ioc.type] = (acc[ioc.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('📈 IOC Type Breakdown:', typeBreakdown);
    
    // Log some sample IOCs for verification
    console.log('📋 Sample IOCs (first 5):');
    uniqueIOCs.slice(0, 5).forEach((ioc, i) => {
      console.log(`${i + 1}. ${ioc.type}: ${ioc.value} (${ioc.description})`);
    });
    
    // Calculate categories
    const categories: Record<string, number> = {};
    uniqueIOCs.forEach(ioc => {
      categories[ioc.type] = (categories[ioc.type] || 0) + 1;
    });
    
    const fileStats = {
      totalLines: lines.length,
      nonEmptyLines: totalLines,
      contentLines: contentLines,
      tablesFound: tablesFound,
      sectionsFound: sectionsFound
    };
    
    console.log('📋 Final Statistics:', {
      totalIOCs: uniqueIOCs.length,
      categories: categories,
      fileStats: fileStats
    });
    
    return {
      iocs: uniqueIOCs,
      lastUpdated: new Date(),
      totalCount: uniqueIOCs.length,
      categories,
      fileStats
    };
  }

  private static buildDescriptionFromTable(tableData: Record<string, string>, section: string): string {
    const parts = [];
    
    // Priority order for description building
    const descriptionFields = ['descripcion', 'Descripcion', 'descripción', 'Descripción', 'deteccion', 'Deteccion', 'detección', 'Detección'];
    
    for (const field of descriptionFields) {
      if (tableData[field] && tableData[field].trim()) {
        parts.push(tableData[field].trim());
        break;
      }
    }
    
    // Add file info if available
    if (tableData.archivo || tableData.Archivo) {
      const archivo = tableData.archivo || tableData.Archivo;
      if (archivo.trim() && !parts.some(part => part.includes(archivo))) {
        parts.push(`Archivo: ${archivo.trim()}`);
      }
    }
    
    // Add section context if not already included
    if (section && !parts.some(part => part.toLowerCase().includes(section.toLowerCase()))) {
      parts.push(`Sección: ${section}`);
    }
    
    return parts.length > 0 ? parts.join(' | ') : 'IOC extraído del repositorio de CiberVengadores';
  }

  private static extractIOCsFromText(text: string): string[] {
    const iocs: string[] = [];
    
    // Remove AsciiDoc formatting
    const cleanText = text.replace(/\*([^*]+)\*/g, '$1') // bold
                         .replace(/_([^_]+)_/g, '$1')   // italic
                         .replace(/`([^`]+)`/g, '$1')   // code
                         .replace(/\[([^\]]+)\]/g, '$1') // links
                         .replace(/<<[^>]+>>/g, '')     // cross-references
                         .replace(/link:[^\[]+\[[^\]]*\]/g, '') // asciidoc links
                         .trim();
    
    // IP addresses (including CIDR) - más estricto
    const ipRegex = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/(?:[0-9]|[1-2][0-9]|3[0-2]))?\b/g;
    const ipMatches = cleanText.match(ipRegex);
    if (ipMatches) {
      ipMatches.forEach(ip => {
        const parts = ip.split('/')[0].split('.');
        if (parts.every(part => {
          const num = parseInt(part);
          return num >= 0 && num <= 255;
        })) {
          iocs.push(ip);
        }
      });
    }
    
    // Hashes (MD5: 32, SHA1: 40, SHA256: 64, SHA512: 128) - más estricto
    const hashRegex = /\b[a-fA-F0-9]{32,128}\b/g;
    const hashMatches = cleanText.match(hashRegex);
    if (hashMatches) {
      hashMatches.forEach(hash => {
        if ([32, 40, 64, 128].includes(hash.length)) {
          iocs.push(hash.toLowerCase());
        }
      });
    }
    
    // URLs - más estricto
    const urlRegex = /https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*(?:\?(?:[\w&=%.])*)?(?:\#(?:[\w.])*)?)?/g;
    const urlMatches = cleanText.match(urlRegex);
    if (urlMatches) {
      urlMatches.forEach(url => {
        if (url.length >= 10 && !url.includes('example.') && !url.includes('test.')) {
          iocs.push(url);
        }
      });
    }
    
    // Email addresses - más estricto
    const emailRegex = /\b[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\b/g;
    const emailMatches = cleanText.match(emailRegex);
    if (emailMatches) {
      emailMatches.forEach(email => {
        if (!email.includes('example.') && !email.includes('test.') && email.length >= 5) {
          iocs.push(email);
        }
      });
    }
    
    // Domains - más específico para evitar falsos positivos
    const domainRegex = /\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}\b/g;
    const domainMatches = cleanText.match(domainRegex);
    if (domainMatches) {
      domainMatches.forEach(domain => {
        // Filtros más estrictos para dominios
        if (!domain.includes('example.') && 
            !domain.includes('test.') && 
            !domain.includes('localhost') &&
            !domain.includes('github.com') &&
            !domain.includes('asciidoc') &&
            !domain.match(/^\d+\.\d+$/) && // version numbers
            !domain.match(/^[0-9.]+$/) && // pure numbers
            !domain.startsWith('.') &&
            !domain.endsWith('.') &&
            domain.includes('.') &&
            domain.length >= 4 &&
            domain.split('.').length >= 2 &&
            domain.split('.').every(part => part.length > 0)) {
          iocs.push(domain.toLowerCase());
        }
      });
    }
    
    // File paths and names - más específico
    const fileRegex = /(?:[A-Za-z]:\\[^<>"{}|\\^`\[\]\s]*|\/[^<>"{}|\\^`\[\]\s]*|[^\s<>"{}|\\^`\[\]]*\.(?:exe|dll|bat|cmd|ps1|vbs|scr|jar|pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|7z|bin|sys|tmp))\b/gi;
    const fileMatches = cleanText.match(fileRegex);
    if (fileMatches) {
      fileMatches.forEach(file => {
        if (file.length > 4 && 
            !file.includes('example') && 
            !file.includes('test') &&
            (file.includes('\\') || file.includes('/') || file.includes('.'))) {
          iocs.push(file);
        }
      });
    }
    
    // Registry keys - más específico
    const registryRegex = /HKEY_(?:CLASSES_ROOT|CURRENT_USER|LOCAL_MACHINE|USERS|CURRENT_CONFIG)\\[^\s<>"{}|\\^`\[\]]+/gi;
    const registryMatches = cleanText.match(registryRegex);
    if (registryMatches) {
      registryMatches.forEach(registry => {
        if (registry.length > 10) {
          iocs.push(registry);
        }
      });
    }
    
    return [...new Set(iocs)]; // Remove duplicates
  }

  private static buildDescription(text: string, section: string, columnHeader?: string): string {
    // Clean the text from IOC patterns to get description
    let description = text.replace(/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/(?:[0-9]|[1-2][0-9]|3[0-2]))?\b/g, '') // IPs
                         .replace(/\b[a-fA-F0-9]{32,128}\b/g, '') // Hashes
                         .replace(/https?:\/\/[^\s<>"{}|\\^`\[\]]+/g, '') // URLs
                         .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '') // Emails
                         .replace(/\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}\b/g, '') // Domains
                         .replace(/[|*_`-]/g, '') // AsciiDoc formatting
                         .replace(/\s+/g, ' ') // Multiple spaces
                         .trim();
    
    // Build a meaningful description
    const parts = [];
    
    if (columnHeader && columnHeader !== description && columnHeader.length > 2) {
      parts.push(columnHeader);
    }
    
    if (description && description.length > 3) {
      parts.push(description);
    }
    
    if (section && !parts.some(part => part.toLowerCase().includes(section.toLowerCase()))) {
      parts.push(`Relacionado con: ${section}`);
    }
    
    return parts.length > 0 ? parts.join(' - ') : 'IOC extraído del repositorio de CiberVengadores';
  }

  private static extractTags(text: string, section: string): string[] {
    const tags: string[] = [];
    
    // Add section as tag
    if (section) {
      tags.push(section.toLowerCase().replace(/\s+/g, '-'));
    }
    
    // Common cybersecurity keywords
    const keywords = [
      'malware', 'ransomware', 'trojan', 'backdoor', 'spyware', 'adware',
      'phishing', 'scam', 'fraud', 'suspicious', 'botnet', 'c2', 'c&c',
      'apt', 'threat', 'campaign', 'family', 'variant', 'exploit',
      'vulnerability', 'attack', 'compromise', 'breach', 'incident',
      'indicator', 'ioc', 'threat-intelligence', 'cybersecurity',
      'peticion', 'solicitud', 'request', 'analysis', 'analisis'
    ];
    
    const lowerText = text.toLowerCase();
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        tags.push(keyword);
      }
    });
    
    // Extract hashtags if present
    const hashtagRegex = /#([a-zA-Z0-9_]+)/g;
    const hashtagMatches = text.match(hashtagRegex);
    if (hashtagMatches) {
      tags.push(...hashtagMatches.map(tag => tag.substring(1).toLowerCase()));
    }
    
    return [...new Set(tags)]; // Remove duplicates
  }
}