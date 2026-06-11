import { useState, useEffect, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import socket from "../socket";

const ITEM_TYPE = "TASK";
const COLUMNS = [
  { id: "todo", label: "To Do", color: "bg-night-600" },
  { id: "in-progress", label: "In Progress", color: "bg-electric-600" },
  { id: "done", label: "Done", color: "bg-teal-600" },
];
const PRIORITY_COLORS = { low: "text-green-400", medium: "text-amber-400", high: "text-red-400" };

const TaskCard = ({ task, onMove, onDelete }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id: task._id, status: task.status },
    collect: (m) => ({ isDragging: m.isDragging() }),
  }));

  return (
    <div ref={drag} className={`card p-3 cursor-grab active:cursor-grabbing transition-all ${isDragging ? "opacity-40 scale-95" : "opacity-100"} hover:border-night-500`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-night-100 text-sm font-sans font-medium leading-snug">{task.title}</p>
        <button onClick={() => onDelete(task._id)} className="text-night-500 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      {task.description && <p className="text-night-400 text-xs font-sans mt-1 line-clamp-2">{task.description}</p>}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-night-700">
        <span className={`text-xs font-sans ${PRIORITY_COLORS[task.priority]}`}>
          {task.priority}
        </span>
        {task.assignedTo && (
          <img src={task.assignedTo.avatar} alt={task.assignedTo.name} className="w-5 h-5 rounded-full" title={task.assignedTo.name} />
        )}
      </div>
    </div>
  );
};

const Column = ({ col, tasks, onDrop, onDelete }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item) => { if (item.status !== col.id) onDrop(item.id, col.id); },
    collect: (m) => ({ isOver: m.isOver() }),
  }));

  return (
    <div ref={drop} className={`flex flex-col gap-3 min-h-32 rounded-xl p-3 transition-colors ${isOver ? "bg-night-700" : "bg-night-800"}`}>
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-2 h-2 rounded-full ${col.color}`} />
        <span className="text-night-200 text-xs font-sans font-semibold uppercase tracking-wide">{col.label}</span>
        <span className="text-night-400 text-xs ml-auto">{tasks.length}</span>
      </div>
      {tasks.map((t) => <TaskCard key={t._id} task={t} onDelete={onDelete} />)}
    </div>
  );
};

export default function KanbanBoard({ roomId, user }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "medium" });
  const [showForm, setShowForm] = useState(false);

  const fetchTasks = useCallback(() => {
    axios.get(`/api/tasks/${roomId}`).then((r) => setTasks(r.data));
  }, [roomId]);

  useEffect(() => {
    fetchTasks();
    socket.on("tasks-updated", (updated) => setTasks(updated));
    return () => socket.off("tasks-updated");
  }, [fetchTasks]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    const { data } = await axios.post(`/api/tasks/${roomId}`, newTask);
    const updated = [data, ...tasks];
    setTasks(updated);
    socket.emit("task-update", { roomId, tasks: updated });
    setNewTask({ title: "", description: "", priority: "medium" });
    setShowForm(false);
  };

  const moveTask = async (taskId, newStatus) => {
    const { data } = await axios.put(`/api/tasks/${taskId}`, { status: newStatus });
    const updated = tasks.map((t) => (t._id === taskId ? data : t));
    setTasks(updated);
    socket.emit("task-update", { roomId, tasks: updated });
  };

  const deleteTask = async (taskId) => {
    await axios.delete(`/api/tasks/${taskId}`);
    const updated = tasks.filter((t) => t._id !== taskId);
    setTasks(updated);
    socket.emit("task-update", { roomId, tasks: updated });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b border-night-700 bg-night-800 flex items-center justify-between">
          <h3 className="text-white font-sans font-semibold text-sm flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            Kanban
          </h3>
          <button onClick={() => setShowForm(!showForm)} className="text-electric-400 hover:text-electric-300 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {showForm && (
            <form onSubmit={addTask} className="card p-4 space-y-3 animate-slide-up border-electric-500">
              <input
                className="input text-sm"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
              <input
                className="input text-sm"
                placeholder="Description (optional)"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
              <select
                className="input text-sm"
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <option value="low">Low priority</option>
                <option value="medium">Medium priority</option>
                <option value="high">High priority</option>
              </select>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary text-xs py-1.5 px-3">Add task</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost text-xs py-1.5 px-3">Cancel</button>
              </div>
            </form>
          )}

          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              col={col}
              tasks={tasks.filter((t) => t.status === col.id)}
              onDrop={moveTask}
              onDelete={deleteTask}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
