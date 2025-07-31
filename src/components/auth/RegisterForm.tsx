import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Mail, Lock, UserCheck } from "lucide-react";

interface RegisterFormProps {
  onRegister: (data: RegisterData) => void;
  onSwitchToLogin: () => void;
  isLoading?: boolean;
}

export interface RegisterData {
  fullName: string;
  email: string;
  doctorName: string;
  password: string;
  userType: "patient" | "doctor";
}

const RegisterForm = ({ onRegister, onSwitchToLogin, isLoading }: RegisterFormProps) => {
  const [formData, setFormData] = useState<RegisterData>({
    fullName: "",
    email: "",
    doctorName: "",
    password: "",
    userType: "patient",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.password || !formData.doctorName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    onRegister(formData);
  };

  const updateFormData = (field: keyof RegisterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) => updateFormData("fullName", e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="doctorName">Doctor's Name</Label>
        <div className="relative">
          <UserCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="doctorName"
            placeholder="Enter your doctor's name"
            value={formData.doctorName}
            onChange={(e) => updateFormData("doctorName", e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="userType">Account Type</Label>
        <Select
          value={formData.userType}
          onValueChange={(value: "patient" | "doctor") => updateFormData("userType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="patient">Patient</SelectItem>
            <SelectItem value="doctor">Doctor</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="Create a password (min. 6 characters)"
            value={formData.password}
            onChange={(e) => updateFormData("password", e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-medical-blue to-primary hover:opacity-90"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>

      <div className="text-center pt-4">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto text-medical-blue"
            onClick={onSwitchToLogin}
          >
            Sign In
          </Button>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;