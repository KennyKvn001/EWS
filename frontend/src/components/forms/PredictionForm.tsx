import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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

export default function PredictionForm() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [isRerunning, setIsRerunning] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      total_units_approved: undefined,
      average_grade: undefined,
      age_at_enrollment: undefined,
      total_units_evaluated: undefined,
      total_units_enrolled: undefined,
      previous_qualification_grade: undefined,
      tuition_fees_up_to_date: false,
      scholarship_holder: false,
      debtor: false,
      gender: undefined,

    },
  });

  const onSubmit = async (data: FormValues) => {
    console.log("Form submitted with data:", data);
    setIsSubmitting(true);

    // TODO: Replace with actual API call to backend
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock prediction result - replace with actual API response
    const mockResult: PredictionResult = {
      riskLevel: data.average_grade > 15 ? "low" : data.average_grade > 10 ? "medium" : "high",
      riskScore: data.average_grade > 15 ? 0.15 : data.average_grade > 10 ? 0.45 : 0.85,
    };

    setPredictionResult(mockResult);
    setDialogOpen(true);
    setIsSubmitting(false);
  };

  const handleExplain = () => {
    console.log("Explain prediction for:", predictionResult);
    setIsExplaining(true);
    // TODO: Implement explainability logic here
    // This would typically call an API endpoint to get SHAP values or feature importance
    setTimeout(() => {
      setIsExplaining(false);
      alert("Explainability feature coming soon! This will show SHAP values and feature importance.");
    }, 1500);
  };

  const handleRerun = () => {
    console.log("Re-running prediction");
    setIsRerunning(true);
    setDialogOpen(false);
    // Reset form and rerun
    setTimeout(() => {
      setIsRerunning(false);
      form.handleSubmit(onSubmit)();
    }, 500);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="bg-card rounded-xl border shadow-sm p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Total Units Approved */}
            <FormField
              control={form.control}
              name="total_units_approved"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Units Approved</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter total units approved"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                    />
                  </FormControl>
                  <FormDescription>Total number of units approved</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Average Grade */}
            <FormField
              control={form.control}
              name="average_grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Average Grade</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Enter average grade (0-20)"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                    />
                  </FormControl>
                  <FormDescription>
                    Student's average grade (0-20 scale)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Age at Enrollment */}
            <FormField
              control={form.control}
              name="age_at_enrollment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age at Enrollment</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter age"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                    />
                  </FormControl>
                  <FormDescription>Student's age at enrollment (15-100 years)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Total Units Evaluated */}
            <FormField
              control={form.control}
              name="total_units_evaluated"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Units Evaluated</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter total units evaluated"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                    />
                  </FormControl>
                  <FormDescription>
                    Total number of units evaluated
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Total Units Enrolled */}
            <FormField
              control={form.control}
              name="total_units_enrolled"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Units Enrolled</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter total units enrolled"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                    />
                  </FormControl>
                  <FormDescription>
                    Total number of units enrolled
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Previous Qualification Grade */}
            <FormField
              control={form.control}
              name="previous_qualification_grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Previous Qualification (Grade)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Enter previous qualification grade"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                    />
                  </FormControl>
                  <FormDescription>
                    Grade from previous qualification (0-200)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tuition Fees Up to Date */}
            <FormField
              control={form.control}
              name="tuition_fees_up_to_date"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Tuition Fees Up to Date</FormLabel>
                    <FormDescription>
                      Check if tuition fees are up to date
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Scholarship Holder */}
            <FormField
              control={form.control}
              name="scholarship_holder"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Scholarship Holder</FormLabel>
                    <FormDescription>
                      Check if the student has a scholarship
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Debtor */}
            <FormField
              control={form.control}
              name="debtor"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Debtor</FormLabel>
                    <FormDescription>
                      Check if the student is a debtor
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-1 pt-2"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="female" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Female
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="male" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Male
                        </FormLabel>
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
              disabled={isSubmitting || isRerunning}
              className="bg-gradient-to-r from-[#2563eb] to-[#1e40af] hover:from-[#1d4ed8] hover:to-[#1e3a8a] text-white shadow-md hover:shadow-lg transition-all"
            >
              {isSubmitting || isRerunning ? (
                <>
                  <span className="animate-spin mr-2"><Loader2 className="w-4 h-4 animate-spin" /></span>
                  {isRerunning ? "Re-running..." : "Processing..."}
                </>
              ) : (
                "Submit Prediction"
              )}
            </Button>
          </div>
        </div>
      </form>

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
    </Form>
  );
}

