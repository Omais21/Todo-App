import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function App() {
  const BASE_URL = "https://todo-app-back-end-three.vercel.app";

  const [todos, setTodos] = useState([]);

  const getTodo = async () => {
    try {
      const res = await axios(`${BASE_URL}/api/v1/todos`);
      const todosFromServer = res?.data?.data;
     // console.log("todosFromServer ", todosFromServer);

      setTodos(todosFromServer);
    } catch (err) {
      toast.dismiss()
      toast.error(err?.response?.data?.message || "unknown errorrr");
    }
  };

  useEffect(() => {
    getTodo();
  }, []);

  const addTodo = async (event) => {
    try {
      event.preventDefault();

      const todoValue = event.target.children[0].value;

      await axios.post(`${BASE_URL}/api/v1/todo`, {
        todo: todoValue,
      });
      getTodo();

      event.target.reset();
    } catch (err) {
      toast.dismiss()
      toast.error(err?.response?.data?.message || "unknown errorrr");
    }
  };

  const editTodo = async (event, todoId) => {
    try {
      event.preventDefault();

      const todoValue = event.target.children[0].value;

      await axios.patch(`${BASE_URL}/api/v1/todo/${todoId}`, {
        todoContent: todoValue,
      });
      getTodo();

      event.target.reset();
    } catch (err) {
      toast.dismiss()
      toast.error(err?.response?.data?.message || "unknown errorrr");
    }
  };

  const deleteTodo = async (todoId) => {
    try {
     // console.log("todoId ", todoId);

      const res = await axios.delete(`${BASE_URL}/api/v1/todo/${todoId}`);

     // console.log("data ", res.data);

      toast(res.data?.message);

      getTodo();
    } catch (err) {
      console.log("mera error", err);

      toast.error(err?.response?.data?.message || "unknown errorrr");
    }
  };

  return (
   <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-200 to-purple-200 flex items-center justify-center p-4">
  <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
    <h1 className="text-4xl font-bold text-indigo-700 text-center mb-8">
      Todo App
    </h1>

    {/* Input Section */}
    <form onSubmit={addTodo} className="mb-6 flex flex-col gap-4">
      <input
        type="text"
        placeholder="Enter your task"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500"
      />
      <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all">
        Add Task
      </button>
    </form>

    {!todos?.length && (
      <p className="text-center text-gray-500 italic">No tasks available.</p>
    )}

    {/* Todo List */}
    <ul className="mt-6 space-y-4">
      {todos?.map((todo, index) => (
        <li
          key={todo._id}
          className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-md hover:bg-gray-100 transition-all duration-200"
        >
          {!todo.isEditing ? (
            <span className="text-gray-700 text-lg">{todo.todoContent}</span>
          ) : (
            <form onSubmit={(e) => editTodo(e, todo._id)} className="flex gap-2">
              <input
                type="text"
                defaultValue={todo.todoContent}
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => {
                  const newTodos = todos.map((todo, i) => {
                    todo.isEditing = false;
                    return todo;
                  });
                  setTodos([...newTodos]);
                }}
                type="button"
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-indigo-600 hover:text-indigo-700"
              >
                Save
              </button>
            </form>
          )}

          <div className="space-x-3">
            {!todo.isEditing && (
              <button
                onClick={() => {
                  const newTodos = todos.map((todo, i) => {
                    if (i === index) {
                      todo.isEditing = true;
                    } else {
                      todo.isEditing = false;
                    }
                    return todo;
                  });
                  setTodos([...newTodos]);
                }}
                className="text-indigo-600 hover:text-indigo-700 focus:outline-none"
              >
                Edit
              </button>
            )}
            {!todo.isEditing && (
              <button
                onClick={() => deleteTodo(todo._id)}
                className="text-red-600 hover:text-red-700 focus:outline-none"
              >
                Delete
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  </div>
</div>

  );
}