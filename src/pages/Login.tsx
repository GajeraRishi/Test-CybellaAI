import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

// Define form validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  
  // If user is already authenticated, redirect to home page
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  
  // Initialize form with validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    toast.loading("Logging in...");
    
    try {
      const success = await login(values.email, values.password);
      
      if (success) {
        toast.dismiss();
        toast.success("Login successful!");
        navigate("/");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1E90FF] to-[#87CEEB]">
      <Header />
      
      <main className="flex-1 container py-16 px-4 mt-16">
        <div className="max-w-md mx-auto bg-white/20 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/30">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-white/80">Sign in to continue to Cybella</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your email" 
                        className="bg-white/30 text-white placeholder:text-white/60 border-white/30"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your password" 
                        className="bg-white/30 text-white placeholder:text-white/60 border-white/30"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Link to="#" className="text-sm text-white hover:underline">
                  Forgot password?
                </Link>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                variant="therapeutic"
                disabled={form.formState.isSubmitting}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
              
              <div className="text-center mt-6">
                <p className="text-white">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-white font-medium hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
              
              {/* Test account info */}
              <div className="mt-8 p-3 bg-white/10 rounded-lg border border-white/20">
                <p className="text-white text-sm text-center">
                  <span className="font-semibold block mb-2">Test Account:</span>
                  Email: test@example.com<br />
                  Password: password123
                </p>
              </div>
            </form>
          </Form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
