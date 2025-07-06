"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, LogIn, UserPlus } from "lucide-react"

interface NavigationProps {
  currentPage?: "home" | "login" | "signup"
}

export function Navigation({ currentPage }: NavigationProps) {
  return (
    <nav className="fixed top-4 right-4 z-50">
      <div className="flex gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2">
        {currentPage !== "home" && (
          <Link href="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
        )}

        {currentPage !== "login" && (
          <Link href="/login">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Login
            </Button>
          </Link>
        )}

        {currentPage !== "signup" && (
          <Link href="/signup">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Sign Up
            </Button>
          </Link>
        )}
      </div>
    </nav>
  )
}
