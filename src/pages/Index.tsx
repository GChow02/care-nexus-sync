import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm, { RegisterData } from "@/components/auth/RegisterForm";
import PatientDashboard from "@/components/dashboard/PatientDashboard";
import DoctorDashboard from "@/components/dashboard/DoctorDashboard";

interface User {
  _id: string;
  fullName: string;
  email: string;
  doctorName: string;
  userType: "patient" | "doctor";
  dateOfBirth?: string;
  bloodGroup?: string;
  gender?: string;
  allergies?: string[];
  medicalHistory?: string;
  conditions?: string[];
  status: "active" | "inactive" | "critical";
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock users for demo - in real app, this would be API calls
  const mockUsers: User[] = [
    {
      _id: "1",
      fullName: "John Smith",
      email: "john@example.com",
      doctorName: "Dr. Wilson",
      userType: "patient",
      dateOfBirth: "1985-06-15",
      bloodGroup: "A+",
      gender: "Male",
      status: "active"
    },
    {
      _id: "2",
      fullName: "Dr. Sarah Wilson",
      email: "doctor@example.com",
      doctorName: "Self",
      userType: "doctor",
      status: "active"
    }
  ];

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentUser(data.user);
        toast({
          title: "Welcome back!",
          description: `Successfully logged in as ${data.user.fullName}`,
        });
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Could not connect to server. Make sure backend is running on port 5000.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setCurrentUser(result.user);
        toast({
          title: "Account Created",
          description: `Welcome to VitalSync, ${result.user.fullName}!`,
        });
      } else {
        toast({
          title: "Registration Failed",
          description: result.message || "Could not create account",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Could not connect to server. Make sure backend is running on port 5000.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    toast({
      title: "Logged Out",
      description: "See you next time!",
    });
  };

  // Show dashboard if user is logged in
  if (currentUser) {
    if (currentUser.userType === "doctor") {
      return <DoctorDashboard doctor={currentUser as any} onLogout={handleLogout} />;
    } else {
      return <PatientDashboard patient={currentUser as any} onLogout={handleLogout} />;
    }
  }

  // Show authentication forms
  return (
    <AuthLayout
      title={isLogin ? "Welcome Back" : "Create Account"}
      description={isLogin ? "Sign in to access your health dashboard" : "Join VitalSync to start tracking your health"}
    >
      {isLogin ? (
        <LoginForm
          onLogin={handleLogin}
          onSwitchToRegister={() => setIsLogin(false)}
          isLoading={isLoading}
        />
      ) : (
        <RegisterForm
          onRegister={handleRegister}
          onSwitchToLogin={() => setIsLogin(true)}
          isLoading={isLoading}
        />
      )}
      
      {/* Demo Credentials */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h4 className="text-sm font-semibold mb-2">Demo Credentials</h4>
        <div className="text-xs space-y-1 text-muted-foreground">
          <p><strong>Patient:</strong> john@example.com</p>
          <p><strong>Doctor:</strong> doctor@example.com</p>
          <p><em>Use any password</em></p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Index;
