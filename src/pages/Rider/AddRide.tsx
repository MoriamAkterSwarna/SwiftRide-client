/* eslint-disable react-hooks/incompatible-library */
import { useForm, type Resolver } from "react-hook-form";
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
import {
  useCreateRideMutation,
  useGetRideTypesQuery,
} from "@/redux/features/ride/ride.api";
import { useGetDistrictsQuery } from "@/redux/features/district/district.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const rideSchema = z.object({
  from: z.string().min(1, "Origin is required"),
  to: z.string().min(1, "Destination is required"),
  rideType: z.string().min(1, "Vehicle type is required"),
  departureTime: z.string().min(1, "Departure time is required"),
  availableSeats: z.coerce.number().min(1, "At least 1 seat must be available"),
  price: z.coerce.number().min(0, "Price must be positive"),
  description: z.string().optional(),
});

type RideFormValues = z.infer<typeof rideSchema>;

const AddRide = () => {
  const [createRide, { isLoading: isCreating }] = useCreateRideMutation();
  const { data: districtsData, isLoading: isLoadingDistricts } =
    useGetDistrictsQuery();
  const { data: rideTypesData, isLoading: isLoadingRideTypes } =
    useGetRideTypesQuery();

  const form = useForm<RideFormValues>({
    resolver: zodResolver(rideSchema) as unknown as Resolver<RideFormValues>,
    defaultValues: {
      from: "",
      to: "",
      rideType: "",
      departureTime: "",
      availableSeats: 1,
      price: 0,
      description: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = form;

  const onSubmit = async (data: RideFormValues) => {
    try {
      if (data.from === data.to) {
        toast.error("Origin and Destination cannot be the same");
        return;
      }

      const result = await createRide(data).unwrap();
      if (result.success) {
        toast.success("Ride created successfully!");
        reset();
      }
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to create ride");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card className="border-none shadow-xl bg-linear-to-br from-card to-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Offer a Ride
          </CardTitle>
          <CardDescription>
            Share your journey and earn by offering a ride to others.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Origin */}
              <Field>
                <FieldLabel>From (Origin)</FieldLabel>
                <FieldContent>
                  <Select
                    onValueChange={(val) => form.setValue("from", val)}
                    value={watch("from")}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select Origin" />
                    </SelectTrigger>
                    <SelectContent>
                      {districtsData?.data?.map((district) => (
                        <SelectItem key={district._id} value={district._id}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isLoadingDistricts && (
                    <p className="text-xs text-muted-foreground">
                      Loading districts...
                    </p>
                  )}
                  <FieldError errors={[errors.from]} />
                </FieldContent>
              </Field>

              {/* Destination */}
              <Field>
                <FieldLabel>To (Destination)</FieldLabel>
                <FieldContent>
                  <Select
                    onValueChange={(val) => form.setValue("to", val)}
                    value={watch("to")}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select Destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {districtsData?.data?.map((district) => (
                        <SelectItem key={district._id} value={district._id}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[errors.to]} />
                </FieldContent>
              </Field>

              {/* Ride Type */}
              <Field>
                <FieldLabel>Vehicle Type</FieldLabel>
                <FieldContent>
                  <Select
                    onValueChange={(val) => form.setValue("rideType", val)}
                    value={watch("rideType")}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select Vehicle Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {rideTypesData?.data?.map((type) => (
                        <SelectItem key={type._id} value={type._id}>
                          {type.name} ({type.rideVehicle})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isLoadingRideTypes && (
                    <p className="text-xs text-muted-foreground">
                      Loading ride types...
                    </p>
                  )}
                  <FieldError errors={[errors.rideType]} />
                </FieldContent>
              </Field>

              {/* Departure Time */}
              <Field>
                <FieldLabel>Departure Time</FieldLabel>
                <FieldContent>
                  <Input
                    type="datetime-local"
                    {...form.register("departureTime")}
                    className="h-11 justify-center"
                  />
                  <FieldError errors={[errors.departureTime]} />
                </FieldContent>
              </Field>

              {/* Available Seats */}
              <Field>
                <FieldLabel>Available Seats</FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    min={1}
                    placeholder="e.g. 3"
                    {...form.register("availableSeats")}
                    className="h-11"
                  />
                  <FieldError errors={[errors.availableSeats]} />
                </FieldContent>
              </Field>

              {/* Price */}
              <Field>
                <FieldLabel>Price per Person (Tk)</FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    min={0}
                    placeholder="e.g. 500"
                    {...form.register("price")}
                    className="h-11"
                  />
                  <FieldError errors={[errors.price]} />
                </FieldContent>
              </Field>
            </div>

            {/* Description */}
            <Field>
              <FieldLabel>Description / Notes (Optional)</FieldLabel>
              <FieldContent>
                <Textarea
                  placeholder="Additional details about your ride (e.g., meeting point, restrictions)..."
                  {...form.register("description")}
                  className="min-h-24 resize-none"
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
                    Creating Ride...
                  </div>
                ) : (
                  "Create Ride"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddRide;
