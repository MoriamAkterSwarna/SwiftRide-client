/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/incompatible-library */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppSelector } from "@/redux/hook";
import * as z from "zod";
import { toast } from "sonner";
import { useGetDivisionsQuery } from "@/redux/features/division/division.api";
import { useCreateDistrictMutation } from "@/redux/features/district/district.api";
import { useEffect } from "react";
import { MapPin, Upload, X } from "lucide-react";





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
  const hasSessionHint = useAppSelector((state: any) => state.authSession.hasSession);
  const [createDistrict, { isLoading: isCreating }] =
    useCreateDistrictMutation();
  const { data: divisionsData, isLoading: isLoadingDivisions } =
    useGetDivisionsQuery(undefined, { skip: !hasSessionHint });

  const form = useForm<DistrictFormValues>({
    resolver: zodResolver(districtSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      slug: "",
      division: "",
      thumbnail: undefined,
      description: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    getValues,
  } = form;
  const selectedDistrict = watch("name");

  console.log("Current form values:", getValues());
  console.log("Divisions data:", divisionsData);

  // Watch for district changes and update division
  useEffect(() => {
    if (selectedDistrict && divisionsData?.data) {
      // Find the selected district in bdDistricts
      const districtInfo = bdDistricts.find(
        (d) => d.name === selectedDistrict,
      );

      if (districtInfo) {
        // Find the matching division in divisionsData
        const division = divisionsData.data.find(
          (d) => d.name === districtInfo.division,
        );

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
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w-]+/g, "") // Remove all non-word chars
        .replace(/-+/g, "-") // Replace multiple - with single -
        .replace(/^-+/, "") // Trim - from start of text
        .replace(/-+$/, ""); // Trim - from end of text
      setValue("slug", slug, { shouldValidate: true });
    }
  }, [selectedDistrict, setValue]);

  const onSubmit = async (data: DistrictFormValues) => {
    try {
      console.log("=== FORM SUBMISSION DEBUG ===");
      console.log("Form data received:", JSON.stringify(data, null, 2));
      console.log("Name:", data.name, "| Type:", typeof data.name, "| Length:", data.name?.length);
      console.log("Division:", data.division, "| Type:", typeof data.division, "| Length:", data.division?.length);
      console.log("Slug:", data.slug);
      

      
      // Validate data before proceeding
      if (!data.name || !data.division) {
        console.error("Validation failed - missing required fields");
        toast.error("Please fill in all required fields");
        return;
      }
      
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("slug", data.slug);
      formData.append("division", data.division);

      if (data.description) formData.append("description", data.description);

      // Handle thumbnail file
      if (data.thumbnail && data.thumbnail[0]) {
        formData.append("thumbnail", data.thumbnail[0]);
      }

      // Log FormData contents
      console.log("=== FORMDATA CONTENTS ===");
      for (const pair of formData.entries()) {
        console.log(pair[0], ":", pair[1]);
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
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 font-body">
      <div className="grid gap-8 lg:grid-cols-2 items-start">
        {/* Left Side - Image */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-1 shadow-2xl">
          <div className="relative rounded-[30px] bg-white/95 backdrop-blur dark:bg-slate-900/95 overflow-hidden h-full min-h-[500px] flex items-center justify-center">
            <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-gradient-to-br from-yellow-200/40 to-orange-200/20 blur-3xl" />
            <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-gradient-to-tr from-blue-200/30 to-blue-100/20 blur-3xl" />

            <div className="relative z-10 w-full h-full flex items-center justify-center p-8">
              {form.watch("thumbnail")?.[0] ? (
                <div className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-gradient-to-r from-blue-300 to-purple-300 shadow-2xl">
                  <img
                    src={URL.createObjectURL(form.watch("thumbnail")[0])}
                    alt="District Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setValue("thumbnail", "")}
                    className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <MapPin className="h-24 w-24 text-blue-400 mx-auto opacity-50" />
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">District Preview</p>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">Upload a thumbnail to see it here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-500 to-blue-600 p-1 shadow-2xl dark:from-blue-600 dark:to-blue-700">
          <div className="relative rounded-[30px] bg-white/95 backdrop-blur dark:bg-slate-900/95 overflow-hidden">
            {/* Decorative gradient shapes */}
            <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-gradient-to-br from-yellow-200/40 to-orange-200/20 blur-3xl" />
            <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-gradient-to-tr from-blue-200/30 to-blue-100/20 blur-3xl" />

            <div className="relative z-10 p-8">
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">
                  Administration
                </p>
                <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-white">
                  Add New District
                </h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Fill in the details below to add a new district to the system.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* District Name */}
                <div>
                  <label htmlFor="district-name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    District Name
                  </label>
                  <input
                    id="district-name"
                    type="text"
                    placeholder="e.g. Dhaka"
                    {...register("name")}
                    list="districts"
                    className="w-full rounded-xl border border-slate-200/70 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700/70 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-500 dark:focus:ring-blue-500/30"
                  />
                  <datalist id="districts">
                    {bdDistricts.map((district) => (
                      <option key={district.name} value={district.name} />
                    ))}
                  </datalist>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                {/* Slug */}
                <div>
                  <label htmlFor="district-slug" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    URL Slug
                  </label>
                  <input
                    id="district-slug"
                    type="text"
                    placeholder="e.g. dhaka"
                    {...register("slug")}
                    readOnly
                    className="w-full rounded-xl border border-slate-200/70 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700/70 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-500 dark:focus:ring-blue-500/30"
                  />
                  {errors.slug && (
                    <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>
                  )}
                </div>

                {/* Division */}
                <div>
                  <label htmlFor="district-division" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Division
                  </label>
                  <select
                    id="district-division"
                    {...register("division")}
                    className="w-full rounded-xl border border-slate-200/70 bg-slate-50/50 px-4 py-3 text-slate-900 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700/70 dark:bg-slate-800/50 dark:text-white dark:focus:ring-blue-500/30"
                  >
                    <option value="">Select a division</option>
                    {divisionsData?.data?.map((division) => (
                      <option key={division?._id} value={division?._id}>
                        {division.name}
                      </option>
                    ))}
                  </select>
                  {isLoadingDivisions && (
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 animate-pulse">
                      Loading divisions...
                    </p>
                  )}
                  {errors.division && (
                    <p className="mt-1 text-sm text-red-500">{errors.division.message}</p>
                  )}
                </div>

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    District Thumbnail
                  </label>
                  <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 dark:border-slate-600 dark:hover:border-blue-500 dark:hover:bg-blue-950/30">
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="h-8 w-8 text-slate-400 mb-2" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Click to upload image
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        PNG, JPG up to 5MB
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      {...register("thumbnail")}
                      className="hidden"
                    />
                  </label>
                  {errors.thumbnail && typeof errors.thumbnail.message === "string" && (
                    <p className="mt-1 text-sm text-red-500">{errors.thumbnail.message}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Tell us more about this district..."
                    {...register("description")}
                    rows={4}
                    className="w-full rounded-xl border border-slate-200/70 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700/70 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-500 dark:focus:ring-blue-500/30 resize-none"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 disabled:opacity-50 dark:from-blue-600 dark:via-blue-700 dark:to-blue-800"
                >
                  {isCreating ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating District...
                    </div>
                  ) : (
                    "Create District"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDistrict;
