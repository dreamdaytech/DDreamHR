import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const getCurrentTheme = (): 'light' | 'dark' => {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};

export const PublicThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(getCurrentTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.style.colorScheme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      className="text-foreground hover:bg-muted"
    >
      {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
};
