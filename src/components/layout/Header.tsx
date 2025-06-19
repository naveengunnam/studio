"use client";

import Link from 'next/link';
import { ShoppingCart, Sparkles, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from 'react';

export default function Header() {
  const { getCartItemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItemCount = getCartItemCount();

  const navLinks = [
    { href: '/', label: 'Products' },
    { href: '/style-assistant', label: 'Style Assistant', icon: <Sparkles className="mr-2 h-4 w-4" /> },
  ];

  const NavMenu = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className={`flex items-center gap-4 ${mobile ? 'flex-col space-y-4 py-4' : 'hidden md:flex'}`}>
      {navLinks.map((link) => (
        <Button key={link.href} variant="ghost" asChild className={mobile ? 'w-full justify-start' : ''}>
          <Link href={link.href} onClick={() => mobile && setIsMobileMenuOpen(false)}>
            {link.icon}
            {link.label}
          </Link>
        </Button>
      ))}
       <Button variant="ghost" asChild className={mobile ? 'w-full justify-start' : ''}>
        <Link href="/cart" aria-label="Shopping Cart" onClick={() => mobile && setIsMobileMenuOpen(false)}>
          <ShoppingCart className="h-5 w-5" />
          <span className="ml-2">Cart</span>
          {cartItemCount > 0 && (
            <span className="ml-1.5 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
              {cartItemCount}
            </span>
          )}
        </Link>
      </Button>
    </nav>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-primary">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.58 9.93l-4.88 4.88c-.63.63-1.71.18-1.71-.71V14H8c-.55 0-1-.45-1-1s.45-1 1-1h4v-2.12c0-.89 1.08-1.34 1.71-.71l4.88 4.88c.39.39.39 1.02-.01 1.41z"/>
          </svg>
          <span className="ml-2 text-2xl font-bold font-headline text-primary">ShopWave</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <NavMenu />
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="p-4">
                  <Link href="/" className="flex items-center mb-6" onClick={() => setIsMobileMenuOpen(false)}>
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-primary">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.58 9.93l-4.88 4.88c-.63.63-1.71.18-1.71-.71V14H8c-.55 0-1-.45-1-1s.45-1 1-1h4v-2.12c0-.89 1.08-1.34 1.71-.71l4.88 4.88c.39.39.39 1.02-.01 1.41z"/>
                      </svg>
                    <span className="ml-2 text-xl font-bold font-headline text-primary">ShopWave</span>
                  </Link>
                  <NavMenu mobile={true} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
