export interface IOC {
  id: string;
  type: 'hash' | 'ip' | 'domain' | 'url' | 'email' | 'file' | 'registry' | 'other';
  value: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  dateAdded: Date;
  tags: string[];
  status: 'active' | 'inactive' | 'pending';
  // Nuevos campos para datos estructurados de la tabla
  tableData?: {
    hash?: string;
    archivo?: string;
    deteccion?: string;
    descripcion?: string;
    [key: string]: string | undefined; // Para otros campos de tabla
  };
}

export interface ParsedData {
  iocs: IOC[];
  lastUpdated: Date;
  totalCount: number;
  categories: Record<string, number>;
  // Estadísticas del archivo
  fileStats?: {
    totalLines: number;
    nonEmptyLines: number;
    contentLines: number;
    tablesFound: number;
    sectionsFound: number;
  };
}