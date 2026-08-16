import { useCallback, useEffect, useState } from 'react'
import { BookOpen, Lock, Unlock, ShoppingBag, DollarSign, Plus } from 'lucide-react'
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getAdminOrders,
} from '../services/api'
import Button from '../components/ui/Button'
import StatsCard from '../components/admin/StatsCard'
import CourseTable from '../components/admin/CourseTable'
import CourseForm from '../components/admin/CourseForm'
import DeleteConfirmModal from '../components/admin/DeleteConfirmModal'

export default function AdminDashboard() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Orders power two optional stat cards. Kept separate from `error` above
  // since GET /api/admin/orders failing shouldn't block the rest of the
  // dashboard — the course list is the part that actually matters.
  const [orderStats, setOrderStats] = useState(null)

  const [formOpen, setFormOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null) // null = "add" mode
  const [fetchingEditId, setFetchingEditId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadCourses = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getCourses()
      setCourses(data.courses || [])
    } catch {
      setError("Couldn't load courses. Try refreshing.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCourses()
    getAdminOrders()
      .then((data) => {
        const orders = data.orders || []
        const paid = orders.filter((o) => o.status === 'paid')
        setOrderStats({
          count: orders.length,
          revenue: paid.reduce((sum, o) => sum + (o.amountPaid || 0), 0),
        })
      })
      .catch(() => setOrderStats(null))
  }, [loadCourses])

  const freeCount = courses.filter((c) => c.isFree).length
  const premiumCount = courses.length - freeCount

  const openAddForm = () => {
    setEditingCourse(null)
    setFormError('')
    setFormOpen(true)
  }

  // GET /api/courses (the list endpoint) never returns content, so
  // editing needs a fresh GET /api/courses/:id — an admin token always
  // unlocks that field, per the backend's gating rules.
  const openEditForm = async (course) => {
    setFetchingEditId(course._id)
    setError('')
    try {
      const data = await getCourseById(course._id)
      setEditingCourse(data.course || course)
      setFormError('')
      setFormOpen(true)
    } catch {
      setError("Couldn't load that course's details. Try again.")
    } finally {
      setFetchingEditId(null)
    }
  }

  const closeForm = () => {
    if (submitting) return
    setFormOpen(false)
    setEditingCourse(null)
  }

  const handleFormSubmit = async (values) => {
    setSubmitting(true)
    setFormError('')
    try {
      if (editingCourse) {
        await updateCourse(editingCourse._id, values)
      } else {
        await createCourse(values)
      }
      setFormOpen(false)
      setEditingCourse(null)
      await loadCourses()
    } catch (err) {
      setFormError(
        err?.response?.data?.message || 'Could not save the course. Check the fields and try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const closeDeleteModal = () => {
    if (deleting) return
    setDeleteTarget(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteCourse(deleteTarget._id)
      setDeleteTarget(null)
      await loadCourses()
    } catch {
      setError("Couldn't delete that course. Try again.")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-gold-dark">Admin</span>
          <h1 className="mt-2 font-display text-3xl font-medium text-ink sm:text-4xl">Dashboard</h1>
          <p className="mt-2 text-sm text-ink-light">
            Manage the course catalog and keep an eye on how it's growing.
          </p>
        </div>
        <Button variant="gold" size="lg" onClick={openAddForm}>
          <Plus size={16} /> Add course
        </Button>
      </div>

      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatsCard icon={BookOpen} label="Total courses" value={loading ? '—' : courses.length} accent="ink" />
        <StatsCard icon={Lock} label="Premium" value={loading ? '—' : premiumCount} accent="gold" />
        <StatsCard icon={Unlock} label="Free" value={loading ? '—' : freeCount} accent="forest" />
        <StatsCard
          icon={ShoppingBag}
          label="Orders paid"
          value={orderStats ? orderStats.count : '—'}
          accent="ink"
        />
        <StatsCard
          icon={DollarSign}
          label="Revenue"
          value={orderStats ? `$${orderStats.revenue}` : '—'}
          accent="gold"
        />
      </div>

      {error && (
        <p className="mb-6 rounded-card border border-danger/30 bg-danger-light px-5 py-4 text-sm text-danger">
          {error}
        </p>
      )}

      <CourseTable
        courses={courses}
        loading={loading}
        onAdd={openAddForm}
        onEdit={openEditForm}
        onDelete={setDeleteTarget}
        editingId={fetchingEditId}
      />

      <CourseForm
       key={formOpen ? editingCourse?._id || 'add' : 'closed'}
        open={formOpen}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        initialValues={editingCourse}
        submitting={submitting}
        error={formError}
      />

      <DeleteConfirmModal
        open={Boolean(deleteTarget)}
        course={deleteTarget}
        onCancel={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        deleting={deleting}
      />
    </div>
  )
}
