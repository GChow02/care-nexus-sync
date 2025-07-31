import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Activity, 
  AlertTriangle, 
  TrendingUp,
  Search,
  User,
  Download,
  MessageSquare,
  Target,
  Plus,
  Eye
} from "lucide-react";
import PatientDetailModal from "./PatientDetailModal";

interface Patient {
  _id: string;
  fullName: string;
  email: string;
  doctorName: string;
  userType: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  gender?: string;
  lastUpdate?: string;
  status: "active" | "inactive" | "critical";
}

interface DoctorDashboardProps {
  doctor: Patient;
  onLogout: () => void;
}

const DoctorDashboard = ({ doctor, onLogout }: DoctorDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Mock patients data - in real app, this would come from API
  const [patients] = useState<Patient[]>([
    {
      _id: "1",
      fullName: "John Smith",
      email: "john@example.com",
      doctorName: doctor.fullName,
      userType: "patient",
      dateOfBirth: "1985-06-15",
      bloodGroup: "A+",
      gender: "Male",
      lastUpdate: "2024-01-22",
      status: "active"
    },
    {
      _id: "2",
      fullName: "Sarah Johnson",
      email: "sarah@example.com",
      doctorName: doctor.fullName,
      userType: "patient",
      dateOfBirth: "1992-03-20",
      bloodGroup: "O-",
      gender: "Female",
      lastUpdate: "2024-01-21",
      status: "critical"
    },
    {
      _id: "3",
      fullName: "Michael Brown",
      email: "michael@example.com",
      doctorName: doctor.fullName,
      userType: "patient",
      dateOfBirth: "1978-11-10",
      bloodGroup: "B+",
      gender: "Male",
      lastUpdate: "2024-01-20",
      status: "inactive"
    }
  ]);

  const filteredPatients = patients.filter(patient =>
    patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dashboardStats = [
    {
      title: "Total Patients",
      value: patients.length,
      icon: Users,
      color: "text-blue-500",
      change: "+2 this week"
    },
    {
      title: "Active Patients",
      value: patients.filter(p => p.status === "active").length,
      icon: Activity,
      color: "text-green-500",
      change: "85% active"
    },
    {
      title: "Critical Alerts",
      value: patients.filter(p => p.status === "critical").length,
      icon: AlertTriangle,
      color: "text-red-500",
      change: "Requires attention"
    },
    {
      title: "Avg. Improvement",
      value: "12%",
      icon: TrendingUp,
      color: "text-medical-blue",
      change: "This month"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "secondary",
      inactive: "outline", 
      critical: "destructive"
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-medical-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-medical-blue to-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <h1 className="text-xl font-semibold text-foreground">VitalSync - Doctor Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>Dr. {doctor.fullName}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome, Dr. {doctor.fullName}
          </h2>
          <p className="text-muted-foreground">
            Monitor and manage your patients' health data
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="patients">All Patients</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="admin">Admin Panel</TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Patient Management</span>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Export Data
                    </Button>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Patient
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patients by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Patients List */}
                <div className="space-y-4">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient._id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-medical-blue to-primary rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {patient.fullName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{patient.fullName}</h3>
                          <p className="text-sm text-muted-foreground">{patient.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              Last update: {patient.lastUpdate}
                            </span>
                            {getStatusBadge(patient.status)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedPatient(patient)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Message
                        </Button>
                        <Button size="sm" variant="outline">
                          <Target className="mr-2 h-4 w-4" />
                          Assign Task
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Patient Analytics</CardTitle>
                <CardDescription>
                  View comprehensive analytics and trends across all patients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Admin Management</CardTitle>
                <CardDescription>
                  Manage system administrators and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Admin
                  </Button>
                  <div className="text-center py-8">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Admin management coming soon...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onAssignTask={(task) => {
            // Handle task assignment
            console.log("Assigning task:", task);
          }}
          onAddSuggestion={(suggestion) => {
            // Handle suggestion
            console.log("Adding suggestion:", suggestion);
          }}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;