import { NextRequest, NextResponse } from 'next/server';
import * as ExcelJS from 'exceljs';
import { ExcelRowData, ExcelUpdateData } from '@/types/excel';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src', 'mse_trace_analysis_enriched_V2.xlsx');
    console.log('Reading Excel file from:', filePath);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet(1);
    const data: ExcelRowData[] = [];

    if (worksheet) {
      const headers: string[] = [];

      // Get headers from the first row
      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell, colNumber) => {
        headers[colNumber - 1] = cell.text;
      });

      // Process data rows
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          const rowData: Record<string, string> = {};
          row.eachCell((cell, colNumber) => {
            const header = headers[colNumber - 1];
            if (header) {
              rowData[header] = cell.text || '';
            }
          });
          data.push(rowData as unknown as ExcelRowData);
        }
      });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error reading Excel file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to read Excel file' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ExcelUpdateData = await request.json();
    console.log('Adding new row to Excel:', body);

    const filePath = path.join(process.cwd(), 'src', 'mse_trace_analysis_enriched_V2.xlsx');
    console.log('Writing to Excel file:', filePath);

    const workbook = new ExcelJS.Workbook();

    // Try to read existing file
    try {
      await workbook.xlsx.readFile(filePath);
    } catch (readError) {
      console.warn('Could not read existing file, creating new one:', readError);
      // Create a new worksheet if file doesn't exist
      const worksheet = workbook.addWorksheet('MSE Trace Analysis');
      // Add headers
      const headers = [
        '',
        'Technical Service ( as in PD)',
        'Team Name (as in PD)',
        'Api Name',
        'Service Path',
        'CMDB ID',
        'tech-svc',
        'team name',
        'Prime Manager',
        'Prime Director',
        'Prime VP',
        'MSE',
        'Next_Hop_Service_ID',
        'Next_Hop_Process_Group',
        'Next_Hop_Endpoint',
        'Analysis_Status',
        'Analysis_Timestamp',
        'Next_Hop_Service_Code',
        'Enrichment_Status',
        'team_name',
      ];
      worksheet.addRow(headers);
    }

    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      throw new Error('No worksheet found');
    }

    // Create new row data - only populate Api Name column
    const newRowData = [
      '',
      '', // Technical Service (as in PD)
      '', // Team Name (as in PD)
      body.serviceName || '', // Api Name - ONLY THIS COLUMN
      '', // Service Path
      '', // CMDB ID
      '', // tech-svc
      '', // team name
      '', // Prime Manager
      '', // Prime Director
      '', // Prime VP
      '', // MSE
      '', // Next_Hop_Service_ID
      '', // Next_Hop_Process_Group
      '', // Next_Hop_Endpoint
      '', // Analysis_Status
      '', // Analysis_Timestamp
      '', // Next_Hop_Service_Code
      '', // Enrichment_Status
      '', // team_name
    ];

    // Add the new row
    worksheet.addRow(newRowData);

    // Save the file
    await workbook.xlsx.writeFile(filePath);

    console.log('Successfully added new row to Excel file');

    return NextResponse.json({
      success: true,
      message: 'Row added successfully',
      data: {
        serviceName: body.serviceName,
        exists: body.exists,
        timestamp: body.timestamp,
      },
    });
  } catch (error) {
    console.error('Error writing to Excel file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to write to Excel file' },
      { status: 500 }
    );
  }
}
