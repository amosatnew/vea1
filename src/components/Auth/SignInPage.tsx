import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Music, Facebook, Github, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const SignInPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // In a real app, this would be an API call to authenticate the user
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, allow any login with a valid email format
      if (email.includes("@") && password.length >= 6) {
        // Store user info in local storage for demo purposes
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("userEmail", email);

        // Redirect to profile page
        navigate("/profile");
      } else {
        setError("Invalid email or password. Password must be at least 6 characters.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 min-h-[calc(100vh-200px)] flex items-center justify-center">
      <Card className="max-w-md w-full bg-card/60 backdrop-blur-sm border-primary/10">
        <CardHeader className="space-y-3 flex flex-col items-center">
          <div className="bg-primary p-3 rounded-xl">
            <Music size={24} className="text-background" />
          </div>
          <CardTitle className="text-2xl">Sign in to DarkEvents</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 rounded-md bg-destructive/20 border border-destructive/30 text-destructive-foreground text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-muted/60"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-muted/60"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" className="bg-muted/40" onClick={() => setError("Social sign-in is not implemented in this demo")}>
              <Facebook size={18} />
            </Button>
            <Button variant="outline" className="bg-muted/40" onClick={() => setError("Social sign-in is not implemented in this demo")}>
              <Github size={18} />
            </Button>
            <Button variant="outline" className="bg-muted/40" onClick={() => setError("Social sign-in is not implemented in this demo")}>
              <Mail size={18} />
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/join" className="text-primary hover:underline">
              Join Now
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignInPage;
