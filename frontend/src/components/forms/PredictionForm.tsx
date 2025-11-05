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

const formSchema = z.object({
  total_units_approved: z
    .number()
    .min(0, "Cannot be negative")
    .max(20, "Cannot exceed 20 units"),
  average_grade: z
    .number()
    .min(0, "Grade must be at least 0%")
    .max(100, "Grade must be at most 100%"),
  age_at_enrollment: z
    .number()
    .min(16, "Age must be at least 16")
    .max(65, "Age must be at most 65"),
  total_units_evaluated: z
    .number()
    .min(0, "Cannot be negative")
    .max(20, "Cannot exceed 20 units"),
  total_units_enrolled: z
    .number()
    .min(0, "Cannot be negative")
    .max(20, "Cannot exceed 20 units"),
  previous_qualification_grade: z
    .number()
    .min(0, "Grade must be at least 0%")
    .max(100, "Grade must be at most 100%"),
  tuition_fees_up_to_date: z.boolean(),
  scholarship_holder: z.boolean(),
  debtor: z.boolean(),
  gender: z.enum(["male", "female"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function PredictionForm() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [predictionResult, setPredictionResult] =
    useState<PredictionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isRerunning, setIsRerunning] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

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

  const handleRerun = () => {
    setIsRerunning(true);
    setDialogOpen(false);
    setApiError(null);

    setTimeout(() => {
      setIsRerunning(false);
      form.handleSubmit(onSubmit)();
    }, 500);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="bg-card rounded-xl border shadow-sm p-6">
          {apiError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}

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
                      placeholder="Enter total units approved (0-20)"
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e.target.valueAsNumber || undefined);
                        clearApiError();
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Total number of units approved (0-20 scale)
                  </FormDescription>
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
                      placeholder="Enter average grade (0-100%)"
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e.target.valueAsNumber || undefined);
                        clearApiError();
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Student's average grade as percentage (0-100%)
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
                      placeholder="Enter age (16-65)"
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e.target.valueAsNumber || undefined);
                        clearApiError();
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Student's age at enrollment (16-65 years)
                  </FormDescription>
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
                      placeholder="Enter total units evaluated (0-20)"
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e.target.valueAsNumber || undefined);
                        clearApiError();
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Total number of units evaluated (0-20 scale)
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
                      placeholder="Enter total units enrolled (0-20)"
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e.target.valueAsNumber || undefined);
                        clearApiError();
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Total number of units enrolled (0-20 scale)
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
                      placeholder="Enter previous qualification grade (0-100%)"
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e.target.valueAsNumber || undefined);
                        clearApiError();
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Grade from previous qualification as percentage (0-100%)
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
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        clearApiError();
                      }}
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
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        clearApiError();
                      }}
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
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        clearApiError();
                      }}
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
                      onValueChange={(value) => {
                        field.onChange(value);
                        clearApiError();
                      }}
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
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {isRerunning ? "Re-running..." : "Processing Prediction..."}
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
        onRerun={handleRerun}
        isRerunLoading={isRerunning}
      />
    </Form>
  );
}
