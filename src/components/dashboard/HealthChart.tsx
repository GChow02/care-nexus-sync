import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

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

interface HealthChartProps {
  data: HealthData[];
}

const HealthChart = ({ data }: HealthChartProps) => {
  // Transform data for charts
  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    heartRate: item.heartRate,
    weight: item.weight,
    sleep: item.sleep,
    glucose: item.glucose,
    steps: item.steps / 1000, // Convert to thousands for better display
    water: item.water
  }));

  return (
    <div className="space-y-6">
      {/* Heart Rate & Weight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Heart Rate Trend</CardTitle>
            <CardDescription>Daily heart rate measurements (bpm)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="heartRate" 
                  stroke="hsl(var(--medical-blue))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--medical-blue))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weight Progress</CardTitle>
            <CardDescription>Daily weight measurements (kg)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="hsl(var(--medical-green))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--medical-green))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Sleep & Glucose */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sleep Pattern</CardTitle>
            <CardDescription>Daily sleep duration (hours)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sleep" fill="hsl(var(--secondary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blood Glucose</CardTitle>
            <CardDescription>Daily glucose levels (mg/dL)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[80, 120]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="glucose" 
                  stroke="hsl(var(--warning))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--warning))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Steps & Water */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Steps</CardTitle>
            <CardDescription>Steps taken (in thousands)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="steps" fill="hsl(var(--info))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Water Intake</CardTitle>
            <CardDescription>Daily water consumption (liters)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="water" fill="hsl(var(--medical-blue))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthChart;