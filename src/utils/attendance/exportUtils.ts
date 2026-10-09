
// Export functions for report data
type CsvValue = string | number | boolean | null | undefined;
type CsvRow = Record<string, CsvValue>;
type NavigatorWithMsSaveBlob = Navigator & { msSaveBlob?: (blob: Blob, filename?: string) => boolean };

export const exportToCsv = (data: CsvRow[], filename: string) => {
  if (!data || !data.length) {
    console.error('No data to export');
    return;
  }
  
  // Extract headers from first row
  const headers = Object.keys(data[0]);
  
  // Convert data to CSV rows
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const cell = row[header] === null || row[header] === undefined ? '' : String(row[header]);
        // Handle strings with commas by quoting them
        return typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell;
      }).join(',')
    )
  ];
  
  // Combine all rows with newlines
  const csvContent = csvRows.join('\n');
  
  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // Fix for TypeScript error - check for msSaveBlob in a type-safe way
  if (navigator.userAgent.includes('MSIE') || navigator.userAgent.includes('Trident/')) {
    // For IE browsers - use any type assertion for msSaveBlob
    (navigator as NavigatorWithMsSaveBlob).msSaveBlob?.(blob, filename);
  } else {
    // For other browsers
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
