
import React from 'react';
import { Moon, Sun, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onLoginClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleLoginClick = () => {
    // In a real application, this would open a login modal or redirect to a login page
    // For now, we'll just toggle the login state for demonstration
    setIsLoggedIn(!isLoggedIn);
    if (onLoginClick) onLoginClick();
  };

  return (
    <header className="px-4 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/b3baaed6-ee0e-483f-99a5-d03794167be1.png" 
              alt="Cybella Logo" 
              className="h-12 w-auto" 
            />
          </div>
          <h1 className="text-xl font-semibold text-primary">Cybella</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={handleLoginClick} className="flex items-center gap-1">
            <LogIn size={18} />
            <span>{isLoggedIn ? "Sign Out" : "Sign In"}</span>
          </Button>
          
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
