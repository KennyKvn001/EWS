import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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
  uploaded_by: z.string().min(1, "This field is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function PredictionForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: undefined,
      marital_status: undefined,
      employed: false,
      scholarship: false,
      student_loan: false,
      attendance_score: undefined,
      study_mode: undefined,
      engagement_score: undefined,
      repeated_course: 0,
      internet_access: false,
      uploaded_by: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted with data:", data);
    // Transform data to match backend schema
    const transformedData = {
      ...data,
      marital_status: parseInt(data.marital_status),
      study_mode: parseInt(data.study_mode),
    };
    console.log("Transformed data for backend:", transformedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="bg-card rounded-xl border shadow-sm p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Age */}
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter age"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                    />
                  </FormControl>
                  <FormDescription>Student's age (15-100 years)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Attendance Score */}
            <FormField
              control={form.control}
              name="attendance_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attendance Score</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter score (0-100)"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                    />
                  </FormControl>
                  <FormDescription>
                    Student's attendance score (0-100)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Engagement Score */}
            <FormField
              control={form.control}
              name="engagement_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Engagement Score</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter score (0-100)"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                    />
                  </FormControl>
                  <FormDescription>
                    Student's engagement score (0-100)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Repeated Courses */}
            <FormField
              control={form.control}
              name="repeated_course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repeated Courses</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Number of repeated courses"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Number of courses repeated (0-10)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Employed */}
            <FormField
              control={form.control}
              name="employed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Employed</FormLabel>
                    <FormDescription>
                      Check if the student is currently employed
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Scholarship */}
            <FormField
              control={form.control}
              name="scholarship"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Scholarship</FormLabel>
                    <FormDescription>
                      Check if the student has a scholarship
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Student Loan */}
            <FormField
              control={form.control}
              name="student_loan"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Student Loan</FormLabel>
                    <FormDescription>
                      Check if the student has a student loan
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Internet Access */}
            <FormField
              control={form.control}
              name="internet_access"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Internet Access</FormLabel>
                    <FormDescription>
                      Check if the student has reliable internet access
                    </FormDescription>
                  </div>
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
                        <FormLabel className="font-normal cursor-pointer">
                          Single
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="2" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Married
                        </FormLabel>
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
                  <FormDescription>
                    Student's enrollment type
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <Button type="submit" className="bg-gradient-to-r from-[#2563eb] to-[#1e40af] hover:from-[#1d4ed8] hover:to-[#1e3a8a] text-white shadow-md hover:shadow-lg transition-all">
              Submit Prediction
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

