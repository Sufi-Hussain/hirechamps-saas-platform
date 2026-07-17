'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, CheckCircle2, Circle, AlertCircle, Clock } from 'lucide-react'

const tasks = [
  {
    id: '1',
    title: 'Complete Q3 performance review',
    project: 'HR Management',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2024-08-15',
    assignee: 'You',
  },
  {
    id: '2',
    title: 'Update employee handbook',
    project: 'Documentation',
    priority: 'medium',
    status: 'todo',
    dueDate: '2024-08-20',
    assignee: 'Team Lead',
  },
  {
    id: '3',
    title: 'Prepare training materials',
    project: 'Learning & Development',
    priority: 'medium',
    status: 'todo',
    dueDate: '2024-08-18',
    assignee: 'You',
  },
  {
    id: '4',
    title: 'System migration testing',
    project: 'Infrastructure',
    priority: 'high',
    status: 'completed',
    dueDate: '2024-08-10',
    assignee: 'Tech Lead',
  },
]

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-700'
    case 'medium':
      return 'bg-yellow-100 text-yellow-700'
    case 'low':
      return 'bg-green-100 text-green-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="h-5 w-5 text-green-600" />
    case 'in-progress':
      return <Clock className="h-5 w-5 text-blue-600" />
    case 'blocked':
      return <AlertCircle className="h-5 w-5 text-red-600" />
    default:
      return <Circle className="h-5 w-5 text-gray-400" />
  }
}

export default function TasksPage() {
  const todoTasks = tasks.filter((t) => t.status === 'todo')
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress')
  const completedTasks = tasks.filter((t) => t.status === 'completed')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Tasks & Projects</h1>
          <p className="text-muted-foreground mt-2">Manage your work and track progress</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Summary Stats */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{tasks.length}</div>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{todoTasks.length}</div>
              <p className="text-sm text-muted-foreground">To Do</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{inProgressTasks.length}</div>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{completedTasks.length}</div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Kanban View */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Kanban Board</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Todo Column */}
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Circle className="h-4 w-4" />
              To Do ({todoTasks.length})
            </h3>
            <div className="space-y-3">
              {todoTasks.map((task) => (
                <Card key={task.id} className="cursor-pointer hover:shadow-md transition">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(task.status)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-2">{task.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{task.project}</p>
                        <div className="flex gap-2 mt-3">
                          <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              In Progress ({inProgressTasks.length})
            </h3>
            <div className="space-y-3">
              {inProgressTasks.map((task) => (
                <Card key={task.id} className="cursor-pointer hover:shadow-md transition border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(task.status)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-2">{task.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{task.project}</p>
                        <div className="flex gap-2 mt-3">
                          <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Completed Column */}
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Completed ({completedTasks.length})
            </h3>
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <Card key={task.id} className="cursor-pointer hover:shadow-md transition opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(task.status)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-2 line-through">{task.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{task.project}</p>
                        <div className="flex gap-2 mt-3">
                          <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Tasks Table */}
      <section>
        <h2 className="text-xl font-semibold mb-4">All Tasks</h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted">
                    <th className="text-left py-3 px-6 font-semibold">Task</th>
                    <th className="text-left py-3 px-6 font-semibold">Project</th>
                    <th className="text-left py-3 px-6 font-semibold">Priority</th>
                    <th className="text-left py-3 px-6 font-semibold">Status</th>
                    <th className="text-left py-3 px-6 font-semibold">Due Date</th>
                    <th className="text-left py-3 px-6 font-semibold">Assignee</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id} className="border-b hover:bg-muted/50 transition">
                      <td className="py-3 px-6 font-medium">{task.title}</td>
                      <td className="py-3 px-6 text-muted-foreground">{task.project}</td>
                      <td className="py-3 px-6">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </td>
                      <td className="py-3 px-6">
                        <Badge variant="outline">
                          {task.status === 'completed'
                            ? 'Completed'
                            : task.status === 'in-progress'
                              ? 'In Progress'
                              : 'To Do'}
                        </Badge>
                      </td>
                      <td className="py-3 px-6">{task.dueDate}</td>
                      <td className="py-3 px-6 text-muted-foreground">{task.assignee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
