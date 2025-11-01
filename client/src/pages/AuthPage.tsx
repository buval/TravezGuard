import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plane, MapPin, Calendar, DollarSign } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = insertUserSchema.extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("login");

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      email: undefined,
      firstName: undefined,
      lastName: undefined,
    },
  });

  // Redirect if already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  const onLogin = async (data: z.infer<typeof loginSchema>) => {
    await loginMutation.mutateAsync(data);
    setLocation("/");
  };

  const onRegister = async (data: z.infer<typeof registerSchema>) => {
    await registerMutation.mutateAsync(data);
    setLocation("/");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Forms */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Plane className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">Travez</h1>
            </div>
            <p className="text-muted-foreground">
              Plan your perfect trip
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>
                    Login to continue planning your adventures
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your username"
                                data-testid="input-login-username"
                                autoComplete="username"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                placeholder="Enter your password"
                                data-testid="input-login-password"
                                autoComplete="current-password"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loginMutation.isPending}
                        data-testid="button-login-submit"
                      >
                        {loginMutation.isPending ? "Logging in..." : "Login"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>
                    Join Travez and start planning your trips
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username *</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Choose a username"
                                data-testid="input-register-username"
                                autoComplete="username"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password *</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                placeholder="Choose a password (min 6 characters)"
                                data-testid="input-register-password"
                                autoComplete="new-password"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email (optional)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="your.email@example.com"
                                data-testid="input-register-email"
                                autoComplete="email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={registerForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="John"
                                  data-testid="input-register-firstname"
                                  autoComplete="given-name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Doe"
                                  data-testid="input-register-lastname"
                                  autoComplete="family-name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={registerMutation.isPending}
                        data-testid="button-register-submit"
                      >
                        {registerMutation.isPending ? "Creating account..." : "Create Account"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right side - Hero section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-blue-600 text-white p-12 flex-col justify-center">
        <div className="max-w-lg">
          <h2 className="text-4xl font-bold mb-6">
            Your Journey Starts Here
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Travez helps you plan unforgettable trips with ease. Discover destinations, build itineraries, track expenses, and check visa requirements all in one place.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Discover Destinations</h3>
                <p className="opacity-80">Explore amazing travel destinations around the world</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Build Itineraries</h3>
                <p className="opacity-80">Create detailed day-by-day plans for your trips</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign className="w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Track Expenses</h3>
                <p className="opacity-80">Stay on budget with our expense tracking tools</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
