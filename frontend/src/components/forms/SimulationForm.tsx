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
import { Alert, AlertDescription } from "@/components/ui/alert";
import PredictionResultDialog, {
  type PredictionResult,
} from "@/components/myui/PredictionResultDialog";
import { Loader2, AlertCircle } from "lucide-react";
import {
  predictionApi,
  PredictionApiError,
  PredictionResultConverter,
} from "@/services/predictionApi";
import type { PredictionFormData } from "@/types/prediction";

// Validation schema - matches backend requirements (0-100 for grades)
const formSchema = z.object({
  total_units_approved: z.number().min(0, "Cannot be negative").max(20, "Cannot exceed 20 units"),
  average_grade: z.number().min(0, "Grade must be at least 0").max(100, "Grade must be at most 100"),
  age_at_enrollment: z.number().min(16, "Age must be at least 16").max(65, "Age must be at most 65"),
  total_units_evaluated: z.number().min(0, "Cannot be negative").max(20, "Cannot exceed 20 units"),
  total_units_enrolled: z.number().min(0, "Cannot be negative").max(20, "Cannot exceed 20 units"),
  previous_qualification_grade: z.number().min(0, "Grade must be at least 0").max(100, "Grade must be at most 100"),
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
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      total_units_approved: 20,
      average_grade: 60,
      age_at_enrollment: 20,
      total_units_evaluated: 20,
      total_units_enrolled: 20,
      previous_qualification_grade: 60,
      tuition_fees_up_to_date: true,
      scholarship_holder: false,
      debtor: false,
      gender: "female",
    },
  });

  const clearApiError = () => {
    if (apiError) {
      setApiError(null);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      const formData: PredictionFormData = {
        total_units_approved: data.total_units_approved,
        average_grade: data.average_grade,
        age_at_enrollment: data.age_at_enrollment,
        total_units_evaluated: data.total_units_evaluated,
        total_units_enrolled: data.total_units_enrolled,
        previous_qualification_grade: data.previous_qualification_grade,
        tuition_fees_up_to_date: data.tuition_fees_up_to_date,
        scholarship_holder: data.scholarship_holder,
        debtor: data.debtor,
        gender: data.gender,
      };

      const apiResponse = await predictionApi.predictWithExplanation(formData);

      const enhancedResult =
        PredictionResultConverter.toEnhancedResult(apiResponse);

      const dialogResult: PredictionResult = {
        riskLevel: enhancedResult.riskLevel,
        riskScore: enhancedResult.riskScore,
        predictionLabel: enhancedResult.predictionLabel,
        explanation: enhancedResult.explanation,
      };

      setPredictionResult(dialogResult);
      setDialogOpen(true);
    } catch (error) {
      if (error instanceof PredictionApiError) {
        const apiErrorDetails = error.getApiError();

        let errorMessage = error.getUserMessage();
        if (apiErrorDetails.hint) {
          errorMessage += ` ${apiErrorDetails.hint}`;
        }
        setApiError(errorMessage);

        if (
          apiErrorDetails.details &&
          typeof apiErrorDetails.details === "object"
        ) {
          const validationErrors = apiErrorDetails.details as Record<
            string,
            string[]
          >;
          Object.entries(validationErrors).forEach(([field, messages]) => {
            if (field in data && messages.length > 0) {
              form.setError(field as keyof FormValues, {
                type: "server",
                message: messages[0],
              });
            }
          });
        }
      } else {
        setApiError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExplain = () => {
    setIsExplaining(false);
  };

  const handleRerun = () => {
    setIsRerunning(true);
    setDialogOpen(false);
    setApiError(null);
    clearApiError();

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
              {apiError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{apiError}</AlertDescription>
                </Alert>
              )}
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
                          max={20}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => {
                            field.onChange(vals[0]);
                            clearApiError();
                          }}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>Number of units approved (0-20)</FormDescription>
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
                        <span className="text-sm font-semibold text-[#2563eb] dark:text-[#60a5fa]">{field.value.toFixed(1)}%</span>
                      </div>
                      <FormControl>
                        <Slider
                          min={0}
                          max={100}
                          step={0.1}
                          value={[field.value]}
                          onValueChange={(vals) => {
                            field.onChange(vals[0]);
                            clearApiError();
                          }}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>Student's average grade as percentage (0-100%)</FormDescription>
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
                          min={16}
                          max={65}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => {
                            field.onChange(vals[0]);
                            clearApiError();
                          }}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>Student's age at enrollment (16-65 years)</FormDescription>
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
                          max={20}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => {
                            field.onChange(vals[0]);
                            clearApiError();
                          }}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>Number of units evaluated (0-20)</FormDescription>
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
                          max={20}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => {
                            field.onChange(vals[0]);
                            clearApiError();
                          }}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>Number of units enrolled (0-20)</FormDescription>
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
                        <span className="text-sm font-semibold text-[#2563eb] dark:text-[#60a5fa]">{field.value.toFixed(1)}%</span>
                      </div>
                      <FormControl>
                        <Slider
                          min={0}
                          max={100}
                          step={0.1}
                          value={[field.value]}
                          onValueChange={(vals) => {
                            field.onChange(vals[0]);
                            clearApiError();
                          }}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>Grade from previous qualification as percentage (0-100%)</FormDescription>
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
                        <Switch 
                          checked={field.value} 
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            clearApiError();
                          }} 
                        />
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
                        <Switch 
                          checked={field.value} 
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            clearApiError();
                          }} 
                        />
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
                        <Switch 
                          checked={field.value} 
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            clearApiError();
                          }} 
                        />
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
                          onValueChange={(value) => {
                            field.onChange(value);
                            clearApiError();
                          }}
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

