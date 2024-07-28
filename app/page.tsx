import { Login } from "@/components/auth/login";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex h-full justify-center items-center bg-slate-100">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-center">Welcome to Noch</h1>
        <p className="text-center">
          Noch is a user management application that allows you to manage your
          contacts with ease.
        </p>
        <p className="text-center">To get started, sign in.</p>
        <div className="flex justify-center">
          <Login>
            <Button className="text-lg">Sign In</Button>
          </Login>
        </div>
      </div>
    </main>
  );
}
