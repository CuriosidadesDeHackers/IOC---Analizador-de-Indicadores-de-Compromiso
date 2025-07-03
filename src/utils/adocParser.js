export class AdocParser {
    static generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
    static detectIOCType(value) {
        // Clean the value first
        const cleanValue = value.trim();
        // IP Address (including CIDR notation)
        if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(\/\d{1,2})?$/.test(cleanValue)) {
            return 'ip';
        }
        // Hash (MD5, SHA1, SHA256, SHA512)
        if (/^[a-fA-F0-9]{32}$/.test(cleanValue) ||
            /^[a-fA-F0-9]{40}$/.test(cleanValue) ||
            /^[a-fA-F0-9]{64}$/.test(cleanValue) ||
            /^[a-fA-F0-9]{128}$/.test(cleanValue)) {
            return 'hash';
        }
        // URL
        if (/^https?:\/\/.+/.test(cleanValue)) {
            return 'url';
        }
        // Email
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanValue)) {
            return 'email';
        }
        // Domain (must have at least one dot and valid TLD)
        if (/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/.test(cleanValue)) {
            return 'domain';
        }
        // File path
        if (/^[A-Za-z]:\\.*|^\/.*|.*\.(exe|dll|bat|cmd|ps1|vbs|scr|jar|pdf|doc|docx|xls|xlsx|ppt|pptx)$/i.test(cleanValue)) {
            return 'file';
        }
        // Registry key
        if (/^HKEY_/.test(cleanValue)) {
            return 'registry';
        }
        return 'other';
    }
    static determineSeverity(description, tags, section) {
        const text = (description + ' ' + tags.join(' ') + ' ' + section).toLowerCase();
        const criticalKeywords = ['critical', 'severe', 'ransomware', 'backdoor', 'trojan', 'apt', 'advanced persistent threat'];
        const highKeywords = ['high', 'malware', 'virus', 'worm', 'spyware', 'botnet', 'c2', 'command and control'];
        const mediumKeywords = ['medium', 'suspicious', 'potential', 'phishing', 'scam'];
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
    static normalizeHeaderName(header) {
        return header.toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .replace(/hash/i, 'hash')
            .replace(/archivo/i, 'archivo')
            .replace(/deteccion/i, 'deteccion')
            .replace(/descripcion/i, 'descripcion');
    }
    static parseAdocContent(content) {
        const lines = content.split('\n');
        const iocs = [];
        let currentSection = '';
        let inTable = false;
        let tableHeaders = [];
        let normalizedHeaders = [];
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
        console.log('Parsing AsciiDoc content:');
        console.log('- Total lines:', lines.length);
        console.log('- Non-empty lines:', totalLines);
        console.log('- Content lines:', contentLines);
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            // Skip empty lines and comments
            if (!line || line.startsWith('//') || line.startsWith(':')) {
                continue;
            }
            // Section headers (= == === etc.)
            if (line.match(/^=+\s+/)) {
                currentSection = line.replace(/^=+\s*/, '').trim();
                console.log('Found section:', currentSection);
                inTable = false;
                continue;
            }
            // Table start/end
            if (line.startsWith('|===')) {
                inTable = !inTable;
                if (inTable) {
                    console.log('Starting table in section:', currentSection);
                    // Look for table headers in the next line
                    if (i + 1 < lines.length) {
                        const nextLine = lines[i + 1].trim();
                        if (nextLine.startsWith('|')) {
                            tableHeaders = nextLine.split('|').map(h => h.trim()).filter(h => h);
                            normalizedHeaders = tableHeaders.map(h => this.normalizeHeaderName(h));
                            console.log('Table headers:', tableHeaders);
                            console.log('Normalized headers:', normalizedHeaders);
                            i++; // Skip the header line
                        }
                    }
                }
                else {
                    console.log('Ending table');
                    tableHeaders = [];
                    normalizedHeaders = [];
                }
                continue;
            }
            // Process table rows
            if (inTable && line.startsWith('|')) {
                const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
                console.log('Processing table row:', cells);
                if (cells.length > 0 && tableHeaders.length > 0) {
                    // Create table data object
                    const tableData = {};
                    cells.forEach((cell, index) => {
                        if (index < tableHeaders.length) {
                            const normalizedKey = normalizedHeaders[index];
                            const originalKey = tableHeaders[index];
                            tableData[normalizedKey] = cell;
                            tableData[originalKey] = cell; // Keep original key too
                        }
                    });
                    console.log('Table data object:', tableData);
                    // Extract IOCs from each cell
                    cells.forEach((cell, index) => {
                        const extractedIOCs = this.extractIOCsFromText(cell);
                        if (extractedIOCs.length > 0) {
                            console.log('Found IOCs in cell:', extractedIOCs);
                        }
                        extractedIOCs.forEach(iocValue => {
                            const columnHeader = index < tableHeaders.length ? tableHeaders[index] : '';
                            const description = this.buildDescriptionFromTable(tableData, currentSection);
                            const tags = this.extractTags(cell, currentSection);
                            const ioc = {
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
                                    ...tableData // Include all table data
                                }
                            };
                            iocs.push(ioc);
                        });
                    });
                }
                continue;
            }
            // Process regular text lines (outside tables)
            if (!inTable) {
                const extractedIOCs = this.extractIOCsFromText(line);
                if (extractedIOCs.length > 0) {
                    console.log('Found IOCs in text line:', extractedIOCs);
                    const description = this.buildDescription(line, currentSection);
                    const tags = this.extractTags(line, currentSection);
                    extractedIOCs.forEach(iocValue => {
                        const ioc = {
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
                        iocs.push(ioc);
                    });
                }
            }
        }
        console.log('Total IOCs extracted before deduplication:', iocs.length);
        // Remove duplicates based on value and type
        const uniqueIOCs = iocs.filter((ioc, index, self) => index === self.findIndex(i => i.value === ioc.value && i.type === ioc.type));
        console.log('Unique IOCs after deduplication:', uniqueIOCs.length);
        // Calculate categories
        const categories = {};
        uniqueIOCs.forEach(ioc => {
            categories[ioc.type] = (categories[ioc.type] || 0) + 1;
        });
        console.log('Categories:', categories);
        console.log('File statistics:', {
            totalLines: lines.length,
            nonEmptyLines: totalLines,
            contentLines: contentLines,
            extractedIOCs: uniqueIOCs.length
        });
        return {
            iocs: uniqueIOCs,
            lastUpdated: new Date(),
            totalCount: uniqueIOCs.length,
            categories,
            // Add file statistics
            fileStats: {
                totalLines: lines.length,
                nonEmptyLines: totalLines,
                contentLines: contentLines,
                tablesFound: 0, // Could be enhanced to count tables
                sectionsFound: 0 // Could be enhanced to count sections
            }
        };
    }
    static buildDescriptionFromTable(tableData, section) {
        const parts = [];
        // Priority order for description building
        const descriptionFields = ['descripcion', 'Descripcion', 'descripción', 'Descripción', 'deteccion', 'Deteccion', 'detección', 'Detección'];
        for (const field of descriptionFields) {
            if (tableData[field] && tableData[field].trim()) {
                parts.push(tableData[field].trim());
                break; // Use the first available description field
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
    static extractIOCsFromText(text) {
        const iocs = [];
        // Remove AsciiDoc formatting
        const cleanText = text.replace(/\*([^*]+)\*/g, '$1') // bold
            .replace(/_([^_]+)_/g, '$1') // italic
            .replace(/`([^`]+)`/g, '$1') // code
            .replace(/\[([^\]]+)\]/g, '$1') // links
            .replace(/<<[^>]+>>/g, '') // cross-references
            .replace(/link:[^\[]+\[[^\]]*\]/g, '') // asciidoc links
            .trim();
        // IP addresses (including CIDR)
        const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}(?:\/\d{1,2})?\b/g;
        const ipMatches = cleanText.match(ipRegex);
        if (ipMatches) {
            ipMatches.forEach(ip => {
                // Validate IP address
                const parts = ip.split('/')[0].split('.');
                if (parts.every(part => parseInt(part) >= 0 && parseInt(part) <= 255)) {
                    iocs.push(ip);
                }
            });
        }
        // Hashes (MD5: 32, SHA1: 40, SHA256: 64, SHA512: 128)
        const hashRegex = /\b[a-fA-F0-9]{32,128}\b/g;
        const hashMatches = cleanText.match(hashRegex);
        if (hashMatches) {
            hashMatches.forEach(hash => {
                if ([32, 40, 64, 128].includes(hash.length)) {
                    iocs.push(hash.toLowerCase());
                }
            });
        }
        // URLs (more comprehensive pattern)
        const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]\(\)]+/g;
        const urlMatches = cleanText.match(urlRegex);
        if (urlMatches) {
            iocs.push(...urlMatches);
        }
        // Email addresses
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        const emailMatches = cleanText.match(emailRegex);
        if (emailMatches) {
            iocs.push(...emailMatches);
        }
        // Domains (more specific pattern to avoid false positives)
        const domainRegex = /\b[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}\b/g;
        const domainMatches = cleanText.match(domainRegex);
        if (domainMatches) {
            domainMatches.forEach(domain => {
                // Filter out common false positives
                if (!domain.includes('example.') &&
                    !domain.includes('test.') &&
                    !domain.includes('localhost') &&
                    !domain.includes('github.com') &&
                    !domain.includes('asciidoc') &&
                    !domain.match(/^\d+\.\d+$/) && // version numbers
                    !domain.match(/^[0-9.]+$/) && // pure numbers
                    domain.includes('.') &&
                    domain.length > 4) {
                    iocs.push(domain.toLowerCase());
                }
            });
        }
        // File paths and names (improved pattern)
        const fileRegex = /(?:[A-Za-z]:\\[^<>"{}|\\^`\[\]\s]*|\/[^<>"{}|\\^`\[\]\s]*|[^\s<>"{}|\\^`\[\]]*\.(exe|dll|bat|cmd|ps1|vbs|scr|jar|pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|7z|bin|sys|tmp))\b/gi;
        const fileMatches = cleanText.match(fileRegex);
        if (fileMatches) {
            fileMatches.forEach(file => {
                if (file.length > 3 && !file.includes('example')) {
                    iocs.push(file);
                }
            });
        }
        // Registry keys
        const registryRegex = /HKEY_[A-Z_]+\\[^\s<>"{}|\\^`\[\]]+/gi;
        const registryMatches = cleanText.match(registryRegex);
        if (registryMatches) {
            iocs.push(...registryMatches);
        }
        return [...new Set(iocs)]; // Remove duplicates
    }
    static buildDescription(text, section, columnHeader) {
        // Clean the text from IOC patterns to get description
        let description = text.replace(/\b(?:\d{1,3}\.){3}\d{1,3}(?:\/\d{1,2})?\b/g, '') // IPs
            .replace(/\b[a-fA-F0-9]{32,128}\b/g, '') // Hashes
            .replace(/https?:\/\/[^\s<>"{}|\\^`\[\]]+/g, '') // URLs
            .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '') // Emails
            .replace(/\b[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}\b/g, '') // Domains
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
    static extractTags(text, section) {
        const tags = [];
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
