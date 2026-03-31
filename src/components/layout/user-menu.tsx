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
        <Loader2 className="h-4 w-4 animate-spin text-[#9C9590]" />
      </Button>
    );
  }

  if (!user) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push('/login')}
        className="border-[#E8E5DF] text-[#6B6560] hover:text-[#1A1A1A] hover:bg-[#F5F3EF]"
      >
        Sign In
      </Button>
    );
  }

  const initials = user.email ? user.email.slice(0, 2).toUpperCase() : 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative flex h-8 w-8 rounded-full border border-[#E8E5DF] items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#5B4FC4]">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || 'User avatar'} />
          <AvatarFallback className="bg-[#F0EDFA] text-[#5B4FC4] text-xs">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border-[#E8E5DF] text-[#1A1A1A]" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-[#1A1A1A]">
                {user.user_metadata?.full_name || 'Account'}
              </p>
              <p className="text-xs leading-none text-[#9C9590]">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-[#E8E5DF]" />
        <DropdownMenuItem
          onClick={() => router.push('/dashboard')}
          className="hover:bg-[#F5F3EF] cursor-pointer transition-colors"
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push('/upload')}
          className="hover:bg-[#F5F3EF] cursor-pointer transition-colors"
        >
          <FileText className="mr-2 h-4 w-4" />
          <span>New Resume</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#E8E5DF]" />
        <DropdownMenuItem
          onClick={async () => {
            await signOut();
            router.push('/');
          }}
          className="text-[#D84040] hover:bg-[#FDF0F0] hover:text-[#D84040] cursor-pointer transition-colors"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
