// const Admin = ({ children }: { children: React.ReactNode }) => {
//   return (
//     <div className="h-full flex  justify-center bg-muted/40">{children}</div>
//   );
// };

// export default Admin;

const Admin = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-muted/40 p-4">{children}</div>
  );
};

export default Admin;
