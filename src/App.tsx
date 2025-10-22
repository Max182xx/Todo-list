import { useEffect, useState } from "react";

type Priority = "Urgente" | "Moyenne" | "Basse";
type Todo = {
  id: number;
  text: string;
  priority: Priority;
};

function App() {
  const [input, setInput] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("Moyenne");
  
  // Permet de sauvegarder mes requêtes dans le localStorage.
  const savedTodos = localStorage.getItem("todos")
  const initialTodos = savedTodos ? JSON.parse(savedTodos) : []
  // Vérifie d'abord si une todo est dans le LocalStorage du navigateur
  const [todos , setTodos] = useState<Todo[]>(initialTodos)

  //Permet de mettre à jour automatiquement les todos et de créer un tableau de todos dans le localStorage.
  useEffect(()=> {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  function addTodo() {
    if (input.trim() == "") {
      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
      priority: priority
    };

    const newTodos = [newTodo, ...todos]
    setTodos(newTodos)
    setInput("")
    setPriority("Moyenne")
    console.log(newTodos)
  }

  return (
    <div className=" flex justify-center">
      <div className="w-2/3 flex-col gap-4 my-15 base-300 p-5 rounded-2xl">
        <div className="flex gap-4 ">
          <input
            type="text"
            className="input w-full"
            placeholder="Ajouter une tâche..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <select
            className="select w-full"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="Urgente">Urgente</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Basse">Basse</option>
          </select>

          <button onClick={addTodo} className="btn btn-primary">
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
