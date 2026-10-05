
import { useToast } from '@/hooks/use-toast';

// Helper function to safely convert user ID to string
export const getUserIdAsString = (userId?: string | number) => {
  if (!userId) return null;
  
  // If it's already a string and looks like a UUID, return it
  if (typeof userId === 'string' && userId.length > 10) {
    return userId;
  }
  
  // If it's a number or string that looks like a number, don't convert it to UUID
  // This prevents the "invalid input syntax for type uuid: '1'" error
  if (typeof userId === 'number' || (typeof userId === 'string' && /^\d+$/.test(userId))) {
    console.warn('User ID appears to be a number, not a UUID. This may cause database errors.');
    return null;
  }
  
  return String(userId);
};

// Enhanced error handling function
export const createErrorHandler = (toast: ReturnType<typeof useToast>['toast']) => {
  return (error: any, operation: string) => {
    console.error(`Error during ${operation}:`, error);
    
    let errorMessage = `Failed to ${operation}`;
    
    if (error?.code === '23505') {
      errorMessage = 'Setting already exists and cannot be duplicated';
    } else if (error?.code === '42501') {
      errorMessage = 'Permission denied: You do not have access to modify settings';
    } else if (error?.code === 'PGRST301') {
      errorMessage = 'Database connection error';
    } else if (error?.message?.includes('uuid')) {
      errorMessage = 'Invalid user ID format. Please ensure you are properly authenticated.';
    } else if (error?.message?.includes('infinite recursion')) {
      errorMessage = 'Database policy error. Please contact support.';
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
    
    return error;
  };
};
