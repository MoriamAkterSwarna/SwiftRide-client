import { useCreateDivisionMutation } from "@/redux/features/ride/ride.api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { useEffect } from "react";

const divisionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  thumbnail: z.any().optional(),
  description: z.string().optional(),
});

type DivisionFormValues = z.infer<typeof divisionSchema>;

const AddDivision = () => {
  const [createDivision, { isLoading: isCreating }] =
    useCreateDivisionMutation();

  const form = useForm<DivisionFormValues>({
    resolver: zodResolver(divisionSchema),
    defaultValues: {
      name: "",
      slug: "",
      thumbnail: "",
      description: "",
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;
  const nameValue = watch("name");

  // Auto-generate slug from name
  useEffect(() => {
    if (nameValue) {
      const generatedSlug = nameValue
        .toLowerCase()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-");
      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [nameValue, setValue]);

  const onSubmit = async (data: DivisionFormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("slug", data.slug);
      if (data.description) formData.append("description", data.description);

      // Handle thumbnail file
      if (data.thumbnail && data.thumbnail[0]) {
        formData.append("thumbnail", data.thumbnail[0]);
      }

      const result = await createDivision(formData).unwrap();
      if (result.success) {
        toast.success("Division created successfully!");
        reset();
      }
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to create division");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card className="border-none shadow-xl bg-linear-to-br from-card to-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Add New Division
          </CardTitle>
          <CardDescription>
            Fill in the details below to add a new division to the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field>
                <FieldLabel>Division Name</FieldLabel>
                <FieldContent>
                  <select
                    {...form.register("name")}
                    className="flex h-11 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
                  >
                    <option value="" disabled>
                      Select a division
                    </option>
                    {[
                      "Dhaka",
                      "Chattogram",
                      "Rajshahi",
                      "Khulna",
                      "Barishal",
                      "Sylhet",
                      "Rangpur",
                      "Mymensingh",
                    ].map((division) => (
                      <option
                        key={division}
                        value={division}
                        className="dark:bg-[#1e1e2e]"
                      >
                        {division}
                      </option>
                    ))}
                  </select>
                  <FieldError errors={[errors.name]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Slug</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="e.g. dhaka"
                    {...form.register("slug")}
                    className="h-11 bg-muted/50"
                  />
                  <FieldError errors={[errors.slug]} />
                </FieldContent>
              </Field>
            </div>

            <Field>
              <FieldLabel>Thumbnail (Optional)</FieldLabel>
              <FieldContent>
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept="image/*"
                    {...form.register("thumbnail")}
                    className="h-11 cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                  {form.watch("thumbnail")?.[0] && (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-input bg-muted/30">
                      <img
                        src={URL.createObjectURL(form.watch("thumbnail")[0])}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <FieldError errors={[errors.thumbnail]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Description (Optional)</FieldLabel>
              <FieldContent>
                <Textarea
                  placeholder="Tell us more about this division..."
                  {...form.register("description")}
                  className="min-h-30 resize-none"
                />
                <FieldError errors={[errors.description]} />
              </FieldContent>
            </Field>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]"
                disabled={isCreating}
              >
                {isCreating ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Division...
                  </div>
                ) : (
                  "Create Division"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddDivision;
