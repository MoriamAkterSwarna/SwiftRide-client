
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Trash2 } from "lucide-react";

import { useGetRideTypesQuery } from "@/redux/features/ride/ride.api";
import { AddRideTypeModal } from "./AddRideTypeModal";
const AddRideType = () => {

  const {data} = useGetRideTypesQuery(undefined)
  
  // console.log(data)

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
             <TableHead className="w-[100px]">Name</TableHead>
             <TableHead className="text-right">Action</TableHead>
           </TableRow>
         </TableHeader>
         <TableBody>
           {data?.data?.map((item:any) => (
             <TableRow>
               <TableCell className="font-medium w-full">
                 {item?.rideVehicle}
               </TableCell>
               <TableCell>
                 <Button size="sm">
                   <Trash2 />
                 </Button>
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