import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import PredictionResultDialog, {
  type PredictionResult,
} from "@/components/myui/PredictionResultDialog";
import { Loader2 } from "lucide-react";

// Validation schema
const formSchema = z.object({
  total_units_approved: z.number().min(0, "Cannot be negative"),
  average_grade: z.number().min(0, "Grade must be at least 0").max(20, "Grade must be at most 20"),
  age_at_enrollment: z.number().min(15, "Age must be at least 15").max(100, "Age must be less than 100"),
  total_units_evaluated: z.number().min(0, "Cannot be negative"),
  total_units_enrolled: z.number().min(0, "Cannot be negative"),
  previous_qualification_grade: z.number().min(0, "Grade must be at least 0").max(200, "Grade must be at most 200"),
  tuition_fees_up_to_date: z.boolean(),
  scholarship_holder: z.boolean(),
  debtor: z.boolean(),
  gender: z.enum(["male", "female"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function SimulationForm() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [isRerunning, setIsRerunning] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      total_units_approved: 20,
      average_grade: 12,
      age_at_enrollment: 20,
      total_units_evaluated: 20,
      total_units_enrolled: 25,
      previous_qualification_grade: 120,
      tuition_fees_up_to_date: true,
      scholarship_holder: false,
      debtor: false,
      gender: "female",
    },
  });

  const onSubmit = async (data: FormValues) => {
    console.log("Simulation submitted with data:", data);
    setIsSubmitting(true);
    
    // Simulate API call - replace with actual API call later
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock simulation result
    const mockRiskScore = calculateMockRiskScore(data);
    const riskLevel = getRiskLevel(mockRiskScore);
    
    const mockResult: PredictionResult = {
      riskLevel: riskLevel,
      riskScore: mockRiskScore / 100,
    };
    
    setPredictionResult(mockResult);
    setDialogOpen(true);
    setIsSubmitting(false);
  };

  // Mock function to calculate risk score based on inputs
  const calculateMockRiskScore = (data: FormValues): number => {
    let score = 50; // Base score
    
    // Academic performance impact
    const gradePerformance = (data.average_grade / 20) * 100;
    score -= (gradePerformance - 50) * 0.4;
    
    // Units completion rate
    const completionRate = data.total_units_evaluated > 0 
      ? (data.total_units_approved / data.total_units_evaluated) * 100 
      : 50;
    score -= (completionRate - 50) * 0.3;
    
    // Age impact (younger students slightly higher risk)
    if (data.age_at_enrollment < 20) score += 5;
    
    // Previous qualification impact
    const prevQualPerformance = (data.previous_qualification_grade / 200) * 100;
    score -= (prevQualPerformance - 50) * 0.2;
    
    // Positive factors
    if (data.scholarship_holder) score -= 10;
    if (data.tuition_fees_up_to_date) score -= 8;
    
    // Negative factors
    if (data.debtor) score += 15;
    if (data.gender === "male") score += 3;
    
    return Math.max(0, Math.min(100, score));
  };

  const getRiskLevel = (score: number): "high" | "medium" | "low" => {
    if (score < 30) return "low";
    if (score < 60) return "medium";
    return "high";
  };

  const handleExplain = () => {
    console.log("Explain prediction for:", predictionResult);
    setIsExplaining(true);
    // TODO: Implement explainability logic here
    setTimeout(() => {
      setIsExplaining(false);
      alert("Explainability feature coming soon! This will show SHAP values and feature importance.");
    }, 1500);
  };

  const handleRerun = () => {
    console.log("Re-running prediction");
    setIsRerunning(true);
    setDialogOpen(false);
    // Reset and rerun
    setTimeout(() => {
      setIsRerunning(false);
      form.handleSubmit(onSubmit)();
    }, 500);
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Total Units Approved Slider */}
                <FormField
                  control={form.control}
                  name="total_units_approved"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Total Units Approved</FormLabel>
                        <span className="text-sm font-semibold text-[#2563eb] dark:text-[#60a5fa]">{field.value}</span>
                      </div>
                      <FormControl>
                        <Slider
                          min={0}
                          max={60}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>Number of units approved (0-60)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Average Grade Slider */}
                <FormField
                  control={form.control}
                  name="average_grade"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Average Grade</FormLabel>
                        <span className="text-sm font-semibold text-[#2563eb] dark:text-[#60a5fa]">{field.value.toFixed(1)}</span>
                      </div>
                      <FormControl>
                        <Slider
                          min={0}
                          max={20}
                          step={0.1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>Student's average grade (0-20 scale)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Age at Enrollment Slider */}
                <FormField
                  control={form.control}
                  name="age_at_enrollment"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Age at Enrollment</FormLabel>
                        <span className="text-sm font-semibold text-[#2563eb] dark:text-[#60a5fa]">{field.value}</span>
                      </div>
                      <FormControl>
                        <Slider
                          min={15}
                          max={100}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>Student's age at enrollment (15-100 years)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Total Units Evaluated Slider */}
                <FormField
                  control={form.control}
                  name="total_units_evaluated"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Total Units Evaluated</FormLabel>
                        <span className="text-sm font-semibold text-[#2563eb] dark:text-[#60a5fa]">{field.value}</span>
                      </div>
                      <FormControl>
                        <Slider
                          min={0}
                          max={60}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>Number of units evaluated (0-60)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Total Units Enrolled Slider */}
                <FormField
                  control={form.control}
                  name="total_units_enrolled"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Total Units Enrolled</FormLabel>
                        <span className="text-sm font-semibold text-[#2563eb] dark:text-[#60a5fa]">{field.value}</span>
                      </div>
                      <FormControl>
                        <Slider
                          min={0}
                          max={60}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>Number of units enrolled (0-60)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Previous Qualification Grade Slider */}
                <FormField
                  control={form.control}
                  name="previous_qualification_grade"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Previous Qualification (Grade)</FormLabel>
                        <span className="text-sm font-semibold text-[#2563eb] dark:text-[#60a5fa]">{field.value}</span>
                      </div>
                      <FormControl>
                        <Slider
                          min={0}
                          max={200}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>Grade from previous qualification (0-200)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tuition Fees Up to Date Switch */}
                <FormField
                  control={form.control}
                  name="tuition_fees_up_to_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Tuition Fees Up to Date</FormLabel>
                        <FormDescription>Are tuition fees up to date?</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Scholarship Holder Switch */}
                <FormField
                  control={form.control}
                  name="scholarship_holder"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Scholarship Holder</FormLabel>
                        <FormDescription>Does the student have a scholarship?</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Debtor Switch */}
                <FormField
                  control={form.control}
                  name="debtor"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Debtor</FormLabel>
                        <FormDescription>Is the student a debtor?</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Gender */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="female" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">Female</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="male" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">Male</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <div className="mt-6 flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-[#2563eb] to-[#1e40af] hover:from-[#1d4ed8] hover:to-[#1e3a8a] text-white shadow-md hover:shadow-lg transition-all"
                  disabled={isSubmitting || isRerunning}
                >
                  {isSubmitting || isRerunning ? (
                    <>
                      <span className="animate-spin mr-2"><Loader2 className="w-4 h-4 animate-spin" /></span>
                      {isRerunning ? "Re-running..." : "Simulating..."}
                    </>
                  ) : (
                    "Run Prediction"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>

      {/* Prediction Result Dialog */}
      <PredictionResultDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        result={predictionResult}
        onExplain={handleExplain}
        onRerun={handleRerun}
        isExplainingLoading={isExplaining}
        isRerunLoading={isRerunning}
      />
    </div>
  );
}

