import React from 'react';
import { Moon, Sun, LogIn, Menu, X, MessageSquare, Activity, Heart, BookOpen, User, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Toggle } from '@/components/ui/toggle';

interface HeaderProps {
  onLoginClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const isMobile = useIsMobile();
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleLoginClick = () => {
    setIsLoggedIn(!isLoggedIn);
    if (onLoginClick) onLoginClick();
  };

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: MessageSquare, label: 'Chat', path: '/chat' },
    { icon: Activity, label: 'About', path: '/about' },
    // { icon: Heart, label: 'Memory', path: '/' },
    // { icon: BookOpen, label: 'Diary', path: '/' },
    // { icon: User, label: 'Profile', path: '/' },
  ];

  // Updated lighter blue color for header matching the image
  const headerBgClass = "fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-[#6cb4ee]/95 backdrop-blur-lg border-b border-border/40";

  return (
    <header className={headerBgClass}>
      <div className="container flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">C</span>
            </div>
            {!isMobile && (
              <span className="text-xl font-semibold text-white">
                Cybella
              </span>
            )}
          </Link>
        </div>
        
        {isMobile ? (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-white">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white h-8 w-8 p-0">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[260px] bg-[#6cb4ee]/95 text-white backdrop-blur-lg">
                <div className="flex flex-col gap-6 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">C</span>
                      </div>
                      <span className="text-xl font-semibold text-white">Cybella</span>
                    </div>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-white h-8 w-8 p-0">
                        <X size={20} />
                      </Button>
                    </SheetTrigger>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    {navItems.map((item) => (
                      <Link 
                        key={item.label} 
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/20 transition-colors"
                      >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                  
                  <div className="mt-auto border-t border-white/20 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={handleLoginClick} 
                      className="w-full bg-white/10 text-white border-white/30 hover:bg-white/20"
                    >
                      <LogIn size={18} className="mr-2" />
                      {isLoggedIn ? "Sign Out" : "Sign In"}
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
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLoginClick} 
                className="flex items-center gap-1 bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                <LogIn size={18} />
                <span>{isLoggedIn ? "Sign Out" : "Sign In"}</span>
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