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
    
    // Simulate API call
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === email);
      
      if (user) {
        setCurrentUser(user);
        toast({
          title: "Welcome back!",
          description: `Successfully logged in as ${user.fullName}`,
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Try john@example.com or doctor@example.com",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleRegister = async (data: RegisterData) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newUser: User = {
        _id: Date.now().toString(),
        fullName: data.fullName,
        email: data.email,
        doctorName: data.doctorName,
        userType: data.userType,
        status: "active"
      };
      
      setCurrentUser(newUser);
      toast({
        title: "Account Created",
        description: `Welcome to VitalSync, ${newUser.fullName}!`,
      });
      setIsLoading(false);
    }, 1000);
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
