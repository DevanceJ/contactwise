"use client";
import { Button } from "../ui/button";
import Link from "next/link";
interface BackButtonProps {
  label: string;
  href: string;
}
export const BackButton = ({ label, href }: BackButtonProps) => {
  return (
    <Button
      variant={"link"}
      className={" mx-auto font-normal"}
      size={"sm"}
      asChild
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};
