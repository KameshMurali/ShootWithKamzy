/* ==========================================================================
   PRICES — edit this file and nothing else.

   Rules:
     - Plain whole numbers only. No commas, no "AED", no sums like 500+200.
     - Keep the quotes and commas exactly where they are.
     - After editing, open the site and click a service to check a total.

   Last reviewed: August 2026
   ========================================================================== */

const PRICING_CONFIG = {
    currency: 'AED',
    locale: 'en-AE',
    pricesUpdated: 'August 2026',

    // Set to true ONLY once a TRN has been issued. Until then no VAT line,
    // no VAT wording. Charging VAT without registration is a compliance issue.
    vatRegistered: false,
    vatRate: 0.05,

    whatsappNumber: '971509969876',

    // The most extra edited images a visitor can add with the slider.
    maxExtraEdits: 15,

    estimateDisclaimer: 'Indicative estimate. Final quote confirmed before booking.'
};

/* Add-ons shared by more than one service. Per-service lists reference these
   by key, so a price change here applies everywhere it is offered.

   fromPrice: true  -> shows "from AED X" and stops the quote showing an exact
                       total, because the real figure depends on approval or scope.
   atCost:    true  -> adds its own fee but the third-party cost is extra, so the
                       note must appear alongside the estimate. */
const SHARED_ADD_ONS = {
    extraLocation:    { label: 'Additional location', price: 450 },
    extraOutfit:      { label: 'Additional outfit', price: 350, type: 'stepper', max: 3 },
    extraLook:        { label: 'Additional look', price: 300, type: 'stepper', max: 3 },
    extraHour:        { label: 'Additional hour', price: 550, type: 'stepper', max: 4 },
    hmua:             { label: 'Hair and makeup', price: 650, type: 'stepper', max: 4, unit: 'person' },
    secondShooter:    { label: 'Second photographer', price: 1800 },
    express:          { label: 'Express delivery', price: 600 },
    expressWedding:   { label: 'Express gallery (7 days instead of 21)', price: 1200 },
    permits:          { label: 'Permit coordination', price: 300, atCost: true,
                        note: 'Permit fees are charged at cost on top of this estimate. DFTC processing is AED 520 per application; location fees vary by site.' },
    travelUAE:        { label: 'Travel outside Dubai', price: 400 },
    commercialLicence:{ label: '12-month UAE commercial licence', price: 1500, fromPrice: true,
                        note: 'Needed if the images run as advertising. Priced on where and how long they run.' }
};

