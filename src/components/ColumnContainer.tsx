import { Column, Id, Task } from '../types'
import TrashIcon from '../icons/TrashIcon'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import PlusIcon from '../icons/PlusIcon'
import TaskCard from './TaskCard'

interface Props {
	column: Column
	deleteColumn: (id: Id) => void
	updateColumn: (id: Id, title: string) => void
	createTask: (columnId: Id) => void
	tasks: Task[]
}
function ColumnContainer(props: Props) {
	const { column, deleteColumn, updateColumn, createTask, tasks } = props

	const [editMode, setEditMode] = useState(false)

	const {
		setNodeRef,
		attributes,
		listeners,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: column.id,
		data: { type: 'Column', column },
		disabled: editMode,
	})

	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	}

	if (isDragging) {
		return (
			<div
				ref={setNodeRef}
				style={style}
				className="bg-columnBackgroundColor w-[350px] h-[500px]
            max-h-[500px] rounded-sm flex flex-col opacity-60 border-2 border-rose-500 "
			></div>
		)
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="
            bg-columnBackgroundColor w-[350px] h-[500px]
            max-h-[500px] rounded-sm flex flex-col "
		>
			{/* Column Title */}
			<div
				{...attributes}
				{...listeners}
				onClick={() => setEditMode(true)}
				className="
				bg-mainBackgroundColor p-2 
				text-md h-[60px] text-md cursor-grab 
				rounded-md rounded-b-none 
				font-bold border-columnBackgroundColor border-4 
				flex justify-between items-center "
			>
				<div className="flex gap-2">
					<div
						className="flex justify-center items-center 
					bg-columnBackgroundColor px-2 text-sm rounded-full "
					>
						<div>{column.id}</div>
					</div>
					{!editMode && column.title}
					{editMode && (
						<input
							className="bg-black text-slate-200 
							focus:border-rose-500 border rounded outline-none px-2"
							value={column.title}
							onChange={(e) => updateColumn(column.id, e.target.value)}
							autoFocus
							onBlur={() => {
								setEditMode(false)
							}}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === 'Escape') setEditMode(false)
							}}
						/>
					)}
				</div>
				<button
					onClick={() => deleteColumn(column.id)}
					className="stroke-gray-500
				hover:stroke-white hover:bg-columnBackgroundColor
				rounded px-1 py-2 "
				>
					<TrashIcon />
				</button>
			</div>
			{/* Column Tasks */}
			<div
				className="flex flex-col gap-4 p-2 
				overflow-x-hidden overflow-y-auto flex-grow"
			>
				{tasks.map((task) => (
					<TaskCard key={task.id} task={task} />
				))}
			</div>
			<button
				className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor
			hover:bg-columnBackgroundColor hover:text-rose-500
			active:bg-black"
				onClick={() => {
					createTask(column.id)
				}}
			>
				<PlusIcon /> Add Task
			</button>
		</div>
	)
}

export default ColumnContainer
