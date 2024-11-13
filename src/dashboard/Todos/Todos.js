import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../config/firebase/firebaseconfig"; // Import Firebase auth and Firestore
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Todos() {
  const navigate = useNavigate();

  // State for todos, new task, editing, and user
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editTask, setEditTask] = useState({ id: null, task: "" });
  const [user, setUser] = useState(null);

  // Fetch the logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchTodos(currentUser.uid); // Fetch todos for the logged-in user
      } else {
        navigate("/login"); // Redirect to login if not logged in
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Fetch todos for the logged-in user
  const fetchTodos = async (userId) => {
    try {
      const todosRef = collection(db, "todos");
      const q = query(todosRef, where("uid", "==", userId));
      const querySnapshot = await getDocs(q);

      const fetchedTodos = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLoading(false);
      setTasks(fetchedTodos);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // Add a new todo
  const addTask = async () => {
    if (newTask.trim()) {
      try {
        const todosRef = collection(db, "todos");
        const newTodo = {
          task: newTask,
          completed: false,
          uid: user.uid,
        };

        const docRef = await addDoc(todosRef, newTodo);
        setTasks([...tasks, { id: docRef.id, ...newTodo }]);
        setNewTask(""); // Clear input field
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (taskId, currentStatus) => {
    try {
      const taskDoc = doc(db, "todos", taskId);
      await updateDoc(taskDoc, { completed: !currentStatus });

      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !currentStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    try {
      const taskDoc = doc(db, "todos", taskId);
      await deleteDoc(taskDoc);

      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Enable edit mode
  const enableEdit = (taskId, currentTask) => {
    setEditTask({ id: taskId, task: currentTask });
  };

  // Save edited task
  const saveEditTask = async () => {
    if (editTask.task.trim()) {
      try {
        const taskDoc = doc(db, "todos", editTask.id);
        await updateDoc(taskDoc, { task: editTask.task });

        setTasks(
          tasks.map((task) =>
            task.id === editTask.id ? { ...task, task: editTask.task } : task
          )
        );
        setEditTask({ id: null, task: "" }); // Exit edit mode
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };


  const [loading, setLoading] = useState(true);
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <p className="text-gray-600 text-lg">Loading...</p>
  </div>
  }
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Top Navbar */}
      <nav className="bg-gray-800 text-white p-4">
        <h2 className="text-4xl text-center font-semibold">Todos</h2>
      </nav>

      {/* Todo List */}
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {/* Input to add new task */}
          <div className="flex mb-6">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter a new task"
              className="p-2 w-full border border-gray-300 rounded-lg"
            />
            <button
              onClick={addTask}
              className="ml-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              Add Task
            </button>
          </div>

          {/* Task List */}
          <ul className="space-y-4 overflow-y-scroll max-h-[400px]">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`flex items-center justify-between p-4 rounded-lg shadow-sm ${
                  task.completed ? "bg-green-100" : "bg-white"
                }`}
              >
                <div className="flex items-center">
                  {/* Checkbox to mark task as complete */}
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id, task.completed)}
                    className="mr-4"
                  />
                  {editTask.id === task.id ? (
                    // Edit Mode Input
                    <input
                      type="text"
                      value={editTask.task}
                      onChange={(e) =>
                        setEditTask({ ...editTask, task: e.target.value })
                      }
                      className="border border-gray-300 rounded-lg p-1"
                    />
                  ) : (
                    <span
                      className={`text-lg ${
                        task.completed ? "line-through" : ""
                      }`}
                    >
                      {task.task}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {editTask.id === task.id ? (
                    <button
                      onClick={saveEditTask}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => enableEdit(task.id, task.task)}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
