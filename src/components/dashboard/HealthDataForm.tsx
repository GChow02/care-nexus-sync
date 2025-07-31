import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Heart, Activity, Weight, Moon, Droplets, TrendingUp } from "lucide-react";

interface HealthData {
  date: string;
  heartRate: number;
  bloodPressure: string;
  weight: number;
  sleep: number;
  glucose: number;
  steps: number;
  water: number;
  notes?: string;
}

interface HealthDataFormProps {
  onClose: () => void;
  onSave: (data: HealthData) => void;
  initialData?: Partial<HealthData>;
}

const HealthDataForm = ({ onClose, onSave, initialData }: HealthDataFormProps) => {
  const [formData, setFormData] = useState<HealthData>({
    date: new Date().toISOString().split('T')[0],
    heartRate: 0,
    bloodPressure: "",
    weight: 0,
    sleep: 0,
    glucose: 0,
    steps: 0,
    water: 0,
    notes: "",
    ...initialData
  });
  const { toast } = useToast();

  const updateFormData = (field: keyof HealthData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date) {
      toast({
        title: "Missing Date",
        description: "Please select a date for this health record",
        variant: "destructive",
      });
      return;
    }

    // Validate required fields
    if (formData.heartRate <= 0 || formData.weight <= 0) {
      toast({
        title: "Invalid Data",
        description: "Please enter valid values for heart rate and weight",
        variant: "destructive",
      });
      return;
    }

    onSave(formData);
    toast({
      title: "Success",
      description: "Health data recorded successfully",
    });
  };

  const healthFields = [
    {
      id: "heartRate",
      label: "Heart Rate",
      value: formData.heartRate,
      type: "number",
      unit: "bpm",
      icon: Heart,
      color: "text-red-500",
      min: 40,
      max: 200
    },
    {
      id: "bloodPressure",
      label: "Blood Pressure",
      value: formData.bloodPressure,
      type: "text",
      unit: "mmHg",
      icon: Activity,
      color: "text-blue-500",
      placeholder: "120/80"
    },
    {
      id: "weight",
      label: "Weight",
      value: formData.weight,
      type: "number",
      unit: "kg",
      icon: Weight,
      color: "text-green-500",
      min: 20,
      max: 300,
      step: 0.1
    },
    {
      id: "sleep",
      label: "Sleep Duration",
      value: formData.sleep,
      type: "number",
      unit: "hours",
      icon: Moon,
      color: "text-purple-500",
      min: 0,
      max: 24,
      step: 0.5
    },
    {
      id: "glucose",
      label: "Blood Glucose",
      value: formData.glucose,
      type: "number",
      unit: "mg/dL",
      icon: Droplets,
      color: "text-orange-500",
      min: 50,
      max: 400
    },
    {
      id: "steps",
      label: "Steps",
      value: formData.steps,
      type: "number",
      unit: "steps",
      icon: TrendingUp,
      color: "text-medical-blue",
      min: 0,
      max: 100000
    }
  ];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Health Data</DialogTitle>
          <DialogDescription>
            Enter your daily health measurements and vitals
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => updateFormData("date", e.target.value)}
              required
            />
          </div>

          {/* Health Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {healthFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="flex items-center space-x-2">
                  <field.icon className={`h-4 w-4 ${field.color}`} />
                  <span>{field.label}</span>
                </Label>
                <div className="relative">
                  <Input
                    id={field.id}
                    type={field.type}
                    value={field.value}
                    onChange={(e) => updateFormData(field.id as keyof HealthData, 
                      field.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value
                    )}
                    placeholder={field.placeholder}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-3 text-sm text-muted-foreground">
                    {field.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Water Intake - Special handling */}
          <div className="space-y-2">
            <Label htmlFor="water" className="flex items-center space-x-2">
              <Droplets className="h-4 w-4 text-blue-400" />
              <span>Water Intake</span>
            </Label>
            <div className="relative">
              <Input
                id="water"
                type="number"
                value={formData.water}
                onChange={(e) => updateFormData("water", parseFloat(e.target.value) || 0)}
                min={0}
                max={10}
                step={0.1}
                className="pr-12"
              />
              <span className="absolute right-3 top-3 text-sm text-muted-foreground">
                liters
              </span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => updateFormData("notes", e.target.value)}
              placeholder="Any additional notes about your health today..."
              className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
            />
          </div>

          {/* Quick Recommendations */}
          <div className="bg-medical-light p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Daily Targets</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-muted-foreground">
              <div>Heart Rate: 60-100 bpm</div>
              <div>Blood Pressure: &lt;120/80</div>
              <div>Sleep: 7-9 hours</div>
              <div>Glucose: 70-100 mg/dL</div>
              <div>Steps: 8,000+</div>
              <div>Water: 2-3 liters</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-medical-blue to-primary">
              Save Health Data
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HealthDataForm;