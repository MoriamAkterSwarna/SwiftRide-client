/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateRideTypeMutation } from "@/redux/features/ride/ride.api";

import { useForm } from "react-hook-form";
import { toast } from "sonner";

const vehicleTypes = {
    CAR: 'Car',
    BIKE: 'Bike',
    VAN: 'Van',
    BUS: 'Bus'
};

const placeTypes = {
    PRIVATE_PLACE : "Private Place",
    PUBLIC_PLACE : "Public Place",
    INSIDE_CITY : "Inside City",
    OUTSIDE_CITY : "Outside City",
    AIRPORT : "Airport"
}



export function AddRideTypeModal() {
    const form = useForm({
        defaultValues: {
            rideVehicle: '',
            placeType: '',
            totalGuest: 2,

        }
    });
    const [createRideType] = useCreateRideTypeMutation();
    console.log(createRideType)

    const onSubmit = async (data: any) => {
        const res = await createRideType({
            rideVehicle: data.rideVehicle,
            placeType: data.placeType,
            totalGuest: Number(data.totalGuest),

        });

        // console.log(res);
        if (res.data?.success) {
            toast.success("Ride Type Added");
            form.reset();
        }
    };

    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button>Add Ride Type</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-106.25">
                    <DialogHeader>
                        <DialogTitle>Add Ride Type</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form id="add-ride-type" onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="space-y-4 ">
                                <FormField
                                    control={form.control}
                                    name="rideVehicle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ride Vehicle</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-92.5">
                                                        <SelectValue placeholder="Select a vehicle type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.values(vehicleTypes).map((vehicle) => (
                                                        <SelectItem key={vehicle} value={vehicle}>
                                                            {vehicle}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="placeType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Place Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-92.5">
                                                        <SelectValue placeholder="Select a place type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.values(placeTypes).map((type) => (
                                                        <SelectItem key={type} value={type}>
                                                            {type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="totalGuest"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Total Guests</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    placeholder="Number of guests"
                                                    {...field}
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>
                        </form>
                    </Form>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" form="add-ride-type">
                            Save changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}