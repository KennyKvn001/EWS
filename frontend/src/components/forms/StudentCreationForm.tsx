import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUser } from "@clerk/clerk-react";
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
import { Loader2, AlertCircle } from "lucide-react";
import { predictionApi, PredictionApiError } from "@/services/predictionApi";
import type { PredictionFormData } from "@/types/prediction";
import type { StudentWithPrediction } from "@/types/student";

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

interface StudentCreationFormProps {
  onSuccess: (student: StudentWithPrediction) => void;
  onCancel: () => void;
}

export default function StudentCreationForm({
  onSuccess,
  onCancel,
}: StudentCreationFormProps) {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const onSubmit = useCallback(
    async (data: FormValues) => {
      setIsSubmitting(true);
      setApiError(null);

      try {
        // Get user identifier from Clerk
        const uploadedBy =
          user?.primaryEmailAddress?.emailAddress || user?.id || "unknown";

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

        const studentData = await predictionApi.createStudentWithPrediction(
          formData,
          uploadedBy
        );

        onSuccess(studentData);
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
    },
    [user, onSuccess, form]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="rounded-xl">
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

          {/* Submit and Cancel Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#2563eb] to-[#1e40af] hover:from-[#1d4ed8] hover:to-[#1e3a8a] text-white shadow-md hover:shadow-lg transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating Student...
                </>
              ) : (
                "Create Student"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
