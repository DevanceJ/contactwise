// export const EditButton = ({ onClick }: { onClick: () => void }) => {
//     return (
//         <Dialog>
//           <DialogTrigger asChild>
//             <Button
//               variant="ghost"
//               onClick={() => openModal(tenant)}>
//               <Edit className="h-4 w-4" />
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[425px]">
//             <DialogHeader>
//               <DialogTitle>Edit Organization</DialogTitle>
//               <DialogDescription>
//                 Make changes to the organization details here. Click
//                 save when you&apos;re done.
//               </DialogDescription>
//             </DialogHeader>
//             <Form {...form}>
//               <form
//                 onSubmit={form.handleSubmit(onSubmit)}
//                 className="space-y-6">
//                 <div className="space-y-4">
//                   <FormField
//                     control={form.control}
//                     name="name"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Name</FormLabel>
//                         <FormControl>
//                           <Input
//                             {...field}
//                             disabled={form.formState.isSubmitting}
//                             placeholder="HR Tenant"
//                             type="text"
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="description"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Description</FormLabel>
//                         <FormControl>
//                           <Input
//                             {...field}
//                             disabled={form.formState.isSubmitting}
//                             placeholder="This tenant is for the HR Team"
//                             type="text"
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//                 {/* <FormErr message={error} /> */}
//                 {/* <FormSuc message={success} /> */}
//                 <DialogFooter>
//                   <Button
//                     disabled={form.formState.isSubmitting}
//                     type="submit"
//                     className="w-full">
//                     Save changes
//                   </Button>
//                 </DialogFooter>
//               </form>
//             </Form>
//           </DialogContent>
//         </Dialog>
//       )
// }
