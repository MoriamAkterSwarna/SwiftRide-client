/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Trash2 } from "lucide-react";

import { useDeleteRideTypeMutation, useGetRideTypesQuery } from "@/redux/features/ride/ride.api";
import { AddRideTypeModal } from "./AddRideTypeModal";
import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import { toast } from "sonner";
const AddRideType = () => {

  const {data} = useGetRideTypesQuery(undefined)

  const [deleteRideType] = useDeleteRideTypeMutation();
  
  // console.log(data)


  const handleRemoveRideType = async (id:string) => {
    const toastId = toast.loading("Deleting Ride Type...")
    try {
      const res = await deleteRideType(id).unwrap();
      if(res?.success){
        toast.success("Ride Type Deleted Successfully", {id: toastId})
      }
    } catch (error:any) {
      toast.error(error?.data?.message || "Failed to delete ride type", {id: toastId})
    }
  }

 return (
   <div className="w-full max-w-7xl mx-auto px-5">
     <div className="flex justify-between my-8">
       <h1 className="text-xl font-semibold">Tour Types</h1>
       <AddRideTypeModal/>
     </div>
     <div className="border border-muted rounded-md">
       <Table>
         <TableHeader>
           <TableRow>
             <TableHead className="w-25">Name</TableHead>
             <TableHead className="text-right">Action</TableHead>
           </TableRow>
         </TableHeader>
         <TableBody>
           {data?.data?.map((item: { _id: string, rideVehicle: string }) => (
             <TableRow key={item?._id}>
               <TableCell className="font-medium w-full">
                 {item?.rideVehicle}
               </TableCell>
               <TableCell>
                 

                 <DeleteConfirmation onConfirm={() => handleRemoveRideType(item?._id)}>
                  <Button size="sm">
                   <Trash2 />
                 </Button>
                 </DeleteConfirmation>
               </TableCell>
             </TableRow>
           ))}
         </TableBody>
       </Table>
     </div>
   </div>
 )
};

export default AddRideType;