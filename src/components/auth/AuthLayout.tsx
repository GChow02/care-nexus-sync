import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import medicalHero from "@/assets/medical-hero.jpg";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

const AuthLayout = ({ children, title, description }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-medical-light flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Image */}
        <div className="hidden md:block">
          <img 
            src={medicalHero} 
            alt="VitalSync Health Tracking"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        
        {/* Right side - Auth Form */}
        <Card className="w-full max-w-md mx-auto shadow-xl border-0">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-medical-blue to-primary rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">{title}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;