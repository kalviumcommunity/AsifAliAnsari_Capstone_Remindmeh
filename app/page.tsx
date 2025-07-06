"use client"

import type React from "react"
import { Navigation } from "@/components/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Check, Moon, Sun, AlertCircleIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Habit {
  id: string
  name: string
  description?: string
  createdAt: string
  checkIns: string[] // Array of dates in YYYY-MM-DD format
  color: string
}

const HABIT_COLORS = [
  {
    name: "High Priority",
    value: "red",
    light: "bg-red-500",
    dark: "bg-red-600",
    lightBg: "bg-red-50",
    darkBg: "bg-red-950",
  },
  {
    name: "Medium Priority",
    value: "orange",
    light: "bg-orange-500",
    dark: "bg-orange-600",
    lightBg: "bg-orange-50",
    darkBg: "bg-orange-950",
  },
  {
    name: "Low Priority",
    value: "green",
    light: "bg-green-500",
    dark: "bg-green-600",
    lightBg: "bg-green-50",
    darkBg: "bg-green-950",
  },
]

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [habitName, setHabitName] = useState("")
  const [habitDescription, setHabitDescription] = useState("")
  const [selectedColor, setSelectedColor] = useState("red")
  const [darkMode, setDarkMode] = useState(false)

  // Load habits from localStorage on component mount
  useEffect(() => {
    const savedHabits = localStorage.getItem("habits")
    if (savedHabits) {
      const parsedHabits = JSON.parse(savedHabits)
      // Add default color to existing habits that don't have one
      const habitsWithColors = parsedHabits.map((habit: any) => ({
        ...habit,
        color: habit.color || "blue",
      }))
      setHabits(habitsWithColors)
    }

    // Check for dark mode preference
    const savedDarkMode = localStorage.getItem("darkMode")
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode))
    }
  }, [])

  // Save habits to localStorage whenever habits change
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits))
  }, [habits])

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!habitName.trim()) return

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: habitName.trim(),
      description: habitDescription.trim() || undefined,
      createdAt: new Date().toISOString(),
      checkIns: [],
      color: selectedColor,
    }

    setHabits([...habits, newHabit])
    setHabitName("")
    setHabitDescription("")
    setSelectedColor("red")
  }

  const toggleCheckIn = (habitId: string) => {
    const today = new Date().toISOString().split("T")[0]

    setHabits(
      habits.map((habit) => {
        if (habit.id === habitId) {
          const isCheckedToday = habit.checkIns.includes(today)
          const updatedCheckIns = isCheckedToday
            ? habit.checkIns.filter((date) => date !== today)
            : [...habit.checkIns, today]

          return { ...habit, checkIns: updatedCheckIns }
        }
        return habit
      }),
    )
  }

  const calculateStreak = (checkIns: string[]): number => {
    if (checkIns.length === 0) return 0

    const sortedDates = checkIns.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    const today = new Date().toISOString().split("T")[0]

    let streak = 0
    const currentDate = new Date()

    // Check if today is included in check-ins
    if (sortedDates[0] === today) {
      streak = 1
      currentDate.setDate(currentDate.getDate() - 1)
    } else if (sortedDates[0] === new Date(currentDate.getTime() - 24 * 60 * 60 * 1000).toISOString().split("T")[0]) {
      // If yesterday was the last check-in, start counting from yesterday
      streak = 1
      currentDate.setDate(currentDate.getDate() - 2)
    } else {
      return 0
    }

    // Count consecutive days
    for (let i = sortedDates[0] === today ? 1 : 0; i < sortedDates.length; i++) {
      const expectedDate = currentDate.toISOString().split("T")[0]
      if (sortedDates[i] === expectedDate) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return streak
  }

  const isCheckedToday = (checkIns: string[]): boolean => {
    const today = new Date().toISOString().split("T")[0]
    return checkIns.includes(today)
  }

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter((habit) => habit.id !== habitId))
  }

  const getColorClasses = (colorValue: string) => {
    const color = HABIT_COLORS.find((c) => c.value === colorValue) || HABIT_COLORS[0]
    return color
  }

  const getStreakBadgeClasses = (colorValue: string, streak: number) => {
    const color = getColorClasses(colorValue)
    if (streak > 0) {
      return `${color.lightBg} ${color.darkBg} text-${colorValue}-800 dark:text-${colorValue}-200 border-${colorValue}-200 dark:border-${colorValue}-800`
    }
    return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-600"
  }

  const getCheckButtonClasses = (colorValue: string, isChecked: boolean) => {
    const color = getColorClasses(colorValue)
    if (isChecked) {
      return `${color.light} hover:${color.dark} text-white border-transparent`
    }
    return "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
  }

  const formatCreationDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      return `Created today at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    } else if (diffInDays === 1) {
      return `Created yesterday at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    } else if (diffInDays < 7) {
      return `Created ${diffInDays} days ago`
    } else {
      return `Created on ${date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      })}`
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark" : ""}`}>
      <Navigation currentPage="home" />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="flex justify-center items-center mb-8">
            <h1 className="text-gray-900 dark:text-white font-mono font-black text-5xl">RemindMeh!</h1>
          </div>

          {/* Add Habit Form */}
          <Card className="mb-8 shadow-lg border-0 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <AlertCircleIcon className="h-5 w-5" />
                Add a New Reminder
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400 font-mono">
                Create a new reminder:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addHabit} className="space-y-6">
                <div>
                  <Input
                    type="text"
                    placeholder="Habit name (e.g., Drink 8 glasses of water)"
                    value={habitName}
                    onChange={(e) => setHabitName(e.target.value)}
                    className="dark:bg-gray-700 dark:border-gray-600 opacity-45 bg-slate-300 border-black"
                    required
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Description (optional)"
                    value={habitDescription}
                    onChange={(e) => setHabitDescription(e.target.value)}
                    className="dark:bg-gray-700 dark:border-gray-600 resize-none bg-slate-200 border-slate-600"
                    rows={3}
                  />
                </div>

                {/* Priority Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Choose priority level
                  </label>
                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger className="w-full dark:bg-gray-700 dark:border-gray-600 bg-slate-50 border-slate-300">
                      <SelectValue placeholder="Select priority level" />
                    </SelectTrigger>
                    <SelectContent>
                      {HABIT_COLORS.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${color.light}`} />
                            <span>{color.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Habit
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Habits List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.length === 0 ? (
              <div className="col-span-full">
                <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      No habits yet. Add your first habit above!
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              habits.map((habit) => {
                const streak = calculateStreak(habit.checkIns)
                const checkedToday = isCheckedToday(habit.checkIns)
                const colorClasses = getColorClasses(habit.color)

                return (
                  <Card
                    key={habit.id}
                    className="shadow-lg border-0 bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-200 h-fit relative overflow-hidden"
                  >
                    {/* Color accent bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${colorClasses.light}`} />

                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Header with title and streak */}
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
                              {habit.name}
                            </h3>
                            <div className={`w-4 h-4 rounded-full ${colorClasses.light} flex-shrink-0 mt-1`} />
                          </div>
                          <Badge
                            variant="outline"
                            className={`w-fit border ${getStreakBadgeClasses(habit.color, streak)}`}
                          >
                            {streak} day{streak !== 1 ? "s" : ""} streak
                          </Badge>
                        </div>

                        {/* Description */}
                        {habit.description && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">{habit.description}</p>
                        )}

                        {/* Creation date */}
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <div className={`w-2 h-2 rounded-full ${colorClasses.light} opacity-60`} />
                          <span>{formatCreationDate(habit.createdAt)}</span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() => toggleCheckIn(habit.id)}
                            variant="outline"
                            className={`w-full border ${getCheckButtonClasses(habit.color, checkedToday)}`}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            {checkedToday ? "Completed Today" : "Mark as Done"}
                          </Button>

                          <Button
                            onClick={() => deleteHabit(habit.id)}
                            variant="outline"
                            size="sm"
                            className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                          >
                            Delete Habit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </div>
      {/* Sticky Dark Mode Toggle */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setDarkMode(!darkMode)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-100 shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
    </div>
  )
}