const SERVICE_PRICING = {
    'pre-wedding': {
        cardTitle: 'Pre-Wedding Photography',
        blurb: 'Intimate storytelling sessions before your big day.',
        formBucket: 'Weddings & Events',
        coverage: 'Photo',
        archetype: 'session',
        extraEditPrice: 50,
        rawFilesIncluded: true,
        tiers: [
            { id: 'session', name: 'The Session', price: 1500, includedEdits: 15, rawValue: 350,
              includes: ['90 minutes', '1 location', '1 outfit', '15 edited images', '10-day delivery'],
              excludes: ['Video', 'Hair and makeup', 'Permit fees'] },
            { id: 'story', name: 'The Story', price: 2900, includedEdits: 30, rawValue: 600, popular: true,
              includes: ['3 hours', '2 locations', '2 outfits', '30 edited images', '30-second vertical reel', '7-day delivery'],
              excludes: ['Hair and makeup', 'Permit fees'] },
            { id: 'feature', name: 'The Feature', price: 4800, includedEdits: 50, rawValue: 600,
              includes: ['5 hours', '3 locations', '3 outfits', '50 edited images', '60-second film', 'Hair and makeup for one person'],
              excludes: ['Permit fees', 'Outfit rental'] }
        ],
        addOns: ['extraLocation', 'extraOutfit', 'hmua', 'permits', 'travelUAE']
    },

    'post-wedding': {
        cardTitle: 'Post-Wedding Sessions',
        blurb: 'Relaxed portraits in your favourite locations.',
        formBucket: 'Weddings & Events',
        coverage: 'Photo',
        archetype: 'session',
        extraEditPrice: 50,
        rawFilesIncluded: true,
        tiers: [
            { id: 'session', name: 'The Session', price: 1500, includedEdits: 15, rawValue: 350,
              includes: ['90 minutes', '1 location', '1 outfit', '15 edited images', '10-day delivery'],
              excludes: ['Video', 'Hair and makeup', 'Permit fees'] },
            { id: 'story', name: 'The Story', price: 2900, includedEdits: 30, rawValue: 600, popular: true,
              includes: ['3 hours', '2 locations', '2 outfits', '30 edited images', '30-second vertical reel', '7-day delivery'],
              excludes: ['Hair and makeup', 'Permit fees'] },
            { id: 'feature', name: 'The Feature', price: 4800, includedEdits: 50, rawValue: 600,
              includes: ['5 hours', '3 locations', '3 outfits', '50 edited images', '60-second film', 'Hair and makeup for one person'],
              excludes: ['Permit fees', 'Outfit rental'] }
        ],
        addOns: ['extraLocation', 'extraOutfit', 'hmua', 'permits', 'travelUAE']
    },

    'wedding-event': {
        cardTitle: 'Wedding & Event Coverage',
        blurb: 'Full photo and video coverage for celebrations and corporate events.',
        formBucket: 'Weddings & Events',
        coverage: 'Photo + Video',
        archetype: 'coverage',
        // No extra-edits slider: coverage packages already deliver hundreds of images.
        extraEditPrice: 0,
        rawFilesIncluded: true,
        groups: [
            {
                id: 'wedding', label: 'Wedding',
                tiers: [
                    { id: 'ceremony', name: 'The Ceremony', price: 5500, rawValue: 900,
                      includes: ['6 hours, one day, one venue', 'One photographer', '400 edited images', '15 images within 72 hours', '21-day gallery'],
                      excludes: ['Video', 'Second photographer', 'Permit fees'] },
                    { id: 'celebration', name: 'The Celebration', price: 9500, rawValue: 900, popular: true,
                      includes: ['10 hours continuous', 'Second photographer for the busiest 5 hours', '700 edited images', '90-second highlight film', '60-second teaser within 5 days', 'Travel across all seven emirates'],
                      excludes: ['Permit fees', 'Additional event days'] },
                    { id: 'legacy', name: 'The Legacy', price: 16500, rawValue: 900,
                      includes: ['Two event days, up to 10 hours each', 'Second photographer both days', '1,000 edited images', '3-5 minute wedding film'],
                      excludes: ['Permit fees', 'Third event day', 'Hair and makeup'] },
                    { id: 'multiday', name: 'Multi-Day & Destination', enquireOnly: true, price: 22000, fromPrice: true,
                      includes: ['Multiple days or destinations', 'Larger crew', 'Scoped to your schedule'],
                      excludes: [] }
                ],
                addOns: ['secondShooter', 'expressWedding', 'permits', 'travelUAE']
            },
            {
                id: 'corporate', label: 'Corporate event',
                tiers: [
                    { id: 'half', name: 'Half Day', price: 2400, rawValue: 600,
                      includes: ['4 hours', '150 edited images', '10 PR selects within 3 hours', 'Full gallery in 24 hours', '12-month UAE usage licence'],
                      excludes: ['Overtime', 'Travel outside Dubai', 'Permit fees'] },
                    { id: 'full', name: 'Full Day', price: 4200, rawValue: 900, popular: true,
                      includes: ['8 hours', '300 edited images', '15 PR selects within 2 hours', 'Full gallery in 24 hours', '12-month UAE usage licence'],
                      excludes: ['Overtime', 'Travel outside Dubai', 'Permit fees'] },
                    { id: 'fullfilm', name: 'Full Day + Film', price: 7500, rawValue: 900,
                      includes: ['8 hours photo and video', '300 edited images', '60-90 second recap reel in 48 hours', '3-minute full edit in 7 days', '12-month UAE usage licence'],
                      excludes: ['Live streaming', 'Permit fees'] }
                ],
                addOns: ['extraHour', 'secondShooter', 'permits', 'travelUAE']
            }
        ]
    },

    'model-portfolio': {
        cardTitle: 'Model Portfolio Sessions',
        blurb: 'High-impact portfolio shoots with styling guidance.',
        formBucket: 'Fashion & Portfolio',
        coverage: 'Photo',
        archetype: 'session',
        extraEditPrice: 50,
        rawFilesIncluded: true,
        tiers: [
            { id: 'digitals', name: 'Digitals & Polaroids', price: 900, includedEdits: 12, rawValue: 350,
              includes: ['60 minutes, studio', '2 looks', 'Full set of unretouched digitals', '12 lightly edited selects', '72-hour delivery'],
              excludes: ['Retouching beyond colour', 'Hair and makeup', 'Location work'] },
            { id: 'build', name: 'Portfolio Build', price: 2800, includedEdits: 30, rawValue: 600, popular: true,
              includes: ['3 hours, studio plus one exterior location', '4 looks', '30 retouched images', 'Comp card layout supplied print-ready', '5-day delivery'],
              excludes: ['Hair and makeup', 'Comp card printing', 'Wardrobe'] },
            { id: 'editorial', name: 'Editorial Story', price: 5500, includedEdits: 40, rawValue: 900,
              includes: ['Full day, up to 8 hours', '2-3 locations', '6 looks', '40 retouched images', 'Hair and makeup for the full day', '60-second behind-the-scenes reel'],
              excludes: ['Wardrobe styling and rental', 'Permit fees', 'Agency fees'] }
        ],
        addOns: ['extraLook', 'hmua', 'express', 'travelUAE']
    },

    'videography': {
        cardTitle: 'Videography',
        blurb: 'Dynamic visual production for reels, events, and campaigns.',
        formBucket: 'Videography',
        coverage: 'Video',
        archetype: 'production',
        extraEditPrice: 0,
        rawFilesIncluded: false,
        rawFilesNote: 'Raw footage handover is available as an add-on.',
        tiers: [
            { id: 'reels', name: 'Reel Pack', price: 2000,
              includedReels: 1, includedFilm: null, includedCutdowns: 0,
              includes: ['3 hours on location', '1 vertical reel', 'Colour grade, licensed music, captions', '5 working days', '1 revision round'],
              excludes: ['Scripting', 'Voiceover', 'Talent', 'Motion graphics'] },
            { id: 'halfday', name: 'Half-Day Production', price: 3200,
              includedReels: 0, includedFilm: '60-90s', includedCutdowns: 2, popular: true,
              includes: ['4 hours on location', '60-90 second film', '2 vertical cutdowns', 'Subtitles burned in and as .srt', '7 working days', '1 revision round', '12-month UAE licence'],
              excludes: ['Professional voiceover', 'Talent', 'Animated graphics', 'Permits'] },
            { id: 'fullday', name: 'Full-Day Production', price: 5800,
              includedReels: 0, includedFilm: '60-90s', includedCutdowns: 2,
              includes: ['8 hours, multiple locations', '90-second film', '2 vertical cutdowns', 'Interview audio with lav and boom', '10 working days', '1 revision round'],
              excludes: ['2-3 minute candid film (upgrade below)', 'Scriptwriting', 'Voiceover artist', 'Talent', 'Permits', 'Studio hire'] },
            { id: 'brand', name: 'Brand Films & Multi-Day', enquireOnly: true, price: 12000, fromPrice: true,
              includes: ['Scoped to your brief', 'Multi-day or multi-location', 'Full pre-production'],
              excludes: [] }
        ],
        // The two formats asked for, priced as upgrades beyond what a tier includes.
        videoOptions: {
            reelFormats: [
                { id: '15s', label: '15-second vertical reel', price: 450, recommended: true },
                { id: '30s', label: '30-second vertical reel', price: 700 }
            ],
            films: [
                { id: 'none', label: 'No candid film', price: 0 },
                { id: '60-90s', label: '60-90 second film', price: 1400 },
                { id: '2-3min', label: '2-3 minute candid film', price: 2600, recommended: true }
            ]
        },
        addOns: ['extraHour', 'permits', 'travelUAE'],
        extraAddOns: {
            cutdown:      { label: 'Additional cutdown', price: 400, type: 'stepper', max: 4 },
            rawFootage:   { label: 'Raw footage handover', price: 1200 },
            expressVideo: { label: 'Express 48-hour turnaround', price: 1500 },
            revision:     { label: 'Additional revision round', price: 450, type: 'stepper', max: 3 }
        }
    },

    'headshots': {
        cardTitle: 'Headshots & Portraits',
        blurb: 'Professional portraits for personal branding and profiles.',
        formBucket: 'Portraits & Headshots',
        coverage: 'Photo',
        archetype: 'session',
        extraEditPrice: 50,
        rawFilesIncluded: true,
        tiers: [
            { id: 'headshot', name: 'The Headshot', price: 750, includedEdits: 5, rawValue: 350,
              includes: ['45-minute studio session', '2 backgrounds', '2 outfit changes', '5 retouched images', '5 working days'],
              excludes: ['Hair and makeup', 'On-location shooting', 'Same-day delivery'] },
            { id: 'brand', name: 'Personal Brand Session', price: 1900, includedEdits: 20, rawValue: 600, popular: true,
              includes: ['2 hours, studio plus office or exterior', '3 outfit changes', '20 retouched images including 8 lifestyle frames', 'Vertical and square crops', '5 previews in 48 hours'],
              excludes: ['Hair and makeup', 'Team members', 'Video'] },
            { id: 'team', name: 'Team Day (on-site)', price: 4800, includedEdits: 30, rawValue: 900,
              perPerson: 320, includedPeople: 15, minPeople: 8,
              includes: ['Mobile studio brought to your office', '4-6 minutes per person', 'Identical lighting and crop across the team', '2 retouched images per person', '12-month commercial licence'],
              excludes: ['Hair and makeup', 'Background cutouts', 'Same-day delivery'] }
        ],
        addOns: ['hmua', 'express', 'travelUAE']
    },

    'newborn': {
        cardTitle: 'Baby & Newborn Shoots',
        blurb: 'Soft, patient sessions built for comfort and safety.',
        formBucket: 'Portraits & Headshots',
        coverage: 'Photo',
        archetype: 'session',
        extraEditPrice: 50,
        rawFilesIncluded: true,
        tiers: [
            { id: 'studio', name: 'Newborn Studio', price: 1200, includedEdits: 10, rawValue: 350,
              includes: ['2-3 hours, baby-led', '3 setups', '10 edited images', '10-day delivery'],
              excludes: ['Family portraits', 'Home visit'] },
            { id: 'family', name: 'Newborn & Family', price: 1800, includedEdits: 15, rawValue: 600, popular: true,
              includes: ['3-4 hours', '5 setups', '15 edited images', 'Family and sibling portraits'],
              excludes: ['Home visit', 'Digital negatives'] },
            { id: 'firstyear', name: 'First Year Story', price: 4200, includedEdits: 45, rawValue: 900,
              includes: ['3 sessions across the year', '4 setups per session', '15 edited images per session'],
              excludes: ['Home visit', 'Additional sessions', 'Framing'] }
        ],
        addOns: ['express', 'travelUAE'],
        extraAddOns: {
            homeVisit:  { label: 'Home visit within Dubai', price: 400 },
            cakeSmash:  { label: 'Cake smash setup', price: 450 },
            maternity:  { label: 'Maternity session bolt-on', price: 900 }
        }
    },

    'product': {
        cardTitle: 'Product Photography',
        blurb: 'Clean studio-style visuals for e-commerce and social campaigns.',
        formBucket: 'Product & Brand',
        coverage: 'Photo',
        archetype: 'volume',
        extraEditPrice: 50,
        rawFilesIncluded: true,
        tiers: [
            { id: 'starter', name: 'Starter Pack', price: 1450, includedEdits: 10, rawValue: 350,
              includes: ['Up to 10 final images', '1-3 SKUs', 'White background, e-commerce ready', '5 working days', '12-month UAE licence'],
              excludes: ['Lifestyle sets', 'Models', 'Video', 'Rush delivery'] },
            { id: 'catalogue', name: 'Catalogue', price: 3900, includedEdits: 40, rawValue: 600, popular: true,
              includes: ['Up to 40 final images', 'Up to 20 SKUs', 'White background plus one styled set-up', 'Multiple angles per SKU', '7 working days'],
              excludes: ['Models', 'Location work', 'Video', 'Paid-media licence'] },
            { id: 'campaign', name: 'Campaign Day', price: 6800, includedEdits: 60, rawValue: 900,
              includes: ['Full shoot day', 'Up to 60 final images', 'Styled lifestyle, hero product, flat lays', 'Art direction and mood board', '10 working days'],
              excludes: ['Talent and model fees', 'Location and permit fees', 'Full video production'] },
            { id: 'volume', name: 'High Volume', enquireOnly: true, price: 65, fromPrice: true, perImage: true,
              includes: ['100+ SKUs', 'Recurring catalogue refreshes', 'Fixed per-image rate quoted within 24 hours'],
              excludes: [] }
        ],
        addOns: ['express', 'commercialLicence'],
        extraAddOns: {
            productVideo:   { label: '10-second product video clip', price: 450, type: 'stepper', max: 5 }
        }
    },

    'automobile': {
        cardTitle: 'Automobile Shoots',
        blurb: 'Sleek automotive imagery in urban and natural scenes.',
        // Automotive work is usually put to commercial use, so it triages with brand work.
        formBucket: 'Product & Brand',
        coverage: 'Photo',
        archetype: 'session',
        extraEditPrice: 150,
        rawFilesIncluded: true,
        tiers: [
            { id: 'owner', name: "Owner's Session", price: 1800, includedEdits: 15, rawValue: 350,
              includes: ['90 minutes', '1 vehicle', '1 location', '15 edited images', '5-day delivery', 'Personal use'],
              excludes: ['Video', 'Rolling shots', 'Permit fees', 'Commercial use'] },
            { id: 'goldenhour', name: 'Golden Hour Feature', price: 3400, includedEdits: 30, rawValue: 600, popular: true,
              includes: ['3 hours', '1-2 vehicles', '2 locations', '30 edited images', '15-second vertical reel', 'Rolling shots at legal speeds'],
              excludes: ['Permit and location fees', 'Closed-road access', 'Commercial use'] },
            { id: 'commercial', name: 'Commercial / Dealer', price: 4500, fromPrice: true, includedEdits: 40, rawValue: 900,
              includes: ['Full day', 'Up to 4 vehicles', '40 edited images', '30-60 second film with 3 cutdowns', '12-month UAE commercial licence included'],
              excludes: ['Closed-road permits', 'Talent'] }
        ],
        addOns: ['extraLocation', 'permits', 'travelUAE', 'commercialLicence'],
        extraAddOns: {
            extraVehicle: { label: 'Additional vehicle', price: 450, type: 'stepper', max: 4 },
            rollingShoot: { label: 'Tracking-vehicle rolling shoot', price: 900 },
            nightShoot:   { label: 'Night / light-painting session', price: 1200 }
        }
    }
};
