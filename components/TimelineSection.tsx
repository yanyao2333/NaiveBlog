export function TimelineSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="relative min-w-0">
      <h2 className="mb-4 text-lg font-medium">{title}</h2>
      <div className="relative">
        <div className="absolute left-2 top-0 h-full w-0.5 bg-primary-300 dark:bg-primary-400/60"></div>
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  )
}
