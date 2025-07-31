import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

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

interface ProfileModalProps {
  patient: Patient;
  onClose: () => void;
  onSave: (updatedPatient: Patient) => void;
}

const ProfileModal = ({ patient, onClose, onSave }: ProfileModalProps) => {
  const [formData, setFormData] = useState<Patient>(patient);
  const [newAllergy, setNewAllergy] = useState("");
  const [newCondition, setNewCondition] = useState("");

  const updateFormData = (field: keyof Patient, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      const updatedAllergies = [...(formData.allergies || []), newAllergy.trim()];
      updateFormData("allergies", updatedAllergies);
      setNewAllergy("");
    }
  };

  const removeAllergy = (index: number) => {
    const updatedAllergies = formData.allergies?.filter((_, i) => i !== index) || [];
    updateFormData("allergies", updatedAllergies);
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      const updatedConditions = [...(formData.conditions || []), newCondition.trim()];
      updateFormData("conditions", updatedConditions);
      setNewCondition("");
    }
  };

  const removeCondition = (index: number) => {
    const updatedConditions = formData.conditions?.filter((_, i) => i !== index) || [];
    updateFormData("conditions", updatedConditions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your medical information and personal details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => updateFormData("fullName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth || ""}
                  onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender || ""}
                  onValueChange={(value) => updateFormData("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Medical Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select
                  value={formData.bloodGroup || ""}
                  onValueChange={(value) => updateFormData("bloodGroup", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctorName">Doctor's Name</Label>
                <Input
                  id="doctorName"
                  value={formData.doctorName}
                  onChange={(e) => updateFormData("doctorName", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Allergies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Allergies</h3>
            <div className="flex space-x-2">
              <Input
                placeholder="Add new allergy"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAllergy())}
              />
              <Button type="button" onClick={addAllergy} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.allergies?.map((allergy, index) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <span>{allergy}</span>
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeAllergy(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Medical Conditions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Medical Conditions</h3>
            <div className="flex space-x-2">
              <Input
                placeholder="Add medical condition"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCondition())}
              />
              <Button type="button" onClick={addCondition} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.conditions?.map((condition, index) => (
                <Badge key={index} variant="outline" className="flex items-center space-x-1">
                  <span>{condition}</span>
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeCondition(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Medical History */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Medical History</h3>
            <Textarea
              placeholder="Enter your medical history, past surgeries, medications, etc."
              value={formData.medicalHistory || ""}
              onChange={(e) => updateFormData("medicalHistory", e.target.value)}
              rows={4}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-medical-blue to-primary">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;