import { auth } from "@/auth";

const Check = async () => {
  const session = await auth();
  return <div>{JSON.stringify(session)}</div>;
};
export default Check;
