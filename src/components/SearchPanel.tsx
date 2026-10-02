import { CATEGORY_OPTIONS, PROVINCES, PURPOSE_OPTIONS } from '@/lib/options'

import { Icon } from './Icon'

/** Hero search. A plain GET form, so it works without JavaScript and results are shareable. */
export function SearchPanel() {
  const select =
    'w-full appearance-none rounded-xl border-0 bg-sand px-4 py-3.5 text-[0.95rem] text-ink focus:ring-2 focus:ring-gold/40 focus:outline-none'
  return (
    <form
      action="/properties"
      method="get"
      className="grid gap-3 rounded-[1.75rem] bg-white p-3 shadow-[0_30px_60px_-30px_rgba(15,31,53,0.55)] sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:p-3.5"
      role="search"
    >
      <label className="block">
        <span className="sr-only">Location</span>
        <select name="district" className={select} defaultValue="">
          <option value="">Any location</option>
          {PROVINCES.map((p) => (
            <optgroup key={p.province} label={p.province}>
              {p.districts.map((d) => (
                <option key={d} value={d.toLowerCase()}>
                  {d}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="sr-only">Property type</span>
        <select name="category" className={select} defaultValue="">
          <option value="">Any type</option>
          {CATEGORY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="sr-only">Buy or rent</span>
        <select name="purpose" className={select} defaultValue="">
          <option value="">Buy, rent or stay</option>
          {PURPOSE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="sr-only">Budget</span>
        <select name="maxPrice" className={select} defaultValue="">
          <option value="">Any budget</option>
          <option value="75000">Up to $75,000</option>
          <option value="100000">Up to $100,000</option>
          <option value="150000">Up to $150,000</option>
          <option value="250000">Up to $250,000</option>
          <option value="500000">Up to $500,000</option>
        </select>
      </label>
      <button type="submit" className="btn-ink rounded-xl px-7 py-3.5 sm:col-span-2 lg:col-span-1">
        <Icon name="search" className="size-5" /> Search
      </button>
    </form>
  )
}
