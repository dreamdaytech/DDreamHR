import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer, FileText } from 'lucide-react';
import { exportToCsv } from '@/utils/attendance';
import { useToast } from '@/hooks/use-toast';

interface ReportExportOptionsProps {
  reportTitle: string;
  data: object[];
  onPrint?: () => void;
}

export const ReportExportOptions: React.FC<ReportExportOptionsProps> = ({
  reportTitle,
  data,
  onPrint
}) => {
  const { toast } = useToast();

  const handleExportCSV = () => {
    try {
      const filename = `${reportTitle.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
      exportToCsv(data, filename);
      
      toast({
        title: "Export successful",
        description: `${reportTitle} has been exported as CSV`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting the report.",
        variant: "destructive"
      });
      console.error('Export error:', error);
    }
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="flex gap-2 print:hidden">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
        onClick={handleExportCSV}
        disabled={!data.length}
      >
        <Download className="w-4 h-4" />
        <span>CSV</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
        onClick={handlePrint}
        disabled={!data.length}
      >
        <Printer className="w-4 h-4" />
        <span>Print</span>
      </Button>

      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
        onClick={() => toast({
          title: "PDF Export",
          description: "PDF export functionality coming soon.",
        })}
        disabled={!data.length}
      >
        <FileText className="w-4 h-4" />
        <span>PDF</span>
      </Button>
    </div>
  );
};
