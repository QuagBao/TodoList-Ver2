import { useState } from 'react'
import TrashIcon from '../icons/TrashIcon'
import { Id, Task } from '../types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Props {
	index: number
	task: Task
	deleteTask(id: Id): void
	updateTask(id: Id, content: string): void
}

function TaskCard({ index, task, deleteTask, updateTask }: Props) {
	const [mouseIsOver, setMouseIsOver] = useState(false)
	const [editMode, setEditMode] = useState(false)

	const handleEditMode = () => {
		setEditMode((prev) => !prev)
		setMouseIsOver(false)
	}

	const {
		setNodeRef,
		attributes,
		listeners,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: task.id,
		data: { type: 'Task', task },
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
				className="bg-mainBackgroundColor p-2.5 h-[100px] rounded-xl cursor-grabs
                max-h-[100px] rounded-sm flex flex-col opacity-50 border-2 border-rose-500 relative"
			/>
		)
	}

	if (editMode) {
		return (
			<div
				ref={setNodeRef}
				style={style}
				{...attributes}
				{...listeners}
				onClick={handleEditMode}
				className="bg-mainBackgroundColor rounded-xl
                hover:ring-2 hover:ring-inset hover:ring-rose-500
                cursor-grabs relative task
                p-2.5 h-[100px] min-h-[100px] items-center flex text-left"
				onMouseEnter={() => setMouseIsOver(true)}
				onMouseLeave={() => setMouseIsOver(false)}
			>
				<textarea
					className="h-[90%] w-full
                    resize-none border-none rounded bg-transparent text-white
                    focus:outline-none "
					value={task.content}
					autoFocus
					placeholder="Task content here"
					onBlur={handleEditMode}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && e.shiftKey) handleEditMode()
					}}
					onChange={(e) => {
						updateTask(task.id, e.target.value)
					}}
				></textarea>
			</div>
		)
	}
	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			onClick={handleEditMode}
			className="bg-mainBackgroundColor rounded-xl
            hover:ring-2 hover:ring-inset hover:ring-rose-500
            cursor-grabs relative task
            p-2.5 h-[100px] min-h-[100px] items-center flex text-left"
			onMouseEnter={() => setMouseIsOver(true)}
			onMouseLeave={() => setMouseIsOver(false)}
		>
			<p
				className="my-auto h-[90%] w-full overflow-y-auto
                overflow-x-auto whitespace-pre-wrap "
			>
				{index + 1}. {task.content}
			</p>
			{mouseIsOver && (
				<button
					onClick={() => deleteTask(task.id)}
					className="stroke-white absolute right-4 top-1/2 
                -translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100"
				>
					<TrashIcon />
				</button>
			)}
		</div>
	)
}

export default TaskCard
