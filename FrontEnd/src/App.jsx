import React, { useEffect, useState } from "react";
import axios from 'axios';
import toast from 'react-hot-toast'

function App() {

  const BASE_URL = 'http://localhost:5001'
   const [todos, setTodos] = useState([])
  
  const getTodo = async () =>{
   const res= await axios(`${BASE_URL}/api/v1/todos`)
   const todosFromSer = res?.data?.data
   console.log('todosFromSer',todos)

   const newnew = todosFromSer.map((todo)=>{
    return{ ...todo,isEditing:false}
   })

   setTodos(newnew)
  }

  useEffect(()=>{
    getTodo()
  },[])

  const addTodo = async (event)=>{
    try{
      event.preventDefault()
      const todoValue = event.target.children[0].value
   await axios.post(`${BASE_URL}/api/v1/todo`,
    {
      "todo":todoValue
    }
   )
   getTodo()
   event.target.reset()
    }catch(err){

    }
  }
  
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

  const deleteTodo =async (todoId)=>{
    try {
      console.log('todoId',todoId);

    const res = await axios.delete(`${BASE_URL}/api/v1/todo/${todoId}`)

    toast(res.data?.message);
    getTodo()
  } 
   
    catch (error) {
      toast.error(err?.response?.data?.message || "unknown errorrr");
    }
   
  };
 

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-700 mb-6 text-center">
          Todo App
        </h1>
        <form
        onSubmit={addTodo}
        className="flex space-x-2 mb-6">
          <input
            type="text"

            placeholder="Enter a task"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Add
          </button>
        </form>


          {!todos?.length && "todo nhi hy"}

          <ul className="space-y-3">

          {todos?.map((todo,index)=>(
          <li key={todo.id} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
            {!todo.isEditing ?<span className="text-gray-700">{todo.todoContent} </span>
          : 
          <form
                  onSubmit={(e) => editTodo(e, todo.id)}
                  className="flex justify-between"
                >
                  <input
                    type="text"
                    defaultValue={todo.todoContent}
                    className="border border-gray-400"
                  />
                  <div >
                  <button
                    onClick={() => {
                      const newTodos = todos.map((todo, i) => {
                        todo.isEditing = false;
                        return todo;
                      });
                      setTodos([...newTodos]);
                    }}
                    type="button"
                    className=" text-red-600  p-2"
                  >
                    cancel
                  </button>
                  <button type="submit" className=" text-blue-600  ">Save</button>
                  </div>
                </form>
         
             } 
             <div>
                    
            {!todo.isEditing ?<button onClick={()=>{ const newtodos = todos.map((todo,i) => {
              if (i === index){
                todo.isEditing=true
              }else{
                todo.isEditing =false
              }
              return todo
            })        ;
            [index].isEditing = true; 
            setTodos([...newtodos])}} className="text-blue-500 p-2  hover:text-blue-600">Edit</button> 
            :
            null}
            {!todo.isEditing ?<button onClick={()=>deleteTodo (todo.id)} className="text-red-500 hover:text-red-600">Delete</button>
            :null } 
              </div>
          </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

