/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  useCreateDistrictMutation,
  useGetDivisionsQuery,
} from "@/redux/features/ride/ride.api";
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
import { useEffect } from "react";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";

const districtSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  division: z.string().min(1, "Division is required"),
  thumbnail: z.any().optional(),
  description: z.string().optional(),
});

type DistrictFormValues = z.infer<typeof districtSchema>;

const bdDistricts = [
  { name: "Dhaka", division: "Dhaka" },
  { name: "Faridpur", division: "Dhaka" },
  { name: "Gazipur", division: "Dhaka" },
  { name: "Gopalganj", division: "Dhaka" },
  { name: "Kishoreganj", division: "Dhaka" },
  { name: "Madaripur", division: "Dhaka" },
  { name: "Manikganj", division: "Dhaka" },
  { name: "Munshiganj", division: "Dhaka" },
  { name: "Narayanganj", division: "Dhaka" },
  { name: "Narsingdi", division: "Dhaka" },
  { name: "Rajbari", division: "Dhaka" },
  { name: "Shariatpur", division: "Dhaka" },
  { name: "Tangail", division: "Dhaka" },
  { name: "Bandarban", division: "Chattogram" },
  { name: "Brahmanbaria", division: "Chattogram" },
  { name: "Chandpur", division: "Chattogram" },
  { name: "Chattogram", division: "Chattogram" },
  { name: "Cox's Bazar", division: "Chattogram" },
  { name: "Feni", division: "Chattogram" },
  { name: "Khagrachhari", division: "Chattogram" },
  { name: "Lakshmipur", division: "Chattogram" },
  { name: "Noakhali", division: "Chattogram" },
  { name: "Rangamati", division: "Chattogram" },
  { name: "Bogura", division: "Rajshahi" },
  { name: "Joypurhat", division: "Rajshahi" },
  { name: "Naogaon", division: "Rajshahi" },
  { name: "Natore", division: "Rajshahi" },
  { name: "Chapainawabganj", division: "Rajshahi" },
  { name: "Pabna", division: "Rajshahi" },
  { name: "Rajshahi", division: "Rajshahi" },
  { name: "Sirajganj", division: "Rajshahi" },
  { name: "Bagerhat", division: "Khulna" },
  { name: "Chuadanga", division: "Khulna" },
  { name: "Jashore", division: "Khulna" },
  { name: "Jhenaidah", division: "Khulna" },
  { name: "Khulna", division: "Khulna" },
  { name: "Kushtia", division: "Khulna" },
  { name: "Magura", division: "Khulna" },
  { name: "Meherpur", division: "Khulna" },
  { name: "Narail", division: "Khulna" },
  { name: "Satkhira", division: "Khulna" },
  { name: "Barguna", division: "Barishal" },
  { name: "Barishal", division: "Barishal" },
  { name: "Bhola", division: "Barishal" },
  { name: "Jhalokati", division: "Barishal" },
  { name: "Patuakhali", division: "Barishal" },
  { name: "Pirojpur", division: "Barishal" },
  { name: "Habiganj", division: "Sylhet" },
  { name: "Moulvibazar", division: "Sylhet" },
  { name: "Sunamganj", division: "Sylhet" },
  { name: "Sylhet", division: "Sylhet" },
  { name: "Dinajpur", division: "Rangpur" },
  { name: "Gaibandha", division: "Rangpur" },
  { name: "Kurigram", division: "Rangpur" },
  { name: "Lalmonirhat", division: "Rangpur" },
  { name: "Nilphamari", division: "Rangpur" },
  { name: "Panchagarh", division: "Rangpur" },
  { name: "Rangpur", division: "Rangpur" },
  { name: "Thakurgaon", division: "Rangpur" },
  { name: "Jamalpur", division: "Mymensingh" },
  { name: "Mymensingh", division: "Mymensingh" },
  { name: "Netrokona", division: "Mymensingh" },
  { name: "Sherpur", division: "Mymensingh" },
];

const AddDistrict = () => {
  const [createDistrict, { isLoading: isCreating }] =
    useCreateDistrictMutation();
  const { data: divisionsData, isLoading: isLoadingDivisions } =
    useGetDivisionsQuery();

  const form = useForm<DistrictFormValues>({
    resolver: zodResolver(districtSchema),
    defaultValues: {
      name: "",
      slug: "",
      division: "",
      thumbnail: "",
      description: "",
    },
  });

  const { handleSubmit, formState: { errors }, reset, watch, setValue } = form;
  const selectedDistrict = watch("name");

  // Watch for district changes and update division
  useEffect(() => {
    if (selectedDistrict && divisionsData?.data) {
      // Find the selected district in bdDistricts
      const districtInfo = bdDistricts.find(d => d.name === selectedDistrict);

      if (districtInfo) {
        // Find the matching division in divisionsData
        const division = divisionsData.data.find(d => d.name === districtInfo.division);

        if (division) {
          // Set the division ID in the form
          setValue("division", division._id, { shouldValidate: true });
        }
      }
    }
  }, [selectedDistrict, divisionsData, setValue]);

  useEffect(() => {
    if (selectedDistrict) {
      const slug = selectedDistrict
        .toLowerCase()
        .replace(/\s+/g, '-')    // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-')   // Replace multiple - with single -
        .replace(/^-+/, '')       // Trim - from start of text
        .replace(/-+$/, '');      // Trim - from end of text
      setValue("slug", slug, { shouldValidate: true });
    }
  }, [selectedDistrict, setValue]);


  const onSubmit = async (data: DistrictFormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("slug", data.slug);
      formData.append("division", data.division);
      
    //  console.log(divisionsData, data.division) 


      
      if (data.description) formData.append("description", data.description);

      // Handle thumbnail file
      if (data.thumbnail && data.thumbnail[0]) {
        formData.append("thumbnail", data.thumbnail[0]);
      }

      const result = await createDistrict(formData as any).unwrap();
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
            Add New District
          </CardTitle>
          <CardDescription>
            Fill in the details below to add a new district to the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field>
                <FieldLabel>District Name</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="e.g. Dhaka"
                    {...form.register("name")}
                    className="h-11"
                    list="districts"
                  />
                  <datalist id="districts">
                    {bdDistricts.map((district) => (
                      <option key={district.name} value={district.name} />
                    ))}
                  </datalist>
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
              <FieldLabel>Division</FieldLabel>
              <FieldContent>
                <select
                  {...form.register("division")}
                  className="flex h-11 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
                >
                  
                  {divisionsData?.data?.map((division) => (
                    <option
                      key={division._id}
                      value={division._id}
                      className="dark:bg-[#1e1e2e]"
                    >
                      {division.name}
                    </option>
                  ))}
                </select>
                {isLoadingDivisions && (
                  <p className="text-xs text-muted-foreground animate-pulse">
                    Loading divisions...
                  </p>
                )}
                <FieldError errors={[errors.division]} />
              </FieldContent>
            </Field>


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
                  placeholder="Tell us more about this district..."
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
                    Creating District...
                  </div>
                ) : (
                  "Create District"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddDistrict;
