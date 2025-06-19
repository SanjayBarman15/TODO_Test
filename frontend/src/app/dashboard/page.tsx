"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, LogOut, User } from "lucide-react";

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  description?: string;
}

interface UserInfo {
  name: string;
  email: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
    } else {
      fetchUser(token);
      fetchTodos(token);
    }
  }, [router]);

  const fetchTodos = async (token: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch todos");
      setTodos(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch user");
      setUser(data.user);
    } catch {
      setUser(null);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setAddLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTodo, description: newDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add todo");
      setTodos((prev) => [...prev, data]);
      setNewTodo("");
      setNewDescription("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add todo");
    } finally {
      setAddLoading(false);
    }
  };

  const toggleTodo = async (id: string) => {
    const token = localStorage.getItem("token");
    const todo = todos.find((t) => t._id === id);
    if (!todo) return;
    try {
      const res = await fetch(`${API_URL}/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update todo");
      setTodos((prev) => prev.map((t) => (t._id === id ? data : t)));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update todo");
    }
  };

  const deleteTodo = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/todos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete todo");
      }
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete todo");
    }
  };

  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = totalCount - completedCount;

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-grey-50`}>
      {/* Header */}
      <header className="bg-white border-b border-grey-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-grey-800">
                Todo Dashboard
              </h1>
              <p className="text-sm text-grey-600">
                Welcome back {user ? ` ${user.name}` : ""}!
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="border-grey-300 text-grey-700 hover:bg-grey-5 hover:cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Stats Cards */}
          <Card className="border-grey-200">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {totalCount}
                </div>
                <p className="text-sm text-grey-600">Total Tasks</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-grey-200">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {completedCount}
                </div>
                <p className="text-sm text-grey-600">Completed</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-grey-200">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {pendingCount}
                </div>
                <p className="text-sm text-grey-600">Pending</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Todo Form */}
        <Card className="mt-6 border-grey-200 rounded-lg shadow-sm">
          <CardHeader>
            <CardTitle className="text-grey-800">Add New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={handleAddTodo}>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="newTodo"
                  className="text-grey-700 font-medium mb-1"
                >
                  Task Title
                </Label>
                <Input
                  id="newTodo"
                  type="text"
                  placeholder="Enter a new task..."
                  className="border border-grey-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  disabled={addLoading}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="newTodoDescription"
                  className="text-grey-700 font-medium mb-1"
                >
                  Description (Optional)
                </Label>
                <textarea
                  id="newTodoDescription"
                  placeholder="Add more details about this task..."
                  className="w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 resize-none transition"
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  disabled={addLoading}
                />
              </div>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md w-full sm:w-auto mt-2"
                disabled={addLoading}
              >
                <Plus className="w-4 h-4 mr-2" />
                {addLoading ? "Adding..." : "Add Task"}
              </Button>
            </form>
            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          </CardContent>
        </Card>

        {/* Todo List */}
        <Card className="mt-6 border-grey-200">
          <CardHeader>
            <CardTitle className="text-grey-800">Your Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {todos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-grey-500">
                  No tasks yet. Add one above to get started!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {todos.map((todo) => (
                  <div
                    key={todo._id}
                    className="p-4 rounded-lg border border-grey-200 hover:bg-grey-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo._id)}
                        className="rounded border-grey-300 text-blue-600 focus:ring-blue-500 mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-medium ${
                            todo.completed
                              ? "text-grey-500 line-through"
                              : "text-grey-800"
                          }`}
                        >
                          {todo.title}
                        </h3>
                        {todo.description && (
                          <p
                            className={`text-sm mt-1 ${
                              todo.completed
                                ? "text-grey-400 line-through"
                                : "text-grey-600"
                            }`}
                          >
                            {todo.description}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteTodo(todo._id)}
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
