import { useEffect, useRef, useState } from "react";

// ─── Utilidades ───────────────────────────────────────────────────────────────

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const DAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function startDow(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

function formatDate(date: Date) {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

function toIsoDate(date: Date) {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${y}-${m}-${d}`;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface DatePickerProps {
  label?: string;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function DatePicker({
  label = "Fecha de nacimiento",
  error,
  value,
  onChange,
  onBlur,
  name,
}: DatePickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const initDate = value ? new Date(value + "T00:00:00") : null;

  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [selected, setSelected] = useState<Date | null>(initDate);
  const [calYear, setCalYear] = useState(
    initDate?.getFullYear() ?? today.getFullYear() - 20,
  );
  const [calMonth, setCalMonth] = useState(
    initDate?.getMonth() ?? today.getMonth(),
  );

  // 'days' = vista normal, 'years' = selector de año
  const [viewMode, setViewMode] = useState<"days" | "years" | "months">("days");
  // Centro de la grilla de años
  const [yearPage, setYearPage] = useState(
    initDate?.getFullYear() ?? today.getFullYear() - 20,
  );

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setViewMode("days");
        onBlur?.();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onBlur]);

  const handleToggle = () => {
    if (!open) {
      // Medir espacio disponible abajo del botón (ref apunta al wrapper del botón)
      const rect = ref.current?.getBoundingClientRect();
      const spaceBelow = window.innerHeight - (rect?.bottom ?? 0);
      setOpenUp(spaceBelow < 340);
      setViewMode("days");
    }
    setOpen((v) => !v);
  };

  // ── Navegación mes ──
  const prevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else setCalMonth((m) => m - 1);
  };

  const nextMonth = () => {
    const next = new Date(calYear, calMonth + 1, 1);
    if (next <= today) {
      if (calMonth === 11) {
        setCalMonth(0);
        setCalYear((y) => y + 1);
      } else setCalMonth((m) => m + 1);
    }
  };

  const isNextDisabled = () => new Date(calYear, calMonth + 1, 1) > today;

  // ── Selección de día ──
  const selectDay = (day: number) => {
    const date = new Date(calYear, calMonth, day);
    setSelected(date);
    onChange?.(toIsoDate(date));
    setOpen(false);
    setViewMode("days");
    onBlur?.();
  };

  // ── Selector de año ──
  const YEAR_COLS = 3;
  const YEAR_ROWS = 4;
  const YEARS_PER_PAGE = YEAR_COLS * YEAR_ROWS; // 12

  // Generamos 12 años: yearPage - 5 … yearPage + 6
  const yearOffset = Math.floor(YEARS_PER_PAGE / 2);
  const years = Array.from(
    { length: YEARS_PER_PAGE },
    (_, i) => yearPage - yearOffset + i,
  ).filter((y) => y <= today.getFullYear());

  const selectYear = (y: number) => {
    setCalYear(y);
    // Si el mes actual queda en el futuro con ese año, retroceder al mes actual
    if (new Date(y, calMonth + 1, 1) > today) {
      setCalMonth(today.getMonth());
    }
    setViewMode("days");
  };

  const prevYearPage = () => setYearPage((p) => p - YEARS_PER_PAGE);
  const nextYearPage = () => {
    const newPage = yearPage + YEARS_PER_PAGE;
    if (newPage - yearOffset <= today.getFullYear()) {
      setYearPage(newPage);
    }
  };
  const isNextYearPageDisabled = () =>
    yearPage + YEARS_PER_PAGE - yearOffset > today.getFullYear();

  // ── Celdas del calendario ──
  const total = daysInMonth(calYear, calMonth);
  const offset = startDow(calYear, calMonth);
  const prevTotal = daysInMonth(calYear, calMonth === 0 ? 11 : calMonth - 1);

  return (
    <div className="mb-4" ref={ref}>
      {label && (
        <label className="block font-ui text-xs text-white/40 mb-1.5 tracking-wide">
          {label}
        </label>
      )}

      {/* ── Trigger + dropdown: wrapper relativo ── */}
      <div className="relative">
        <button
          type="button"
          name={name}
          onClick={handleToggle}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg border bg-white/[0.03]
            text-left transition-all duration-150 outline-none
            ${
              error
                ? "border-red-400/60"
                : open
                  ? "border-violet-500/70 shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
                  : "border-white/[0.10] hover:border-white/20"
            }`}
        >
          <i
            className="ti ti-calendar text-white/35 text-base flex-shrink-0"
            aria-hidden="true"
          />
          <span
            className={`font-body text-sm flex-1 ${selected ? "text-white/80" : "text-white/20"}`}
          >
            {selected ? formatDate(selected) : "dd/mm/aaaa"}
          </span>
          <i
            className={`ti ti-chevron-down text-white/25 text-sm transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>

        {/* ── Dropdown: posicionado absolutamente sobre el botón ── */}
        {open && (
          <div
            className={`absolute left-0 right-0 z-50 bg-[#0f0f1e] border border-white/[0.10] rounded-xl p-4
              shadow-[0_8px_32px_rgba(0,0,0,0.5)]
              ${openUp ? "bottom-full mb-1.5" : "top-full mt-1.5"}`}
          >
            {/* ════ VISTA: DÍAS ════ */}
            {viewMode === "days" && (
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <button
                    type="button"
                    onClick={prevMonth}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-white/[0.08]
                               text-white/40 hover:text-white/70 hover:border-white/20 transition-all duration-150"
                    aria-label="Mes anterior"
                  >
                    <i
                      className="ti ti-chevron-left text-sm"
                      aria-hidden="true"
                    />
                  </button>

                  {/* Mes + Año: el año es clickeable */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setViewMode("months")}
                      className="font-ui text-sm text-violet-400 hover:text-violet-300 transition-colors
           duration-150 underline underline-offset-2 decoration-violet-500/40
           hover:decoration-violet-400"
                      aria-label="Seleccionar mes"
                    >
                      {MONTHS[calMonth]}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setYearPage(calYear);
                        setViewMode("years");
                      }}
                      onWheel={(e) => {
                        e.preventDefault();
                        const dir = e.deltaY > 0 ? -1 : 1; // scroll down = año anterior
                        const next = calYear + dir;
                        if (next > today.getFullYear()) return;
                        setCalYear(next);
                        if (new Date(next, calMonth + 1, 1) > today) {
                          setCalMonth(today.getMonth());
                        }
                      }}
                      className="font-ui text-sm text-violet-400 hover:text-violet-300 transition-colors
                                 duration-150 underline underline-offset-2 decoration-violet-500/40
                                 hover:decoration-violet-400 select-none cursor-ns-resize"
                      title="Scroll para cambiar año • Click para elegir"
                      aria-label="Seleccionar año"
                    >
                      {calYear}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={nextMonth}
                    disabled={isNextDisabled()}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-white/[0.08]
                               text-white/40 hover:text-white/70 hover:border-white/20 transition-all duration-150
                               disabled:opacity-25 disabled:cursor-not-allowed"
                    aria-label="Mes siguiente"
                  >
                    <i
                      className="ti ti-chevron-right text-sm"
                      aria-hidden="true"
                    />
                  </button>
                </div>

                {/* Días de la semana */}
                <div className="grid grid-cols-7 mb-1">
                  {DAYS.map((d) => (
                    <div
                      key={d}
                      className="text-center font-ui text-[10px] text-white/25 py-1"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Celdas */}
                <div className="grid grid-cols-7 gap-y-0.5">
                  {Array.from({ length: offset }).map((_, i) => (
                    <div
                      key={`prev-${i}`}
                      className="text-center font-body text-xs text-white/10 py-1.5"
                    >
                      {prevTotal - offset + i + 1}
                    </div>
                  ))}

                  {Array.from({ length: total }).map((_, i) => {
                    const day = i + 1;
                    const thisDate = new Date(calYear, calMonth, day);
                    const isFuture = thisDate > today;
                    const isToday =
                      thisDate.toDateString() === today.toDateString();
                    const isSelected =
                      selected &&
                      thisDate.toDateString() === selected.toDateString();

                    return (
                      <button
                        key={day}
                        type="button"
                        disabled={isFuture}
                        onClick={() => selectDay(day)}
                        className={`text-center font-body text-xs py-1.5 rounded-lg transition-all duration-100
                          ${
                            isSelected
                              ? "bg-violet-600 text-white font-medium"
                              : isToday
                                ? "border border-white/[0.15] text-white/70 hover:bg-white/[0.06]"
                                : isFuture
                                  ? "text-white/15 cursor-not-allowed"
                                  : "text-white/55 hover:bg-white/[0.06] hover:text-white/80"
                          }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(null);
                      onChange?.("");
                    }}
                    className="font-ui text-[11px] text-white/30 hover:text-white/60 transition-colors duration-150"
                  >
                    Borrar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCalYear(today.getFullYear());
                      setCalMonth(today.getMonth());
                    }}
                    className="font-ui text-[11px] text-violet-400/70 hover:text-violet-400 transition-colors duration-150"
                  >
                    Hoy
                  </button>
                </div>
              </>
            )}

            {/* ════ VISTA: AÑOS ════ */}
            {viewMode === "years" && (
              <>
                {/* Header años */}
                <div className="flex items-center justify-between mb-3">
                  <button
                    type="button"
                    onClick={prevYearPage}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-white/[0.08]
                               text-white/40 hover:text-white/70 hover:border-white/20 transition-all duration-150"
                    aria-label="Años anteriores"
                  >
                    <i
                      className="ti ti-chevron-left text-sm"
                      aria-hidden="true"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode("days")}
                    className="font-ui text-sm text-white/60 hover:text-white/90 transition-colors duration-150"
                    aria-label="Volver al calendario"
                  >
                    Selecciona un año
                  </button>

                  <button
                    type="button"
                    onClick={nextYearPage}
                    disabled={isNextYearPageDisabled()}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-white/[0.08]
                               text-white/40 hover:text-white/70 hover:border-white/20 transition-all duration-150
                               disabled:opacity-25 disabled:cursor-not-allowed"
                    aria-label="Años siguientes"
                  >
                    <i
                      className="ti ti-chevron-right text-sm"
                      aria-hidden="true"
                    />
                  </button>
                </div>

                {/* Grilla de años */}
                <div className="grid grid-cols-3 gap-1.5">
                  {years.map((y) => {
                    const isCurrent = y === calYear;
                    const isThisYear = y === today.getFullYear();
                    return (
                      <button
                        key={y}
                        type="button"
                        onClick={() => selectYear(y)}
                        className={`font-ui text-xs py-2 rounded-lg transition-all duration-100
                          ${
                            isCurrent
                              ? "bg-violet-600 text-white font-medium"
                              : isThisYear
                                ? "border border-white/[0.15] text-white/70 hover:bg-white/[0.06]"
                                : "text-white/55 hover:bg-white/[0.06] hover:text-white/80"
                          }`}
                      >
                        {y}
                      </button>
                    );
                  })}
                </div>

                {/* Footer años */}
                <div className="flex justify-end items-center mt-3 pt-3 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => {
                      setYearPage(today.getFullYear());
                    }}
                    className="font-ui text-[11px] text-violet-400/70 hover:text-violet-400 transition-colors duration-150"
                  >
                    Año actual
                  </button>
                </div>
              </>
            )}
            {/* ════ VISTA: MESES ════ */}
            {viewMode === "months" && (
              <>
                {/* Header meses */}
                <div className="flex items-center justify-between mb-3">
                  <button
                    type="button"
                    onClick={() => setCalYear((y) => y - 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-white/[0.08]
                   text-white/40 hover:text-white/70 hover:border-white/20 transition-all duration-150"
                    aria-label="Año anterior"
                  >
                    <i
                      className="ti ti-chevron-left text-sm"
                      aria-hidden="true"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setYearPage(calYear);
                      setViewMode("years");
                    }}
                    className="font-ui text-sm text-violet-400 hover:text-violet-300 transition-colors
                   duration-150 underline underline-offset-2 decoration-violet-500/40"
                    aria-label="Seleccionar año"
                  >
                    {calYear}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCalYear((y) => y + 1)}
                    disabled={calYear >= today.getFullYear()}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-white/[0.08]
                   text-white/40 hover:text-white/70 hover:border-white/20 transition-all duration-150
                   disabled:opacity-25 disabled:cursor-not-allowed"
                    aria-label="Año siguiente"
                  >
                    <i
                      className="ti ti-chevron-right text-sm"
                      aria-hidden="true"
                    />
                  </button>
                </div>

                {/* Grilla de meses */}
                <div className="grid grid-cols-3 gap-1.5">
                  {MONTHS.map((name, idx) => {
                    const isFuture =
                      calYear === today.getFullYear() && idx > today.getMonth();
                    const isCurrent = idx === calMonth;
                    const isThisMonth =
                      idx === today.getMonth() &&
                      calYear === today.getFullYear();

                    return (
                      <button
                        key={name}
                        type="button"
                        disabled={isFuture}
                        onClick={() => {
                          setCalMonth(idx);
                          setViewMode("days");
                        }}
                        className={`font-ui text-xs py-2 rounded-lg transition-all duration-100
              ${
                isCurrent
                  ? "bg-violet-600 text-white font-medium"
                  : isThisMonth
                    ? "border border-white/[0.15] text-white/70 hover:bg-white/[0.06]"
                    : isFuture
                      ? "text-white/15 cursor-not-allowed"
                      : "text-white/55 hover:bg-white/[0.06] hover:text-white/80"
              }`}
                      >
                        {name.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>

                {/* Footer meses */}
                <div className="flex justify-end items-center mt-3 pt-3 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => {
                      setCalYear(today.getFullYear());
                      setCalMonth(today.getMonth());
                      setViewMode("days");
                    }}
                    className="font-ui text-[11px] text-violet-400/70 hover:text-violet-400 transition-colors duration-150"
                  >
                    Mes actual
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="font-body text-[11px] text-red-400/80 mt-1.5 px-0.5">
          {error}
        </p>
      )}
    </div>
  );
}
