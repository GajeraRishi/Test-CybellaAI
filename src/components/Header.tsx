import React from 'react';
import { Moon, Sun, LogIn, MessageSquare } from 'lucide-react';
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
    setIsLoggedIn(!isLoggedIn);
    if (onLoginClick) onLoginClick();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 bg-background/80 backdrop-blur-lg border-b border-border/40">
      <div className="container flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src={`${import.meta.env.BASE_URL}image/logo.png`} 
              alt="Cybella Logo" 
              className="h-8 w-auto" 
            />
            <span className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Cybella
            </span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/about" className="text-foreground/80 hover:text-foreground">
            <Button variant="ghost" size="sm">About</Button>
          </Link>
          
          <Link to="/chat" className="text-foreground/80 hover:text-foreground">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <MessageSquare size={18} />
              <span>Chat</span>
            </Button>
          </Link>
          
          <Button variant="outline" size="sm" onClick={handleLoginClick} className="flex items-center gap-1">
            <LogIn size={18} />
            <span>{isLoggedIn ? "Sign Out" : "Sign In"}</span>
          </Button>
          
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-foreground/80">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;