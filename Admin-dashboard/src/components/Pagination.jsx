function pageNumbersToShow(current, total) {
  const pages = new Set([1, total, current, current - 1, current + 1]);
  return [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
}

export default function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  rangeStart,
  rangeEnd,
  onPageChange,
  onPageSizeChange,
}) {
  if (total === 0) return null;

  const numbers = pageNumbersToShow(page, totalPages);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 sm:flex-row sm:px-6">
      <p className="text-sm text-slate-600">
        Page <strong className="font-medium text-slate-900">{rangeStart}–{rangeEnd}</strong> of{" "}
        <strong className="font-medium text-slate-900">{total}</strong>
      </p>

      <div className="flex items-center gap-2">
        <label className="flex items-center gap-1.5 text-sm text-slate-600">
          Rows
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="focus-ring rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
          >
            {[10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <nav className="flex items-center gap-1" aria-label="Pagination">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="focus-ring rounded-lg border border-slate-300 px-2.5 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          {numbers.map((n, idx) => {
            const prev = numbers[idx - 1];
            const showEllipsis = prev !== undefined && n - prev > 1;
            return (
              <span key={n} className="flex items-center gap-1">
                {showEllipsis && <span className="px-1 text-slate-400">…</span>}
                <button
                  onClick={() => onPageChange(n)}
                  aria-current={n === page ? "page" : undefined}
                  className={`focus-ring min-w-[2.25rem] rounded-lg px-2.5 py-1 text-sm font-medium ${
                    n === page
                      ? "bg-brand-500 text-white"
                      : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {n}
                </button>
              </span>
            );
          })}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="focus-ring rounded-lg border border-slate-300 px-2.5 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
}
