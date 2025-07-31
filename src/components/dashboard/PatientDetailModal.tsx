import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { 
  User, 
  Heart, 
  Activity, 
  Calendar, 
  Target, 
  MessageSquare,
  Plus,
  CheckCircle
} from "lucide-react";

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

interface PatientDetailModalProps {
  patient: Patient;
  onClose: () => void;
  onAssignTask: (task: string) => void;
  onAddSuggestion: (suggestion: string) => void;
}

const PatientDetailModal = ({ patient, onClose, onAssignTask, onAddSuggestion }: PatientDetailModalProps) => {
  const [newTask, setNewTask] = useState("");
  const [newSuggestion, setNewSuggestion] = useState("");

  // Mock health data for this patient
  const healthData = [
    { date: "Jan 20", heartRate: 72, weight: 68.5, glucose: 95 },
    { date: "Jan 21", heartRate: 75, weight: 68.3, glucose: 92 },
    { date: "Jan 22", heartRate: 73, weight: 68.1, glucose: 98 },
    { date: "Jan 23", heartRate: 71, weight: 67.9, glucose: 94 },
    { date: "Jan 24", heartRate: 74, weight: 67.8, glucose: 96 }
  ];

  const currentTasks = [
    { id: 1, task: "Take morning medication", completed: true, assignedDate: "2024-01-20" },
    { id: 2, task: "Record blood pressure daily", completed: false, assignedDate: "2024-01-21" },
    { id: 3, task: "30 minutes walk daily", completed: false, assignedDate: "2024-01-22" }
  ];

  const suggestions = [
    { id: 1, text: "Your sleep pattern has improved this week. Keep maintaining a regular bedtime!", date: "2024-01-20" },
    { id: 2, text: "Consider increasing daily water intake to reach 2.5L target.", date: "2024-01-21" }
  ];

  const handleAssignTask = () => {
    if (newTask.trim()) {
      onAssignTask(newTask.trim());
      setNewTask("");
    }
  };

  const handleAddSuggestion = () => {
    if (newSuggestion.trim()) {
      onAddSuggestion(newSuggestion.trim());
      setNewSuggestion("");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-600";
      case "critical": return "text-red-600";
      case "inactive": return "text-gray-600";
      default: return "text-gray-600";
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-medical-blue to-primary rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">{patient.fullName.charAt(0)}</span>
            </div>
            <div>
              <span className="text-xl">{patient.fullName}</span>
              <Badge className={`ml-2 ${getStatusColor(patient.status)}`} variant="outline">
                {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription>
            Comprehensive patient health overview and management
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="health-data">Health Data</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Patient Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Patient Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Email:</span>
                      <p>{patient.email}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Date of Birth:</span>
                      <p>{patient.dateOfBirth || "Not provided"}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Blood Group:</span>
                      <p>{patient.bloodGroup || "Not provided"}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Gender:</span>
                      <p>{patient.gender || "Not provided"}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Last Update:</span>
                      <p>{patient.lastUpdate}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Status:</span>
                      <p className={getStatusColor(patient.status)}>
                        {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Latest Health Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span>Latest Health Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Heart Rate:</span>
                      <span className="font-medium">74 bpm</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Weight:</span>
                      <span className="font-medium">67.8 kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Blood Glucose:</span>
                      <span className="font-medium">96 mg/dL</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Blood Pressure:</span>
                      <span className="font-medium">120/80 mmHg</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="health-data" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Heart Rate Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Heart Rate Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={healthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="heartRate" stroke="hsl(var(--medical-blue))" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Weight Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Weight Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={healthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="weight" stroke="hsl(var(--medical-green))" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            {/* Assign New Task */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Assign New Task</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter task description..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAssignTask()}
                    className="flex-1"
                  />
                  <Button onClick={handleAssignTask}>
                    <Target className="mr-2 h-4 w-4" />
                    Assign
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Current Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Current Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className={`h-5 w-5 ${task.completed ? "text-green-500" : "text-gray-300"}`} />
                        <div>
                          <p className={task.completed ? "line-through text-muted-foreground" : ""}>
                            {task.task}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Assigned: {task.assignedDate}
                          </p>
                        </div>
                      </div>
                      <Badge variant={task.completed ? "secondary" : "outline"}>
                        {task.completed ? "Completed" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-4">
            {/* Add New Suggestion */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Add New Suggestion</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Textarea
                    placeholder="Enter your suggestion or advice for the patient..."
                    value={newSuggestion}
                    onChange={(e) => setNewSuggestion(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={handleAddSuggestion}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Suggestion
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Previous Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle>Previous Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="p-3 bg-medical-light border-l-4 border-medical-green rounded">
                      <p className="text-sm">{suggestion.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {suggestion.date}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>Export Report</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDetailModal;