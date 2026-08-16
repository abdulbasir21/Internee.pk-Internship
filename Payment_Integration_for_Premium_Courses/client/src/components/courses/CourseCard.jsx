import { Link } from 'react-router-dom'
import { Lock, Unlock, ArrowUpRight } from 'lucide-react'
import PremiumBadge from './PremiumBadge'

// Every course reads as an admission ticket: the image/title is the
// "event", and the dashed, notched stub at the bottom is what you'd
// tear off to get in — already torn for free courses, still sealed
// (with a lock) for premium ones you haven't bought yet.
export default function CourseCard({ course, owned = false }) {
  const unlocked = course.isFree || owned

  return (
    <Link
      to={`/courses/${course._id}`}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-line/60 bg-white
        shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-raised"
    >
      <div className="relative h-36 w-full overflow-hidden bg-ink">
        {course.previewImage ? (
          <img
            src={course.previewImage}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink to-[#243358] font-display text-3xl text-gold-light/70">
            {course.title?.charAt(0) ?? '?'}
          </div>
        )}
        <div className="absolute right-3 top-3">
          <PremiumBadge isFree={course.isFree} price={course.price} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">
          {course.category}
        </span>
        <h3 className="font-display text-lg font-medium leading-snug text-ink line-clamp-2">
          {course.title}
        </h3>
      </div>

      <div className="ticket-stub flex items-center justify-between px-5 py-4">
        <span className="flex items-center gap-1.5 text-xs font-medium text-ink-light">
          {unlocked ? (
            <>
              <Unlock size={13} className="text-forest" /> Ready to view
            </>
          ) : (
            <>
              <Lock size={13} className="text-gold-dark" /> Unlock to view
            </>
          )}
        </span>
        <span className="flex items-center gap-1 text-xs font-medium text-ink transition-transform group-hover:translate-x-0.5">
          Details <ArrowUpRight size={14} />
        </span>
      </div>
    </Link>
  )
}
