import React, { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

export default function InteractivePulseDemo() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Implement keyboard shortcut navigation (⌘K)', tag: 'Core', done: true },
    { id: 2, title: 'Refactor state updates to eliminate re-renders', tag: 'Perf', done: true },
    { id: 3, title: 'Add high-contrast dark theme tokens', tag: 'a11y', done: false },
    { id: 4, title: 'Validate touch targets on mobile viewports', tag: 'Mobile', done: false },
  ]);
  const [filter, setFilter] = useState('all');

  const toggleTask = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.done;
    if (filter === 'done') return t.done;
    return true;
  });

  const completedCount = tasks.filter((t) => t.done).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="rounded-xl bg-[#0d0e12] border border-[#1f222c] overflow-hidden text-left shadow-xl">
      {/* App Bar */}
      <div className="px-4 py-3 bg-[#12141a] border-b border-[#1f222c] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="font-mono text-xs font-semibold text-[#f4f5f8]">Pulse Workspace Simulator</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-[#9ca3af]">Sprint 04:</span>
          <span className="font-mono text-xs font-semibold text-emerald-400">{progressPercent}% done</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-[#161820]">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Interactive Controls */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1.5 bg-[#161820] p-1 rounded-md text-xs font-mono">
            {['all', 'active', 'done'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded capitalize transition-all ${
                  filter === f
                    ? 'bg-[#222633] text-[#f4f5f8] font-semibold'
                    : 'text-[#9ca3af] hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <span className="text-[11px] font-mono text-[#5b6270] hidden sm:inline">
            Click tasks to toggle state
          </span>
        </div>

        {/* Task List */}
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() => toggleTask(task.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                task.done
                  ? 'bg-[#12141a]/60 border-[#1c1f28] text-[#5b6270]'
                  : 'bg-[#151720] border-[#222633] text-[#f4f5f8] hover:border-blue-500/40'
              }`}
            >
              <div className="flex items-center gap-3">
                {task.done ? (
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                ) : (
                  <Circle size={16} className="text-[#5b6270] shrink-0" />
                )}
                <span className={`text-xs sm:text-sm ${task.done ? 'line-through text-[#5b6270]' : ''}`}>
                  {task.title}
                </span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#1c202a] text-[#9ca3af] shrink-0">
                {task.tag}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-[#1a1d26] flex items-center justify-between text-[11px] font-mono text-[#5b6270]">
          <span>State: Client-synced</span>
          <span className="text-blue-400">Interactive live prototype</span>
        </div>
      </div>
    </div>
  );
}
