import { AlertTriangle } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

export default function DeleteConfirmModal({ open, course, onCancel, onConfirm, deleting }) {
  return (
    <Modal open={open} onClose={onCancel} title="Delete course" className="max-w-sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-light text-danger">
          <AlertTriangle size={22} />
        </div>
        <p className="text-sm text-ink-light">
          Delete <span className="font-medium text-ink">{course?.title}</span>? This can't be undone
          — students who own it will lose access to its content.
        </p>
        <div className="mt-2 flex w-full gap-3">
          <Button variant="ghost" className="flex-1" onClick={onCancel} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" className="flex-1" onClick={onConfirm} loading={deleting}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  )
}
