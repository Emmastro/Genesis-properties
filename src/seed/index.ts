import path from 'path'
import type { Payload, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { richText } from '../lib/lexical'
import type { Listing } from '../payload-types'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const imagePath = (file: string) => path.resolve(dirname, 'images', file)

// Every photo below came from the developers' own sales material (renders,
// finishes palette, floor plans) or from site visits shared by the team.
const IMAGES = {
  redhillExterior: ['redhill-residence-exterior.jpg', 'Redhill Residence, Kigali — architectural render of the building'],
  redhillEntrance: ['redhill-residence-entrance.jpg', 'Redhill Residence entrance and street front — render'],
  redhillAerial: ['redhill-residence-aerial.jpg', 'Aerial render of Redhill Residence with rooftop terrace and pool'],
  redhillSite1: ['redhill-residence-construction-1.jpg', 'Redhill Residence construction progress, September 2026'],
  redhillSite2: ['redhill-residence-construction-2.jpg', 'Redhill Residence structure under construction, September 2026'],
  redhillKitchen: ['redhill-finishes-kitchen.jpg', 'Indicative kitchen layout and colours for Redhill Residence apartments'],
  redhillLiving: ['redhill-finishes-living.jpg', 'Indicative interior colour scheme for a Redhill Residence living room'],
  redhillTerrace: ['redhill-terrace-restaurant.jpg', 'Planned character of the Redhill Residence terrace restaurant'],
  redhillGym: ['redhill-gym.jpg', 'Indicative gym setup at Redhill Residence'],
  redhillLaundry: ['redhill-laundry.jpg', 'Indicative shared laundry at Redhill Residence'],
  redhillPlan: ['redhill-floor-plan-level-02.jpg', 'Redhill Residence floor plan — level 02'],
  tamarindRender1: ['tamarind-court-render-1.jpg', 'Tamarind Court, Gacuriro — render of the building and driveway'],
  tamarindRender2: ['tamarind-court-render-2.jpg', 'Tamarind Court, Gacuriro — street view render'],
  tamarindRender3: ['tamarind-court-render-3.jpg', 'Tamarind Court, Gacuriro — entrance render'],
  tamarindPhoto1: ['tamarind-court-completed-1.jpg', 'Tamarind Court apartment building in Gacuriro, Kigali'],
  tamarindPhoto2: ['tamarind-court-completed-2.jpg', 'Tamarind Court front elevation and gate, Gacuriro'],
  tamarindPhoto3: ['tamarind-court-completed-3.jpg', 'Tamarind Court from the street, Gacuriro'],
  tamarindSite: ['tamarind-court-site-view.jpg', 'View from the Tamarind Court site in Gacuriro'],
  tamarindPlan1: ['tamarind-court-plan-level-01.jpg', 'Tamarind Court floor plan — level 01'],
  tamarindPlan2: ['tamarind-court-plan-level-02.jpg', 'Tamarind Court floor plan — levels 02 to 05'],
} as const

type ImageKey = keyof typeof IMAGES

const REDHILL_UNITS: { unit: string; bedrooms: number; area: number; price: number; featured?: boolean }[] = [
  { unit: '208', bedrooms: 1, area: 33, price: 65_000, featured: true },
  { unit: '110', bedrooms: 1, area: 42, price: 80_000 },
  { unit: '111', bedrooms: 1, area: 42, price: 80_000 },
  { unit: '212', bedrooms: 1, area: 41, price: 80_000 },
  { unit: '203', bedrooms: 1, area: 47, price: 85_000 },
  { unit: '207', bedrooms: 1, area: 68, price: 100_000 },
  { unit: '114', bedrooms: 2, area: 69, price: 140_000, featured: true },
  { unit: '115', bedrooms: 2, area: 78, price: 150_000 },
  { unit: '314', bedrooms: 2, area: 84, price: 150_000 },
  { unit: '214', bedrooms: 2, area: 91, price: 150_000, featured: true },
]

const SERVICES = [
  {
    title: 'Exterior Design',
    group: 'architectural',
    icon: 'exterior',
    image: 'redhillExterior',
    shortDescription: 'Architectural concepts, façades, building design and 3D visualization.',
    body: [
      'A building is judged from the street first. We design homes, apartment blocks and commercial buildings from the first concept sketch to drawings you can build from — shaped around your plot, your budget and the way you want to live.',
      'Every concept comes with 3D visualization, so you walk around the building and agree on it before anything is built.',
    ],
    deliverables: [
      'Concept design and massing options',
      'Façade design and material palette',
      'Architectural drawings: plans, sections, elevations',
      '3D renders of the finished building',
    ],
    process: [
      ['Brief', 'We visit the plot and listen: rooms, budget, style, timeline.'],
      ['Concept', 'Two or three directions, sketched and modelled in 3D.'],
      ['Design', 'The chosen direction is developed into full drawings.'],
      ['Visualize', 'Photo-real renders so you can see the result before building.'],
    ],
  },
  {
    title: 'Interior Design',
    group: 'architectural',
    icon: 'interior',
    image: 'redhillLiving',
    shortDescription: 'Space planning, finishes, furniture layouts and interior visualization.',
    body: [
      'Good interiors make a small apartment feel generous and a large house feel like a home. We plan the space, choose finishes and lay out furniture so every room works — then show it to you in 3D.',
      'Ideal for new owners fitting out an off-plan apartment, landlords preparing a unit for rent, and anyone renovating.',
    ],
    deliverables: [
      'Space planning and furniture layouts',
      'Finishes, colours and lighting',
      'Kitchen and bathroom design',
      'Interior 3D visualization',
    ],
    process: [
      ['Measure', 'We survey the space or work from the developer’s plans.'],
      ['Plan', 'Layouts that make the most of every square metre.'],
      ['Specify', 'Finishes, fittings and furniture with a clear budget.'],
      ['Visualize', 'Renders of each room before you buy a single item.'],
    ],
  },
  {
    title: 'Landscape Design',
    group: 'architectural',
    icon: 'landscape',
    image: 'redhillTerrace',
    shortDescription: 'Gardens, courtyards, outdoor spaces and site landscaping.',
    body: [
      'Kigali’s hills and climate make outdoor space one of the best rooms of the house. We design gardens, courtyards, terraces and driveways that are beautiful, easy to maintain and work with the slope of your site.',
    ],
    deliverables: [
      'Site and garden layout',
      'Terraces, courtyards and rooftop spaces',
      'Planting plan suited to the local climate',
      'Paving, retaining walls and drainage concepts',
    ],
    process: [
      ['Site study', 'Slope, sun, views and how water moves across the plot.'],
      ['Layout', 'Zones for living, play, parking and planting.'],
      ['Detail', 'Materials, plants and lighting.'],
    ],
  },
  {
    title: 'Plot Search',
    group: 'real-estate',
    icon: 'plot',
    image: 'tamarindSite',
    shortDescription: 'Finding suitable plots based on location, size, budget and development needs.',
    body: [
      'Building your own home is often better value than buying one — if you start with the right plot. Tell us the area, size and budget; we find plots that match and check each one before you commit.',
      'Because our architects work alongside our consultants, we can tell you early what a plot will let you build.',
    ],
    deliverables: [
      'Shortlist of plots that match your brief',
      'Check of the plot’s land record and zoning before you buy',
      'Site visits — in person or by video if you are abroad',
      'An architect’s view of what the plot can take',
    ],
    process: [
      ['Brief', 'Location, size, budget and what you want to build.'],
      ['Search', 'We source plots and screen them.'],
      ['Verify', 'Land record and zoning checked before any money moves.'],
      ['Visit', 'You see the shortlisted plots, on site or on video.'],
    ],
  },
  {
    title: 'Property Advisory',
    group: 'real-estate',
    icon: 'advisory',
    image: 'tamarindPhoto1',
    shortDescription: 'Guidance on property selection, development potential and real-estate decisions.',
    body: [
      'Buying property is one of the biggest decisions you make. We help you compare options honestly — location, price per square metre, payment terms, rental potential and what could be built — so you decide with clear eyes.',
    ],
    deliverables: [
      'Side-by-side comparison of the options you are considering',
      'Location and price guidance',
      'Rental and resale perspective',
      'Development potential of a plot or building',
    ],
    process: [
      ['Listen', 'Your goal: a home, an income, or both.'],
      ['Compare', 'We put the options side by side.'],
      ['Advise', 'A clear recommendation and the reasons behind it.'],
    ],
  },
  {
    title: 'Real Estate Consultancy',
    group: 'real-estate',
    icon: 'consultancy',
    image: 'redhillEntrance',
    shortDescription: 'Connecting clients with available properties and representing property owners.',
    body: [
      'For buyers and tenants, a Genesis consultant finds the properties that fit, arranges viewings and stays with you to the signature. For owners and developers, we present your property to the right clients and handle the enquiries.',
    ],
    deliverables: [
      'A dedicated consultant from first call to handover',
      'Viewings arranged around your schedule',
      'Professional presentation of owners’ properties',
      'Support through offer, payment plan and transfer',
    ],
    process: [
      ['Match', 'We match clients with the right properties.'],
      ['View', 'Viewings, in person or by video call.'],
      ['Close', 'Offer, payment plan and paperwork, with you at every step.'],
    ],
  },
  {
    title: 'Apartment Booking',
    group: 'real-estate',
    icon: 'booking',
    image: 'redhillKitchen',
    shortDescription: 'Listing available apartments for rent or sale and facilitating client inquiries and bookings.',
    body: [
      'Browse apartments for sale, long-term rent or short stays, with photos, prices and locations. Send a booking or viewing request in a minute — or message us on WhatsApp — and we confirm availability with you.',
    ],
    deliverables: [
      'Up-to-date apartments with photos and prices',
      'Booking and viewing requests online',
      'Fast replies on WhatsApp',
      'Support for clients arriving from abroad',
    ],
    process: [
      ['Browse', 'Filter by area, size and budget.'],
      ['Request', 'Send a booking or viewing request.'],
      ['Confirm', 'We confirm availability and the next steps.'],
    ],
  },
] as const

export const seed = async ({ payload, req }: { payload: Payload; req?: PayloadRequest }) => {
  const existing = await payload.count({ collection: 'projects', req, overrideAccess: true })
  if (existing.totalDocs > 0) {
    payload.logger.info('Seed: content already present, skipping.')
    return
  }

  const context = { skipRevalidate: true }
  payload.logger.info('Seed: uploading photos…')

  const media = {} as Record<ImageKey, number>
  for (const [key, [file, alt]] of Object.entries(IMAGES) as [ImageKey, readonly [string, string]][]) {
    const doc = await payload.create({
      collection: 'media',
      data: { alt },
      filePath: imagePath(file),
      req,
      context,
      overrideAccess: true,
    })
    media[key] = doc.id
  }

  payload.logger.info('Seed: services…')
  for (const [i, s] of SERVICES.entries()) {
    await payload.create({
      collection: 'services',
      req,
      context,
      overrideAccess: true,
      data: {
        title: s.title,
        group: s.group,
        icon: s.icon,
        order: i + 1,
        shortDescription: s.shortDescription,
        image: media[s.image],
        body: richText(...s.body),
        deliverables: s.deliverables.map((item) => ({ item })),
        process: s.process.map(([step, detail]) => ({ step, detail })),
      },
    })
  }

  payload.logger.info('Seed: developments…')
  const redhill = await payload.create({
    collection: 'projects',
    req,
    context,
    overrideAccess: true,
    data: {
      _status: 'published',
      title: 'Redhill Residence',
      order: 1,
      featured: true,
      tagline: 'A residential development at the heart of Kigali',
      stage: 'under-construction',
      completion: 'Provisional occupation 2028',
      summary:
        'Studios, one- and two-bedroom apartments and duplexes in central Kigali, with a gym, laundry, cafeteria, shops and a terrace restaurant in the building. Live in it, or rent it out.',
      description: richText(
        'Redhill Residence is designed for people who want to live at the heart of Kigali in a setting that offers more than a hotel does. Ten levels of studios, one- and two-bedroom apartments and top-floor duplexes sit above shared spaces: a gym, laundry, meeting rooms, a cafeteria, shops, a reception and a terrace restaurant.',
        { h2: 'Built to live in or to rent out' },
        'Owners are free to use their apartment themselves or to rent it out — on their own, or through an arrangement with the building’s property manager. The developer projects an annual rental yield of around 12%. That is the developer’s projection, not a guarantee; ask us to walk you through the assumptions.',
        { h2: 'What you receive' },
        'Apartments are handed over finished — tiling, cabinetry, sanitary and electrical fittings included. Furniture and appliances are chosen by the buyer, which is where our interior design team can help.',
      ),
      highlights: [
        { value: '10', label: 'levels' },
        { value: '~12%', label: 'projected annual yield (developer estimate)' },
        { value: '2028', label: 'provisional occupation' },
      ],
      amenities: [
        'Gym',
        'Laundry',
        'Meeting rooms',
        'Cafeteria',
        'Terrace restaurant',
        'Shops',
        'Reception',
        'Multipurpose hall',
      ].map((amenity) => ({ amenity })),
      timeline: [
        { period: 'H2 2025', milestone: 'Project approvals and foundation', done: true },
        { period: '2026', milestone: 'Structure and walling', done: false },
        { period: 'H1 2027', milestone: 'Internal doors, plaster, ceilings, cabling and pipework', done: false },
        { period: 'H2 2027', milestone: 'Tiles, cabinetry, sanitary and electrical fittings', done: false },
        { period: 'H1 2028', milestone: 'Provisional occupation — buyers furnish their units', done: false },
        { period: 'H2 2028', milestone: 'Titles and transfers', done: false },
      ],
      heroImage: media.redhillExterior,
      gallery: [
        media.redhillEntrance,
        media.redhillAerial,
        media.redhillKitchen,
        media.redhillLiving,
        media.redhillTerrace,
        media.redhillGym,
        media.redhillLaundry,
      ],
      progressPhotos: [media.redhillSite1, media.redhillSite2],
      floorPlans: [media.redhillPlan],
      district: undefined,
      neighbourhood: 'Central Kigali',
    },
  })

  const tamarind = await payload.create({
    collection: 'projects',
    req,
    context,
    overrideAccess: true,
    data: {
      _status: 'published',
      title: 'Tamarind Court',
      order: 2,
      featured: true,
      tagline: 'Modern apartments in Gacuriro',
      stage: 'completed',
      completion: 'Built',
      priceFrom: 120_000,
      summary:
        'Thirty modern apartments in Gacuriro with a lift, reception and roof terrace — close to international schools, malls and hospitals. The last three-bedroom units are available at $120,000, payable over 18 months.',
      description: richText(
        'Tamarind Court is a modern apartment building in Gacuriro, one of Kigali’s most sought-after residential areas. Its developers set out to build well-finished apartments at a reasonable price, drawing on more than ten years in the local market.',
        'The building has 30 apartments, six on each level, with a reception and a roof terrace that every resident reaches by lift. International schools, shopping malls and hospitals are close by.',
        { h2: 'Three-bedroom apartments' },
        'The remaining units are three-bedroom apartments of 77 m² and 81 m²: one bedroom is en-suite and the other two share a bathroom.',
        { h2: 'Price and payment' },
        'The three-bedroom units are offered at $120,000, with the payment spread over 18 months. Ask a consultant for the full payment schedule.',
      ),
      highlights: [
        { value: '30', label: 'apartments' },
        { value: '$120k', label: 'three-bedroom units' },
        { value: '18', label: 'month payment period' },
      ],
      amenities: ['Lift', 'Reception', 'Roof terrace', 'Gated entrance'].map((amenity) => ({ amenity })),
      paymentPlan: [{ share: '18 months', when: 'Payment period on the remaining three-bedroom units' }],
      heroImage: media.tamarindPhoto1,
      gallery: [
        media.tamarindRender1,
        media.tamarindPhoto2,
        media.tamarindRender2,
        media.tamarindPhoto3,
        media.tamarindRender3,
        media.tamarindSite,
      ],
      floorPlans: [media.tamarindPlan1, media.tamarindPlan2],
      district: 'gasabo',
      neighbourhood: 'Gacuriro',
      nearby: ['International schools', 'Shopping malls', 'Hospitals'].map((place) => ({ place })),
    },
  })

  payload.logger.info('Seed: listings…')
  const redhillHeroes = [media.redhillExterior, media.redhillEntrance, media.redhillAerial]
  for (const [i, u] of REDHILL_UNITS.entries()) {
    const kind = u.bedrooms === 1 ? 'One-bedroom' : 'Two-bedroom'
    const data: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'sizes'> = {
      _status: 'published',
      title: `${kind} apartment ${u.unit} — Redhill Residence`,
      category: 'apartment',
      purpose: 'sale',
      availability: 'available',
      featured: Boolean(u.featured),
      project: redhill.id,
      unitNumber: u.unit,
      price: u.price,
      currency: 'USD',
      pricePeriod: 'total',
      priceNote: 'Off-plan price · occupation 2028',
      bedrooms: u.bedrooms,
      bathrooms: u.bedrooms === 2 ? 2 : 1,
      area: u.area,
      summary: `${kind} apartment of ${u.area} m² at Redhill Residence, central Kigali. Buy off-plan, then live in it or rent it out — with a gym, laundry and terrace restaurant in the building.`,
      description: richText(
        `Apartment ${u.unit} is a ${kind.toLowerCase()} unit of ${u.area} m² at Redhill Residence, a ten-level development at the heart of Kigali.`,
        'The building brings a gym, laundry, meeting rooms, a cafeteria, shops and a terrace restaurant under one roof. Provisional occupation is planned for 2028; furniture and appliances are chosen by the buyer.',
        'Owners can live in the apartment or rent it out, on their own or through the building’s property manager.',
      ),
      features: [
        'Off-plan — provisional occupation 2028',
        'Gym, laundry and cafeteria in the building',
        'Terrace restaurant',
        'Rent it out yourself or through the property manager',
      ].map((feature) => ({ feature })),
      heroImage: redhillHeroes[i % redhillHeroes.length],
      gallery: [media.redhillKitchen, media.redhillLiving, media.redhillGym, media.redhillTerrace],
      floorPlans: [media.redhillPlan],
      neighbourhood: 'Central Kigali',
    }
    await payload.create({ collection: 'listings', req, context, overrideAccess: true, data })
  }

  await payload.create({
    collection: 'listings',
    req,
    context,
    overrideAccess: true,
    data: {
      _status: 'published',
      title: 'Three-bedroom apartment — Tamarind Court, Gacuriro',
      category: 'apartment',
      purpose: 'sale',
      availability: 'available',
      featured: true,
      project: tamarind.id,
      price: 120_000,
      currency: 'USD',
      pricePeriod: 'total',
      priceNote: 'Pay over 18 months',
      bedrooms: 3,
      bathrooms: 2,
      area: 81,
      summary:
        'One of the last three-bedroom apartments at Tamarind Court in Gacuriro — 77 to 81 m², one bedroom en-suite, lift and roof terrace. $120,000 payable over 18 months.',
      description: richText(
        'Tamarind Court is a 30-apartment building in Gacuriro with a reception, a lift and a roof terrace shared by residents. International schools, malls and hospitals are close by.',
        'The remaining three-bedroom apartments come in two layouts, 77 m² and 81 m². In both, one bedroom is en-suite and the other two share a bathroom.',
        'The price is $120,000 with payment spread over 18 months.',
      ),
      features: [
        'Three bedrooms, one en-suite',
        'Lift and roof terrace',
        'Gated building with reception',
        'Payment spread over 18 months',
      ].map((feature) => ({ feature })),
      heroImage: media.tamarindRender1,
      gallery: [media.tamarindPhoto1, media.tamarindPhoto2, media.tamarindRender2, media.tamarindPhoto3],
      floorPlans: [media.tamarindPlan1, media.tamarindPlan2],
      district: 'gasabo',
      neighbourhood: 'Gacuriro',
    },
  })

  payload.logger.info('Seed: homepage, settings, team…')
  await payload.updateGlobal({
    slug: 'homepage',
    req,
    context,
    overrideAccess: true,
    data: {
      heroImages: [media.redhillExterior, media.tamarindRender1, media.redhillAerial],
      aboutHeading: 'One team from plot to keys',
      aboutBody:
        'Genesis Properties brings architects and property consultants together. We help you find an apartment, a house or a plot — and when you are ready to build or renovate, the same team designs it: façades, interiors and landscape, with 3D visualization so you see it before it is built.',
      aboutImage: media.redhillLiving,
      ctaImage: media.tamarindPhoto2,
    },
  })

  await payload.updateGlobal({
    slug: 'site-settings',
    req,
    context,
    overrideAccess: true,
    data: { shareImage: media.redhillExterior },
  })

  for (const [i, member] of [
    { name: 'Pascal Gihozo', role: 'Co-founder' },
    { name: 'Fidélité O.B.', role: 'Co-founder · Architect' },
  ].entries()) {
    await payload.create({
      collection: 'team',
      req,
      context,
      overrideAccess: true,
      data: { ...member, order: i + 1, showOnSite: false },
    })
  }

  const email = process.env.SEED_ADMIN_EMAIL || 'admin@genesis.rw'
  const password = process.env.SEED_ADMIN_PASSWORD
  if (password) {
    const users = await payload.count({ collection: 'users', req, overrideAccess: true })
    if (users.totalDocs === 0) {
      await payload.create({
        collection: 'users',
        req,
        overrideAccess: true,
        data: { email, password, name: 'Genesis admin', role: 'admin' },
      })
      payload.logger.info(`Seed: studio user ${email} created.`)
    }
  } else {
    payload.logger.info('Seed: no SEED_ADMIN_PASSWORD — open /admin to create the first studio user.')
  }

  payload.logger.info('Seed: done.')
}
