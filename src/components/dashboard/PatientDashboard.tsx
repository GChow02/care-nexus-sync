import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Activity, 
  Weight, 
  Moon, 
  Droplets, 
  User, 
  Calendar,
  Target,
  MessageSquare,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import HealthChart from "./HealthChart";
import ProfileModal from "./ProfileModal";
import HealthDataForm from "./HealthDataForm";

interface HealthData {
  date: string;
  heartRate: number;
  bloodPressure: string;
  weight: number;
  sleep: number;
  glucose: number;
  steps: number;
  water: number;
}

interface Patient {
  _id: string;
  fullName: string;
  email: string;
  doctorName: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  gender?: string;
  allergies?: string[];
  medicalHistory?: string;
  conditions?: string[];
}

interface PatientDashboardProps {
  patient: Patient;
  onLogout: () => void;
}

const PatientDashboard = ({ patient, onLogout }: PatientDashboardProps) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showHealthForm, setShowHealthForm] = useState(false);
  
  // Mock health data - in real app, this would come from API
  const [healthData] = useState<HealthData[]>([
    {
      date: "2024-01-20",
      heartRate: 72,
      bloodPressure: "120/80",
      weight: 68.5,
      sleep: 7.5,
      glucose: 95,
      steps: 8500,
      water: 2.2
    },
    {
      date: "2024-01-21",
      heartRate: 75,
      bloodPressure: "118/78",
      weight: 68.3,
      sleep: 8.0,
      glucose: 92,
      steps: 9200,
      water: 2.5
    },
    {
      date: "2024-01-22",
      heartRate: 73,
      bloodPressure: "122/82",
      weight: 68.1,
      sleep: 6.5,
      glucose: 98,
      steps: 7800,
      water: 2.0
    }
  ]);

  const latestData = healthData[healthData.length - 1];

  const healthMetrics = [
    {
      title: "Heart Rate",
      value: `${latestData.heartRate} bpm`,
      icon: Heart,
      color: "text-red-500",
      trend: "+2%"
    },
    {
      title: "Blood Pressure",
      value: latestData.bloodPressure,
      icon: Activity,
      color: "text-blue-500",
      trend: "-1%"
    },
    {
      title: "Weight",
      value: `${latestData.weight} kg`,
      icon: Weight,
      color: "text-green-500",
      trend: "-0.3%"
    },
    {
      title: "Sleep",
      value: `${latestData.sleep} hrs`,
      icon: Moon,
      color: "text-purple-500",
      trend: "+15%"
    },
    {
      title: "Glucose",
      value: `${latestData.glucose} mg/dL`,
      icon: Droplets,
      color: "text-orange-500",
      trend: "-3%"
    },
    {
      title: "Steps",
      value: latestData.steps.toLocaleString(),
      icon: TrendingUp,
      color: "text-medical-blue",
      trend: "+8%"
    }
  ];

  const tasks = [
    { id: 1, task: "Take morning medication", completed: true },
    { id: 2, task: "Record blood pressure", completed: true },
    { id: 3, task: "30 minutes walk", completed: false },
    { id: 4, task: "Drink 2L water", completed: false }
  ];

  const suggestions = [
    "Your sleep pattern has improved this week. Keep maintaining a regular bedtime!",
    "Consider increasing daily water intake to reach 2.5L target.",
    "Great job on maintaining consistent exercise routine."
  ];

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
              <h1 className="text-xl font-semibold text-foreground">VitalSync</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProfile(true)}
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
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
            Welcome back, {patient.fullName}!
          </h2>
          <p className="text-muted-foreground">
            Here's your health overview for today
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {healthMetrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                    <p className="text-xs text-green-600">{metric.trend}</p>
                  </div>
                  <metric.icon className={`h-8 w-8 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="health-data">Health Data</TabsTrigger>
            <TabsTrigger value="visualization">Charts</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Health Summary */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-medical-blue" />
                    <span>Recent Health Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Daily Goal Progress</span>
                      <span className="text-sm font-medium">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center p-3 bg-medical-light rounded-lg">
                        <p className="text-2xl font-bold text-medical-blue">{latestData.steps}</p>
                        <p className="text-sm text-muted-foreground">Steps Today</p>
                      </div>
                      <div className="text-center p-3 bg-medical-light rounded-lg">
                        <p className="text-2xl font-bold text-medical-green">{latestData.water}L</p>
                        <p className="text-sm text-muted-foreground">Water Intake</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => setShowHealthForm(true)}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Add Health Data
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Target className="mr-2 h-4 w-4" />
                    Set Goals
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message Doctor
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="health-data">
            <Card>
              <CardHeader>
                <CardTitle>Health Data Entry</CardTitle>
                <CardDescription>
                  Record your daily health measurements and vitals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setShowHealthForm(true)}>
                  Add New Health Data
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visualization">
            <HealthChart data={healthData} />
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Daily Tasks</CardTitle>
                <CardDescription>
                  Complete your daily health tasks assigned by your doctor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        className="h-4 w-4"
                        readOnly
                      />
                      <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                        {task.task}
                      </span>
                      <Badge variant={task.completed ? "secondary" : "outline"}>
                        {task.completed ? "Completed" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suggestions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-medical-green" />
                  <span>Doctor's Suggestions</span>
                </CardTitle>
                <CardDescription>
                  Personalized recommendations from your healthcare provider
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="p-4 bg-medical-light border-l-4 border-medical-green rounded">
                      <p className="text-sm">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {showProfile && (
        <ProfileModal
          patient={patient}
          onClose={() => setShowProfile(false)}
          onSave={(updatedPatient) => {
            // Handle profile update
            setShowProfile(false);
          }}
        />
      )}

      {showHealthForm && (
        <HealthDataForm
          onClose={() => setShowHealthForm(false)}
          onSave={(data) => {
            // Handle health data save
            setShowHealthForm(false);
          }}
        />
      )}
    </div>
  );
};

export default PatientDashboard;