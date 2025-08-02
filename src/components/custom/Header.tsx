"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { navItems } from "@/data/data";
import { CiMenuBurger } from "react-icons/ci";

const Header = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-up");
    }
  }, [isLoaded, user, router]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!isLoaded) return null;

  return (
    <header className="fixed top-0 left-0 w-full z-[1000] bg-white">
      <div className="px-4 lg:px-8 h-16 flex items-center justify-between max-w-7xl mx-auto">
      
        <Link href="/" className="flex items-center gap-2">
          <span className="font-extrabold font-sans text-2xl md:text-3xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            VisionForge
          </span>
        </Link>

        <nav className="hidden md:flex gap-6 items-center">
          {navItems.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base md:text-lg font-medium text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}

          <SignedOut>
            <SignInButton>
              <Button
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox:
                    "h-9 w-9 hover:border-2 hover:border-purple-600 rounded-full transition-all",
                },
              }}
            />
          </SignedIn>
        </nav>

        <div className="md:hidden">
          <Button
            className="p-2"
            variant="ghost"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <CiMenuBurger className="w-6 h-6 text-gray-700" />
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999]"
          onClick={toggleMobileMenu}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full bg-white w-72 max-w-sm shadow-xl z-[1000] transform ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300`}
      >
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200">
          <span className="text-xl font-bold text-gray-900">Menu</span>
          <Button
            className="text-gray-500 hover:text-gray-900 p-2"
            variant="ghost"
            onClick={toggleMobileMenu}
            aria-label="Close menu"
          >
            ✕
          </Button>
        </div>

        <nav className="flex flex-col gap-1 px-6 py-4">
          {navItems.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-2 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
              onClick={toggleMobileMenu}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <SignedOut>
            <SignInButton>
              <Button className="w-full" variant="default">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-3">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-10 w-10",
                  },
                }}
              />
              <span className="text-gray-800 font-medium">
                {user?.firstName || "My Account"}
              </span>
            </div>

          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Header;