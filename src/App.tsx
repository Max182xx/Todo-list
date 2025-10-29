import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
import { Construction } from "lucide-react";

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
  const savedTodos = localStorage.getItem("todos");
  const initialTodos = savedTodos ? JSON.parse(savedTodos) : [];
  // Vérifie d'abord si une todo est dans le LocalStorage du navigateur
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  const [filter, setFilter] = useState<Priority | "Tous">("Tous");

  //Permet de mettre à jour automatiquement les todos et de créer un tableau de todos dans le localStorage.
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function addTodo() {
    if (input.trim() == "") {
      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
      priority: priority,
    };

    const newTodos = [newTodo, ...todos];
    setTodos(newTodos);
    setInput("");
    setPriority("Moyenne");
    console.log(newTodos);
  }

  // Filtrage des tâches en fonction de la priorité sélectionnée
  let filteredTodos: Todo[] = [];

  if (filter === "Tous") {
    // Retourne toutes les tâches si le filtre est défini sur "Tous"
    filteredTodos = todos;
  } else {
    // Retourne uniquement les tâches ayant la priorité correspondante au filtre sélectionné
    filteredTodos = todos.filter((todo) => todo.priority === filter);
  }

  const urgentCount = todos.filter((t) => t.priority === "Urgente").length;
  const mediumCount = todos.filter((t) => t.priority === "Moyenne").length;
  const lowCount = todos.filter((t) => t.priority === "Basse").length;
  const totalCount = todos.length;

  function deleteTodo(id: number) {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  }

  const [selectedTodos, setSelectedTodos] = useState<Set<number>>(new Set());

  // Gère la sélection et la désélection des tâches (todos)
  function toggleSelectedTodo(id: number) {
    const newSelected = new Set(selectedTodos);

    // Vérifie si l'id donné est déjà dans le set et inverse sa présence
    if (newSelected.has(id)) {
      // Si présent, supprime l'id du set (désélectionne la tâche)
      newSelected.delete(id);
    } else {
      // Si absent, ajoute l'id au set (sélectionne la tâche)
      newSelected.add(id);
    }

    // Met à jour l'état global avec le nouveau set de tâches sélectionnées
    setSelectedTodos(newSelected);
  }

  // Supprimer toutes les tâches sélectionnées
  function finishSelected() {
    // Crée un nouveau tableau contenant uniquement les tâches non sélectionnées
    const newTodos = todos.filter((todo) => {
      // Si la tâche est dans selectedTodos, elle est considérée comme sélectionnée
      if (selectedTodos.has(todo.id)) {
        return false; // Exclure cette tâche du résultat
      } else {
        return true; // Inclure cette tâche dans le résultat
      }
    });

    // Met à jour l'état global avec le nouveau tableau de tâches
    setTodos(newTodos);

    // Vide le set des tâches sélectionnées
    setSelectedTodos(new Set());
  }

  return (
    <div className=" flex justify-center">
      <div className="w-2/3 flex flex-col gap-4 my-15 bg-base-300 p-5 rounded-2xl">
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

        <div className="space-y-2 flex-1 h-fit">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-4">
              {/** Bouton pour filtrer les taches */}
              <button
                className={`btn btn-soft ${
                  filter === "Tous" ? "btn-primary" : ""
                }`}
                onClick={() => setFilter("Tous")}
              >
                Tous({totalCount})
              </button>

              <button
                className={`btn btn-soft ${
                  filter === "Urgente" ? "btn-primary" : ""
                }`}
                onClick={() => setFilter("Urgente")}
              >
                Urgente({urgentCount})
              </button>

              <button
                className={`btn btn-soft ${
                  filter === "Moyenne" ? "btn-primary" : ""
                }`}
                onClick={() => setFilter("Moyenne")}
              >
                Moyenne({mediumCount})
              </button>

              <button
                className={`btn btn-soft ${
                  filter === "Basse" ? "btn-primary" : ""
                }`}
                onClick={() => setFilter("Basse")}
              >
                Basse({lowCount})
              </button>
            </div>

            <button
              className="btn btn-primary"
              onClick={finishSelected}
              disabled={selectedTodos.size == 0}
            >
              Finir la selection ({selectedTodos.size})
            </button>
          </div>

          {filteredTodos.length > 0 ? (
            <ul className="divide-y divide-primary/20">
              {filteredTodos.map((todo) => (
                <li key={todo.id}>
                  <TodoItem
                    todo={todo}
                    isSelected={selectedTodos.has(todo.id)}
                    onDelete={() => deleteTodo(todo.id)}
                    onToggleSelect={toggleSelectedTodo}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex justify-center items-center flex-col p-5">
              <div>
                <Construction
                  strokeWidth={1}
                  className="w-40 h-40 text-primary"
                />
              </div>
              <p className="text-sm"> Aucun tâche pour ce filtre </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
