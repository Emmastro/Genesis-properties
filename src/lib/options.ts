// Shared option lists. Used by both the CMS schema and the public site so the
// labels a visitor sees always match what an editor picked in the studio.

export type Option = { label: string; value: string }

export const PROVINCES: { province: string; districts: string[] }[] = [
  { province: 'Kigali City', districts: ['Gasabo', 'Kicukiro', 'Nyarugenge'] },
  { province: 'Northern Province', districts: ['Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo'] },
  {
    province: 'Southern Province',
    districts: ['Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe', 'Nyanza', 'Nyaruguru', 'Ruhango'],
  },
  {
    province: 'Eastern Province',
    districts: ['Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana'],
  },
  {
    province: 'Western Province',
    districts: ['Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rubavu', 'Rusizi', 'Rutsiro'],
  },
]

export const DISTRICT_OPTIONS: Option[] = PROVINCES.flatMap(({ districts }) =>
  districts.map((d) => ({ label: d, value: d.toLowerCase() })),
)

export const districtLabel = (value?: string | null) =>
  DISTRICT_OPTIONS.find((o) => o.value === value)?.label ?? ''

export const provinceOf = (value?: string | null) =>
  PROVINCES.find((p) => p.districts.some((d) => d.toLowerCase() === value))?.province ?? ''

export const CATEGORY_OPTIONS: Option[] = [
  { label: 'Apartment', value: 'apartment' },
  { label: 'House', value: 'house' },
  { label: 'Villa', value: 'villa' },
  { label: 'Plot', value: 'plot' },
  { label: 'Commercial', value: 'commercial' },
]

export const PURPOSE_OPTIONS: Option[] = [
  { label: 'For sale', value: 'sale' },
  { label: 'For rent', value: 'rent' },
  { label: 'Short stay (book by the night)', value: 'short-stay' },
]

export const LISTING_STATUS_OPTIONS: Option[] = [
  { label: 'Available', value: 'available' },
  { label: 'Reserved', value: 'reserved' },
  { label: 'Sold', value: 'sold' },
  { label: 'Rented', value: 'rented' },
]

export const PRICE_PERIOD_OPTIONS: Option[] = [
  { label: 'Total price', value: 'total' },
  { label: 'Per month', value: 'month' },
  { label: 'Per night', value: 'night' },
]

export const CURRENCY_OPTIONS: Option[] = [
  { label: 'US Dollar (USD)', value: 'USD' },
  { label: 'Rwandan Franc (RWF)', value: 'RWF' },
]

export const ZONING_OPTIONS: Option[] = [
  { label: 'Residential', value: 'residential' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Mixed use', value: 'mixed' },
  { label: 'Industrial', value: 'industrial' },
  { label: 'Agricultural', value: 'agricultural' },
]

export const PROJECT_STATUS_OPTIONS: Option[] = [
  { label: 'Off-plan', value: 'off-plan' },
  { label: 'Under construction', value: 'under-construction' },
  { label: 'Completed', value: 'completed' },
]

export const SERVICE_GROUP_OPTIONS: Option[] = [
  { label: 'Architectural services', value: 'architectural' },
  { label: 'Real estate services', value: 'real-estate' },
]

export const INQUIRY_TYPE_OPTIONS: Option[] = [
  { label: 'Viewing request', value: 'viewing' },
  { label: 'Apartment booking', value: 'booking' },
  { label: 'Plot search', value: 'plot-search' },
  { label: 'Design project', value: 'design' },
  { label: 'Property advisory', value: 'advisory' },
  { label: 'Sell or list my property', value: 'list-property' },
  { label: 'General question', value: 'general' },
]

export const labelOf = (options: Option[], value?: string | null) =>
  options.find((o) => o.value === value)?.label ?? ''
