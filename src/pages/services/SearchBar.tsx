
import React from 'react';
import { Search, Grid2X2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder="Search Services"
        className="pl-10 pr-12 h-12 bg-white border border-gray-200 rounded-xl shadow-sm"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Button 
        variant="ghost" 
        size="icon"
        className="absolute right-2 top-2 h-8 w-8 bg-gray-100 hover:bg-gray-200 rounded-lg"
      >
        <Grid2X2 className="h-4 w-4 text-gray-600" />
      </Button>
    </div>
  );
};
