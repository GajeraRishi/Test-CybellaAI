import React from 'react';
import { Moon, Sun, LogIn, Menu, X, MessageSquare, Activity, Heart, BookOpen, User, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Toggle } from '@/components/ui/toggle';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onLoginClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [isOpen, setIsOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleLoginClick = () => {
    if (isAuthenticated) {
      logout();
    } else {
      navigate('/login');
    }
    
    if (onLoginClick) onLoginClick();
  };

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: MessageSquare, label: 'Chat', path: '/chat' },
    { icon: Activity, label: 'About', path: '/about' },
  ];

  // Updated lighter blue color for header matching the image
  const headerBgClass = "fixed top-0 left-0 right-0 z-50 px-2 md:px-4 py-2 md:py-3 bg-[#6cb4ee]/95 backdrop-blur-lg border-b border-border/40";

  return (
    <header className={headerBgClass}>
      <div className="container flex items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-white/90 flex items-center justify-center">
              <span className="text-base md:text-lg font-bold text-primary">R</span>
            </div>
            {!isMobile && (
              <span className="text-xl font-semibold text-white">
                Cybella
              </span>
            )}
          </Link>
        </div>
        
        {isMobile ? (
          <div className="flex items-center gap-1 md:gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-white h-7 w-7">
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white h-7 w-7 p-0">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] p-4 bg-[#6cb4ee]/95 text-white backdrop-blur-lg">
                <div className="flex flex-col gap-4 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-white/90 flex items-center justify-center">
                        <span className="text-base font-bold text-primary">R</span>
                      </div>
                      <span className="text-lg font-semibold text-white">Cybella</span>
                    </div>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-white h-7 w-7 p-0">
                        <X size={18} />
                      </Button>
                    </SheetTrigger>
                  </div>
                  
                  {isAuthenticated && user && (
                    <div className="py-2 px-3 bg-white/20 rounded-lg">
                      <p className="text-sm font-medium">Welcome, {user.name || user.email}</p>
                    </div>
                  )}
                  
                  <div className="flex flex-col space-y-1">
                    {navItems.map((item) => (
                      <Link 
                        key={item.label} 
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/20 transition-colors"
                      >
                        <item.icon size={18} />
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                  
                  <div className="mt-auto border-t border-white/20 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={handleLoginClick} 
                      className="w-full bg-white/10 text-white border-white/30 hover:bg-white/20 text-sm py-1 h-8"
                    >
                      {isAuthenticated ? (
                        <>
                          <LogOut size={16} className="mr-2" />
                          Sign Out
                        </>
                      ) : (
                        <>
                          <LogIn size={16} className="mr-2" />
                          Sign In
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <>
            <div className="flex-1 flex items-center justify-center">
              <div className="rounded-full bg-white/20 backdrop-blur-md p-1 flex items-center gap-1">
                {navItems.map((item) => (
                  <Link key={item.label} to={item.path}>
                    <Toggle 
                      className="flex items-center gap-2 px-3 py-2 text-white hover:bg-white/20 rounded-full data-[state=on]:bg-white/30"
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </Toggle>
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated && user && (
                <div className="bg-white/20 px-3 py-1 rounded-full">
                  <span className="text-sm text-white">{user.name || user.email}</span>
                </div>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLoginClick} 
                className="flex items-center gap-1 bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                {isAuthenticated ? (
                  <>
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Sign In</span>
                  </>
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme} 
                className="text-white hover:bg-white/20"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
