/* eslint-disable react-hooks/incompatible-library */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useEffect } from "react";
import { Upload, Sparkles, BadgeCheck } from "lucide-react";
import { useCreateDivisionMutation } from "@/redux/features/division/division.api";

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
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;
  const nameValue = watch("name");
  const thumbnailFile = watch("thumbnail")?.[0];

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
    <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-10 font-body">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-blue-200/50 to-cyan-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-12 h-72 w-72 rounded-full bg-gradient-to-br from-amber-200/40 to-rose-200/30 blur-3xl" />

      <div className="rounded-[32px] bg-gradient-to-br from-blue-500 to-indigo-600 p-[1px] shadow-2xl">
        <div className="rounded-[30px] bg-white/95 backdrop-blur dark:bg-slate-900/95">
          <div className="flex flex-col gap-4 border-b border-slate-200/70 px-8 py-7 dark:border-slate-800/70 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                  Admin Console
                </p>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Create Division
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <BadgeCheck className="h-4 w-4 text-emerald-500" />
              Slug auto-generates from name
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-8 py-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Division Name
                </label>
                <select
                  {...register("name")}
                  className="h-12 w-full rounded-xl border border-slate-200/70 bg-slate-50/70 px-4 text-slate-900 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700/70 dark:bg-slate-800/50 dark:text-white dark:focus:ring-blue-500/30"
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
                    <option key={division} value={division} className="dark:bg-slate-900">
                      {division}
                    </option>
                  ))}
                </select>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  URL Slug
                </label>
                <input
                  placeholder="e.g. dhaka"
                  readOnly
                  {...register("slug")}
                  className="h-12 w-full rounded-xl border border-slate-200/70 bg-slate-50/70 px-4 text-slate-900 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700/70 dark:bg-slate-800/50 dark:text-white dark:focus:ring-blue-500/30"
                />
                {errors.slug && (
                  <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-[1.3fr_0.7fr]">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  placeholder="Tell us more about this division..."
                  rows={6}
                  {...register("description")}
                  className="w-full rounded-xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 text-slate-900 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700/70 dark:bg-slate-800/50 dark:text-white dark:focus:ring-blue-500/30"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Thumbnail
                </label>
                <label className="flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 text-slate-600 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-blue-950/30">
                  <Upload className="h-6 w-6" />
                  <span className="text-sm font-medium">Upload image</span>
                  <span className="text-xs text-slate-500">PNG, JPG up to 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    {...register("thumbnail")}
                    className="hidden"
                  />
                </label>
                {thumbnailFile && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-slate-200/70 dark:border-slate-700/70">
                    <img
                      src={URL.createObjectURL(thumbnailFile)}
                      alt="Preview"
                      className="h-28 w-full object-cover"
                    />
                  </div>
                )}
                {errors.thumbnail && errors.thumbnail.message && (
                  <p className="mt-1 text-sm text-red-500">
                    {String(errors.thumbnail.message)}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isCreating}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-60"
              >
                {isCreating ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating Division...
                  </>
                ) : (
                  "Create Division"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDivision;
