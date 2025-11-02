import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MobileNav } from "@/components/MobileNav";
import { Mail, LogOut } from "lucide-react";
import { Link } from "wouter";
import logoUrl from "@assets/logo_1761679001485.png";

export default function Profile() {
  const { user, isAuthenticated, logoutMutation } = useAuth();

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const getFullName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) return user.firstName;
    if (user?.lastName) return user.lastName;
    return "Traveler";
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-4 text-center">
          <h2 className="text-2xl font-bold mb-3">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your profile
          </p>
          <Link href="/auth">
            <Button
              size="lg"
              className="rounded-full w-full"
              data-testid="button-signin"
            >
              Sign In
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-4xl">
          <div className="w-24"></div>
          <img src={logoUrl} alt="Travez" className="h-8" data-testid="img-logo" />
          <div className="w-24"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Card */}
        <Card className="p-8 mb-6">
          <div className="flex flex-col items-center text-center mb-6">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={user?.profileImageUrl || undefined} className="object-cover" />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {getInitials(user?.firstName || user?.email)}
              </AvatarFallback>
            </Avatar>
            
            <h2 className="text-2xl font-bold mb-1" data-testid="text-user-name">
              {getFullName()}
            </h2>
            
            {user?.username && (
              <p className="text-sm text-muted-foreground mb-2" data-testid="text-username">
                @{user.username}
              </p>
            )}
            
            {user?.email && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span data-testid="text-user-email">{user.email}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Account Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Account</h3>
          
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 rounded-full"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" />
              {logoutMutation.isPending ? "Signing Out..." : "Sign Out"}
            </Button>
          </div>
        </Card>

        {/* About Section */}
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold mb-2">About Travez</h3>
          <p className="text-sm text-muted-foreground">
            Plan your dream journey with detailed itineraries, discover amazing destinations, 
            and make unforgettable memories. Version 1.0.0
          </p>
        </Card>
      </main>

      <MobileNav />
    </div>
  );
}
