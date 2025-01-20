import { useMemo } from 'react'
import PlusIcon from '../icons/PlusIcon'
import { useState } from 'react'
import { Column, Id, Task } from '../types'
import ColumnContainer from './ColumnContainer'
import {
	DndContext,
	DragStartEvent,
	DragOverlay,
	DragEndEvent,
	useSensor,
	useSensors,
	PointerSensor,
	DragOverEvent,
} from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'
import TaskCard from './TaskCard'

function KanbanBoard() {
	const [columns, setColumns] = useState<Column[]>([])
	const columnsId = useMemo(() => columns.map((column) => column.id), [columns])
	console.log(columns)

	const [activeColumn, setActiveColumn] = useState<Column | null>(null)
	const [activeTask, setActiveTask] = useState<Task | null>(null)

	const [tasks, setTasks] = useState<Task[]>([])

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 3,
			},
		})
	)
	return (
		<div
			className="
            m-auto
            flex
            min-h-screen
            w-full
            items-center
            overflow-x-auto
            overflow-y-hidden
            px-[40px]
        "
		>
			<DndContext
				sensors={sensors}
				onDragStart={onDragStart}
				onDragEnd={onDragEnd}
				onDragOver={onDragOver}
			>
				<div className="m-auto flex gap-4">
					<div className="m-auto flex gap-4">
						<SortableContext items={columnsId}>
							{columns.map((column) => (
								<ColumnContainer
									index={columns.indexOf(column) + 1}
									key={column.id}
									column={column}
									deleteColumn={deleteColumn}
									updateColumn={updateColumn}
									tasks={tasks.filter((task) => task.columnId === column.id)}
									createTask={createTask}
									deleteTask={deleteTask}
									updateTask={updateTask}
								/>
							))}
						</SortableContext>
					</div>
					<button
						onClick={() => {
							createNewColumn()
						}}
						className="
                    flex 
                    items-center
                    gap-2
                    h-[60px]
                    w-[350px]
                    min-w-[350px]
                    cursor-pointer
                    rounded-lg
                    bg-mainBackgroundColor
                    border-2
                    border-columnBackgroundColor
                    p-10
                    ring-rose-800
                    hover:ring-2"
					>
						<PlusIcon />
						Add Column
					</button>
				</div>

				{/* Drag Overlay when dragging */}
				{createPortal(
					<DragOverlay>
						{activeColumn && (
							<ColumnContainer
								index={columns.indexOf(activeColumn) + 1}
								column={activeColumn}
								deleteColumn={deleteColumn}
								updateColumn={updateColumn}
								tasks={tasks.filter(
									(task) => task.columnId === activeColumn.id
								)}
								createTask={createTask}
								deleteTask={deleteTask}
								updateTask={updateTask}
							/>
						)}
						{activeTask && (
							<TaskCard
								index={tasks.indexOf(activeTask) + 1}
								task={activeTask}
								deleteTask={deleteTask}
								updateTask={updateTask}
							/>
						)}
					</DragOverlay>,
					document.body
				)}
			</DndContext>
		</div>
	)

	function createNewColumn() {
		const columnToAdd: Column = {
			id: generateId(),
			title: `Column ${columns.length + 1}`,
		}
		setColumns([...columns, columnToAdd])
	}

	function deleteColumn(id: Id) {
		const filteredColumns = columns.filter((column) => column.id !== id)
		setColumns(filteredColumns)

		const newTask = tasks.filter((task) => task.columnId !== id)
		setTasks(newTask)
	}

	function generateId() {
		// Generate a random number between 0 and 10000
		return Math.floor(Math.random() * 10001)
	}

	function onDragStart(event: DragStartEvent) {
		console.log('Drag Start: ', event)
		if (event.active.data.current?.type === 'Column') {
			setActiveColumn(event.active.data.current.column)
			return
		}

		if (event.active.data.current?.type === 'Task') {
			setActiveTask(event.active.data.current.task)
			return
		}
	}

	function onDragEnd(event: DragEndEvent) {
		setActiveColumn(null)
		setActiveTask(null)
		const { active, over } = event
		if (!over) return
		const activeColumnId = active.id
		const overColumnId = over.id
		if (activeColumnId === overColumnId) return
		setColumns((columns) => {
			const activeColumnIndex = columns.findIndex(
				(column) => column.id === activeColumnId
			)

			const overColumnIndex = columns.findIndex(
				(column) => column.id === overColumnId
			)

			return arrayMove(columns, activeColumnIndex, overColumnIndex)
		})
	}

	function onDragOver(event: DragOverEvent) {
		const { active, over } = event
		if (!over) return
		const activeId = active.id
		const overId = over.id

		if (activeId === overId) return
		const isActiveATask = active.data.current?.type === 'Task'
		const isOverATask = over.data.current?.type === 'Task'

		if (!isActiveATask) return

		// Im dropping a Task over another task
		if (isActiveATask && isOverATask) {
			setTasks((tasks) => {
				const activeIndex = tasks.findIndex((t) => t.id === active.id)
				const overIndex = tasks.findIndex((t) => t.id === over.id)
				tasks[activeIndex].columnId = tasks[overIndex].columnId

				return arrayMove(tasks, activeIndex, overIndex)
			})
		}

		const isOverAColumn = over.data.current?.type === 'Column'
		// Im dropping a Task over a column
		if (isActiveATask && isOverAColumn) {
			setTasks((tasks) => {
				const activeIndex = tasks.findIndex((t) => t.id === active.id)
				tasks[activeIndex].columnId = overId

				return arrayMove(tasks, activeIndex, activeIndex)
			})
		}
	}

	function updateColumn(id: Id, title: string) {
		const newColumns = columns.map((column) => {
			if (column.id === id) return { ...column, title }
			return column
		})
		setColumns(newColumns)
	}
	function createTask(columnId: Id) {
		const newTask = {
			id: generateId(),
			columnId,
			content: `Task ${tasks.length + 1}`,
		}
		setTasks([...tasks, newTask])
	}
	function deleteTask(id: Id) {
		const newTasks = tasks.filter((task) => task.id !== id)
		setTasks(newTasks)
	}
	function updateTask(id: Id, content: string) {
		const newTasks = tasks.map((task) => {
			if (task.id === id) return { ...task, content }
			return task
		})
		setTasks(newTasks)
	}
}

export default KanbanBoard
