
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Boxes,
  ArrowRightLeft,
  Truck,
  CreditCard,
  Users,
  Settings,
  BarChart3,
  FileText,
  BookText,
  Receipt,
  CalendarClock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '../icons';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'DASHBOARD', ownerOnly: false },
  { href: '/dashboard/inventory', icon: Boxes, label: 'INVENTORY', ownerOnly: false },
  { href: '/dashboard/transactions', icon: ArrowRightLeft, label: 'TRANSACTIONS', ownerOnly: false },
  { href: '/dashboard/shipping', icon: Truck, label: 'SHIPPING', ownerOnly: false },
  { href: '/dashboard/payment', icon: CreditCard, label: 'PAYMENT METHODS', ownerOnly: false },
  { href: '/dashboard/invoice', icon: FileText, label: 'INVOICE', ownerOnly: false },
  { href: '/dashboard/attendance', icon: CalendarClock, label: 'ATTENDANCE', ownerOnly: false },
  { href: '/dashboard/finance', icon: BarChart3, label: 'FINANCE', ownerOnly: true },
  { href: '/dashboard/personal-expenses', icon: Receipt, label: 'PERSONAL EXPENSES', ownerOnly: true },
  { href: '/dashboard/reports', icon: BookText, label: 'REPORTS', ownerOnly: true },
  { href: '/dashboard/users', icon: Users, label: 'USERS', ownerOnly: true },
];

export default function Sidebar() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // This effect runs only on the client side
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('userRole');
      setUserRole(role);
    }
  }, []);

  // While waiting for the role, we can render the sidebar with non-owner items.
  // This prevents the sidebar from being completely hidden on initial load.
  const filteredNavItems = navItems.filter(item => {
    if (!userRole) {
        // Initially show items accessible to everyone until role is determined
        return !item.ownerOnly;
    }
    return !item.ownerOnly || userRole === 'owner';
  });

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-72 flex-col border-r bg-card sm:flex">
        <nav className="flex flex-col gap-4 px-4 sm:py-5">
            <Link
                href="/dashboard"
                className="group flex h-9 shrink-0 items-center justify-start gap-2 rounded-full px-4 text-lg font-semibold text-primary-foreground md:h-8 md:text-base"
            >
                <Logo />
            </Link>
            {filteredNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                    pathname.startsWith(item.href) && item.href !== '/dashboard' && 'bg-accent text-accent-foreground hover:text-accent-foreground',
                    pathname === '/dashboard' && item.href === '/dashboard' && 'bg-accent text-accent-foreground hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
            ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <Link
                href="/dashboard/settings"
                className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                    pathname === '/dashboard/settings' && 'bg-accent text-accent-foreground hover:text-accent-foreground'
                  )}
            >
                <Settings className="h-4 w-4" />
                <span className="font-medium">SETTINGS</span>
            </Link>
        </nav>
    </aside>
  );
}
