export interface ExcelRowData {
  'Technical Service ( as in PD)': string;
  'Team Name (as in PD)': string;
  'Api Name': string;
  'Service Path': string;
  'CMDB ID': string;
  'tech-svc': string;
  'team name': string;
  'Prime Manager': string;
  'Prime Director': string;
  'Prime VP': string;
  MSE: string;
  Next_Hop_Service_ID: string;
  Next_Hop_Process_Group: string;
  Next_Hop_Endpoint: string;
  Analysis_Status: string;
  Analysis_Timestamp: string;
  Next_Hop_Service_Code: string;
  Enrichment_Status: string;
  team_name: string;
}

export interface ExcelUpdateData {
  serviceName?: string;
  exists: boolean;
  teamName?: string;
  serviceId?: string;
  timestamp?: string;
}

export interface ExcelService {
  readExcel(): Promise<ExcelRowData[]>;
  writeToExcel(data: ExcelUpdateData): Promise<void>;
  updateRow(rowIndex: number, data: Partial<ExcelRowData>): Promise<void>;
  addNewRow(data: Partial<ExcelRowData>): Promise<void>;
  downloadExcel(data: ExcelRowData[]): Promise<void>;
}
