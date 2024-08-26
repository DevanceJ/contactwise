"use client";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex h-full justify-center items-center bg-muted/40">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-center">Welcome to Noch</h1>
        <p className="text-center">Noch is a user management application.</p>
        <p className="text-center">To get started, sign in.</p>
        <div className="flex justify-center">
          <Button
            onClick={() => window.location.replace("/auth/login")}
            className="text-lg"
          >
            Sign In
          </Button>
        </div>
      </div>
    </main>
  );
}
