
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, BriefcaseIcon, User, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { user, signOut, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? "bg-white/80 backdrop-blur-md py-3 shadow-sm border-b border-gray-100"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-medium tracking-tight text-primary transition-opacity duration-300 hover:opacity-80 flex items-center gap-2"
        >
          <BriefcaseIcon size={24} className="text-primary" />
          <span>ConnectLeads</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex items-center space-x-6">
            <Link
              to="/jobs"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200"
            >
              Browse Jobs
            </Link>
            <Link
              to="/premium"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200"
            >
              Premium
            </Link>
            <Link
              to="/how-it-works"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200"
            >
              How It Works
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200 flex items-center"
              >
                <Shield size={16} className="mr-1 text-primary" />
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="rounded-full px-4">
              <Search size={16} className="mr-2" />
              Search
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" size="sm" className="rounded-full px-4">
                    <User size={16} className="mr-2" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/profile" className="flex w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/saved-jobs" className="flex w-full">Saved Jobs</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link to="/admin" className="flex w-full items-center">
                          <Shield size={16} className="mr-2 text-primary" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                className="rounded-full px-4"
                onClick={() => location.pathname !== '/auth' && window.location.assign('/auth')}
              >
                <User size={16} className="mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>

        <button className="md:hidden p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
