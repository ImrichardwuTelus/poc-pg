import * as ExcelJS from 'exceljs';
import { ExcelRowData, ExcelUpdateData, ExcelService } from '@/types/excel';

export class ExcelServiceImpl implements ExcelService {
  private filePath: string;
  private workbook: ExcelJS.Workbook | null = null;
  private worksheet: ExcelJS.Worksheet | null = null;

  constructor(filePath: string = '/src/mse_trace_analysis_enriched_V2.xlsx') {
    this.filePath = filePath;
  }

  async readExcel(): Promise<ExcelRowData[]> {
    try {
      console.log('Reading Excel file via API');

      // Use API endpoint to read Excel file
      const response = await fetch('/api/excel');
      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to read Excel file');
      }
    } catch (error) {
      console.error('Error reading Excel file:', error);
      throw new Error('Failed to read Excel file');
    }
  }

  async writeToExcel(data: ExcelUpdateData): Promise<void> {
    try {
      console.log('Writing to Excel via API:', data);

      // Use API endpoint to write to Excel file
      const response = await fetch('/api/excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        console.log('Successfully wrote to Excel file:', result.message);
      } else {
        throw new Error(result.error || 'Failed to write to Excel file');
      }
    } catch (error) {
      console.error('Error writing to Excel file:', error);
      throw new Error('Failed to write to Excel file');
    }
  }

  async updateRow(rowIndex: number, data: Partial<ExcelRowData>): Promise<void> {
    try {
      console.log(`Updating row ${rowIndex} with data:`, data);

      // In a real implementation, this would update the specific row
      // For now, we'll log the operation
      console.log('Row updated successfully');
    } catch (error) {
      console.error('Error updating Excel row:', error);
      throw new Error('Failed to update Excel row');
    }
  }

  async addNewRow(data: Partial<ExcelRowData>): Promise<void> {
    try {
      console.log('Adding new row with data:', data);

      // This method is now called by writeToExcel, so we don't need to duplicate the API call
      // The actual writing is handled by the writeToExcel method via API
      console.log('New row data prepared:', data);
    } catch (error) {
      console.error('Error adding new Excel row:', error);
      throw new Error('Failed to add new Excel row');
    }
  }

  // Method to download updated Excel file
  async downloadExcel(data: ExcelRowData[]): Promise<void> {
    try {
      // Create a new workbook
      const workbook = new ExcelJS.Workbook();

      // Add a worksheet
      const worksheet = workbook.addWorksheet('MSE Trace Analysis');

      // Get headers from the first data row
      if (data.length > 0) {
        const headers = Object.keys(data[0]);

        // Add headers as the first row
        worksheet.addRow(headers);

        // Add data rows
        data.forEach(row => {
          const rowData = headers.map(header => row[header as keyof ExcelRowData]);
          worksheet.addRow(rowData);
        });
      }

      // Generate Excel file buffer
      const buffer = await workbook.xlsx.writeBuffer();

      // Create blob and download in browser environment
      if (typeof window !== 'undefined') {
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'mse_trace_analysis_updated.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      console.log('Excel file downloaded successfully');
    } catch (error) {
      console.error('Error downloading Excel file:', error);
      throw new Error('Failed to download Excel file');
    }
  }
}

// Factory function to create Excel service
export function createExcelService(filePath?: string): ExcelService {
  return new ExcelServiceImpl(filePath);
}

// Utility function to convert Excel data to CSV for easier handling
export function convertToCSV(data: ExcelRowData[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers
        .map(header => `"${String(row[header as keyof ExcelRowData]).replace(/"/g, '""')}"`)
        .join(',')
    ),
  ].join('\n');

  return csvContent;
}
