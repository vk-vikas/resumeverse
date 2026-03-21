'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, LayoutDashboard, FileText, Loader2, User } from 'lucide-react';

export function UserMenu() {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Loader2 className="h-4 w-4 animate-spin text-neutral-500" />
      </Button>
    );
  }

  if (!user) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push('/login')}
        className="border-neutral-800 text-neutral-300 hover:text-white"
      >
        Sign In
      </Button>
    );
  }

  const initials = user.email ? user.email.slice(0, 2).toUpperCase() : 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative flex h-8 w-8 rounded-full border border-neutral-800 items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-400">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || 'User avatar'} />
          <AvatarFallback className="bg-neutral-800 text-xs">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-neutral-900 border-neutral-800 text-neutral-200" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-white">
                {user.user_metadata?.full_name || 'Account'}
              </p>
              <p className="text-xs leading-none text-neutral-500">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-neutral-800" />
        <DropdownMenuItem
          onClick={() => router.push('/dashboard')}
          className="hover:bg-neutral-800 hover:text-white cursor-pointer transition-colors"
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push('/upload')}
          className="hover:bg-neutral-800 hover:text-white cursor-pointer transition-colors"
        >
          <FileText className="mr-2 h-4 w-4" />
          <span>New Resume</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-neutral-800" />
        <DropdownMenuItem
          onClick={async () => {
            await signOut();
            router.push('/');
          }}
          className="text-red-400 hover:bg-neutral-800 hover:text-red-300 cursor-pointer transition-colors"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
