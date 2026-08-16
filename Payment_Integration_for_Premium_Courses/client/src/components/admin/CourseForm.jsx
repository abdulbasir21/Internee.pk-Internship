import { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'

// Same form for add and edit — the parent decides which by passing
// (or not passing) initialValues, and remounts this component (via Modal
// unmounting on close) so state never leaks between a closed "add" and a
// freshly opened "edit".
export default function CourseForm({ open, onClose, onSubmit, initialValues, submitting, error }) {
  const isEdit = Boolean(initialValues?._id)

  const [form, setForm] = useState({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    category: initialValues?.category || '',
    price: initialValues?.price ?? '',
    isFree: initialValues?.isFree || false,
    // Stored as one paragraph per line in the textarea; split into an
    // array on submit. Existing courses come back as an array from the API.
    content: Array.isArray(initialValues?.content) ? initialValues.content.join('\n\n') : '',
    previewImage: initialValues?.previewImage || '',
  })

  const update = (field) => (e) => {
    const value = e.target.value
    setForm((f) => ({ ...f, [field]: value }))
  }

  const setAccess = (isFree) => {
    // Premium always needs a real price; flipping to Free zeroes it out
    // rather than leaving a stale number that would never be charged.
    setForm((f) => ({ ...f, isFree, price: isFree ? 0 : f.price }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Split on blank lines so each textarea paragraph becomes one array entry.
    const content = form.content
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean)
    onSubmit({ ...form, price: Number(form.price) || 0, content })
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit course' : 'Add a course'} className="max-w-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input id="title" label="Title" required value={form.title} onChange={update('title')} />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-medium text-ink-light">
            Description
          </label>
          <textarea
            id="description"
            required
            rows={3}
            value={form.description}
            onChange={update('description')}
            className="w-full resize-none rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink
              placeholder:text-ink-faint outline-none transition-colors focus:border-ink"
          />
        </div>

        <Input id="category" label="Category" required value={form.category} onChange={update('category')} />

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink-light">Access</span>
          <div className="inline-flex w-fit rounded-full border border-line bg-paper p-1">
            <button
              type="button"
              onClick={() => setAccess(true)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                form.isFree ? 'bg-forest text-white' : 'text-ink-light hover:text-ink'
              }`}
            >
              Free
            </button>
            <button
              type="button"
              onClick={() => setAccess(false)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                !form.isFree ? 'bg-gold text-white' : 'text-ink-light hover:text-ink'
              }`}
            >
              Premium
            </button>
          </div>
        </div>

        <Input
          id="price"
          type="number"
          min="0"
          step="0.01"
          label="Price (USD)"
          disabled={form.isFree}
          required={!form.isFree}
          value={form.isFree ? 0 : form.price}
          onChange={update('price')}
          className={form.isFree ? 'opacity-50' : ''}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="content" className="text-sm font-medium text-ink-light">
            Lesson content
          </label>
          <textarea
            id="content"
            required
            rows={8}
            placeholder={'Write 4–5 paragraphs, separated by a blank line…'}
            value={form.content}
            onChange={update('content')}
            className="w-full resize-y rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink
              placeholder:text-ink-faint outline-none transition-colors focus:border-ink"
          />
          <p className="text-xs text-ink-faint">Separate paragraphs with a blank line.</p>
        </div>

        <Input
          id="previewImage"
          label="Preview image URL (optional)"
          placeholder="https://…"
          value={form.previewImage}
          onChange={update('previewImage')}
        />

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="gold" loading={submitting}>
            {isEdit ? 'Save changes' : 'Add course'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
