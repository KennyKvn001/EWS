import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

// Validation schema
const formSchema = z.object({
  age: z.number().min(15, "Age must be at least 15").max(100, "Age must be less than 100"),
  marital_status: z.enum(["1", "2"]),
  employed: z.boolean(),
  scholarship: z.boolean(),
  student_loan: z.boolean(),
  attendance_score: z.number().min(0, "Score must be at least 0").max(100, "Score must be at most 100"),
  study_mode: z.enum(["1", "2"]),
  engagement_score: z.number().min(0, "Score must be at least 0").max(100, "Score must be at most 100"),
  repeated_course: z.number().min(0, "Cannot be negative").max(10, "Maximum 10 courses"),
  internet_access: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface SimulationResult {
  risk_score: number;
  risk_category: string;
  recommendations: string[];
}

export default function SimulationForm() {
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 20,
      marital_status: "1",
      employed: false,
      scholarship: false,
      student_loan: false,
      attendance_score: 75,
      study_mode: "1",
      engagement_score: 75,
      repeated_course: 0,
      internet_access: true,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    console.log("Simulation submitted with data:", data);
    
    // Simulate API call - replace with actual API call later
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock simulation result
    const mockRiskScore = calculateMockRiskScore(data);
    const mockResult: SimulationResult = {
      risk_score: mockRiskScore,
      risk_category: getRiskCategory(mockRiskScore),
      recommendations: getRecommendations(data, mockRiskScore),
    };
    
    setSimulationResult(mockResult);
    setIsLoading(false);
  };

  // Mock function to calculate risk score based on inputs
  const calculateMockRiskScore = (data: FormValues): number => {
    let score = 50; // Base score
    
    // Attendance impact
    score += (100 - data.attendance_score) * 0.3;
    
    // Engagement impact
    score += (100 - data.engagement_score) * 0.3;
    
    // Repeated courses impact
    score += data.repeated_course * 5;
    
    // Age impact (younger students slightly higher risk)
    if (data.age < 20) score += 5;
    
    // Positive factors
    if (data.scholarship) score -= 10;
    if (data.internet_access) score -= 5;
    if (data.study_mode === "1") score -= 5; // Full-time
    
    // Negative factors
    if (data.employed) score += 8;
    if (data.student_loan) score += 5;
    
    return Math.max(0, Math.min(100, score));
  };

  const getRiskCategory = (score: number): string => {
    if (score < 30) return "Low";
    if (score < 60) return "Medium";
    return "High";
  };

  const getRecommendations = (data: FormValues, riskScore: number): string[] => {
    const recommendations: string[] = [];
    
    if (data.attendance_score < 70) {
      recommendations.push("Improve attendance - aim for at least 80% attendance rate");
    }
    if (data.engagement_score < 70) {
      recommendations.push("Increase engagement - participate more in class activities and discussions");
    }
    if (data.repeated_course > 2) {
      recommendations.push("Seek academic support to avoid repeating courses");
    }
    if (!data.internet_access) {
      recommendations.push("Secure reliable internet access for better learning outcomes");
    }
    if (data.employed && riskScore > 50) {
      recommendations.push("Consider reducing work hours to focus more on studies");
    }
    if (!data.scholarship && riskScore > 60) {
      recommendations.push("Explore scholarship opportunities to reduce financial burden");
    }
    
    if (recommendations.length === 0) {
      recommendations.push("Keep up the good work! Continue current study habits.");
    }
    
    return recommendations;
  };

  const getRiskBadgeColor = (category: string) => {
    switch (category) {
      case "Low":
        return "bg-green-500 hover:bg-green-600";
      case "Medium":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "High":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>What-If Scenario Simulator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8 md:grid-cols-2">
                {/* Age Slider */}
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Age</FormLabel>
                        <span className="text-sm font-semibold text-primary">{field.value}</span>
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
                      <FormDescription>Adjust student's age (15-100 years)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Attendance Score Slider */}
                <FormField
                  control={form.control}
                  name="attendance_score"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Attendance Score</FormLabel>
                        <span className="text-sm font-semibold text-primary">{field.value}%</span>
                      </div>
                      <FormControl>
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>Student's attendance rate (0-100%)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Engagement Score Slider */}
                <FormField
                  control={form.control}
                  name="engagement_score"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Engagement Score</FormLabel>
                        <span className="text-sm font-semibold text-primary">{field.value}%</span>
                      </div>
                      <FormControl>
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>Student's engagement level (0-100%)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Repeated Courses Slider */}
                <FormField
                  control={form.control}
                  name="repeated_course"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Repeated Courses</FormLabel>
                        <span className="text-sm font-semibold text-primary">{field.value}</span>
                      </div>
                      <FormControl>
                        <Slider
                          min={0}
                          max={10}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>Number of courses repeated (0-10)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Employed Switch */}
                <FormField
                  control={form.control}
                  name="employed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Employed</FormLabel>
                        <FormDescription>Is the student currently employed?</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Scholarship Switch */}
                <FormField
                  control={form.control}
                  name="scholarship"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Scholarship</FormLabel>
                        <FormDescription>Does the student have a scholarship?</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Student Loan Switch */}
                <FormField
                  control={form.control}
                  name="student_loan"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Student Loan</FormLabel>
                        <FormDescription>Does the student have a student loan?</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Internet Access Switch */}
                <FormField
                  control={form.control}
                  name="internet_access"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Internet Access</FormLabel>
                        <FormDescription>Does the student have reliable internet?</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Marital Status */}
                <FormField
                  control={form.control}
                  name="marital_status"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Marital Status</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="1" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">Single</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="2" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">Married</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Study Mode */}
                <FormField
                  control={form.control}
                  name="study_mode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Study Mode</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select study mode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Full-time</SelectItem>
                          <SelectItem value="2">Part-time</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Student's enrollment type</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex justify-end">
                <Button 
                  type="submit" 
                  className="text-base font-semibold shadow-md hover:shadow-lg transition-shadow"
                  disabled={isLoading}
                >
                  {isLoading ? "Simulating..." : "Run Simulation"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>

      {/* Simulation Results */}
      {simulationResult && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Simulation Results</span>
              <Badge className={getRiskBadgeColor(simulationResult.risk_category)}>
                {simulationResult.risk_category} Risk
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Risk Score */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Risk Score</span>
                <span className="text-2xl font-bold text-primary">
                  {simulationResult.risk_score.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-secondary h-4 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    simulationResult.risk_category === "Low"
                      ? "bg-green-500"
                      : simulationResult.risk_category === "Medium"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${simulationResult.risk_score}%` }}
                />
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
              <div className="space-y-2">
                {simulationResult.recommendations.map((rec, index) => (
                  <Alert key={index}>
                    <AlertDescription className="flex items-start">
                      <span className="mr-2 mt-0.5">•</span>
                      <span>{rec}</span>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <div className="flex justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setSimulationResult(null)}
              >
                Run New Simulation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

