/* ============================================================
   Ju.en.vie · Traduction anglaise des données de liens.js
   ============================================================
   Chargé uniquement par les pages anglaises (dossier en/), juste après
   liens.js. main.js applique ces textes par dessus les fiches françaises :
   les liens, les codes, les logos et les statuts restent ceux de liens.js,
   seuls les textes affichés changent.

   Règle : chaque fois qu'un texte affiché change dans liens.js, le changer
   ici aussi. Un champ absent ici garde son texte français.
   ============================================================ */

const LIENS_EN = {
  "comparatif-assurance": {
    nom: "Which travel insurance to choose",
    resume: "Bank card, limits, excess, excluded sports: how to read a policy.",
    libelleAction: "Read the comparison",
  },
  "comparatif-esim": {
    nom: "Which eSIM to choose",
    resume: "eSIM, local SIM card or roaming: what costs least depending on the trip.",
    libelleAction: "Read the comparison",
  },
  "getyourguide": {
    resume: "Guided tours, activities and tickets all over the world.",
    pourQui: "Anyone who wants to book tomorrow's activity the night before without overthinking it.",
    avantage: "5% off",
    avantages: [
      "Free cancellation up to twenty four hours before on most activities",
      "Tickets on your phone, nothing to print",
      "Lots of verified reviews on the most booked activities",
    ],
    inconvenients: [
      "Small local operators are sometimes cheaper if you book direct",
      "The choice shrinks fast outside the big destinations",
    ],
  },
  "klook": {
    resume: "Activities, transport and passes, unbeatable in Asia.",
    pourQui: "Anyone travelling in Asia who wants to book transport and activities from their phone.",
    avantages: [
      "Very strong in Asia: airport transfers, SIM cards, transport passes",
      "Prices often lower than at the ticket office",
      "Last minute booking possible on many activities",
    ],
    inconvenients: [
      "Limited coverage in Europe and the Americas",
      "Busy interface, crowded with promotions",
    ],
  },
  "booking": {
    resume: "Hotels and places to stay, the most complete booking app.",
    pourQui: "Anyone who books as they go and needs to be able to cancel everything.",
    avantages: [
      "Free cancellation on a large share of rooms",
      "Precise filters and a map view to choose a neighbourhood rather than a hotel",
      "Genius programme that unlocks discounts as you stay more",
    ],
    inconvenients: [
      "Service fees do not always show up before the last step",
      "Constant sales pressure: counters, alerts, last rooms left",
    ],
  },
  "hostelworld": {
    resume: "Hostels for social, low budget travel.",
    pourQui: "Anyone travelling solo who picks a hostel for its vibe as much as its price.",
    avantages: [
      "The biggest choice of hostels, with detailed reviews of the atmosphere",
      "Useful filters: female dorms, average age, activities on offer",
      "Booking possible with just a deposit",
    ],
    inconvenients: [
      "Booking fees on top of the deposit",
      "Not very relevant as soon as you want a regular hotel",
    ],
  },
  "mad-monkey": {
    resume: "A network of social hostels in Australia and Southeast Asia.",
    accroche: "The hostels I stayed in in Sydney and Cairns, with a themed party every night.",
    avis: "A great experience at Mad Monkey Bayswater in Sydney as well as Mad Monkey Central in Cairns. There are themed parties every night, and it is the easiest way to meet people when you arrive somewhere without knowing anyone.",
    depuisQuand: "Since I arrived in Australia, in 2026",
    pourQui: "Anyone travelling solo who wants a hostel where it is easy to meet people.",
    avantage: "10% off",
    libelleAction: "Book",
    jeUtilisePour: [
      "My nights in Sydney and Cairns during my working holiday",
    ],
    avantages: [
      "10% off with the code, when you book on the official website",
      "Social hostels designed for meeting people as soon as you arrive",
      "In Australia and several countries in Southeast Asia",
    ],
    inconvenients: [
      "The code only works when you book directly on the Mad Monkey website",
      "The network does not cover every city, check before building your itinerary around it",
    ],
  },
  "expedia": {
    resume: "Flights, hotels and packages in one place.",
    pourQui: "Anyone who wants to sort out flight and hotel in one go for a short trip.",
    avantages: [
      "Flight and hotel in a single booking, often cheaper than separately",
      "One Key programme shared with Hotels.com",
      "Flight changes possible on some tickets",
    ],
    inconvenients: [
      "A problem with the flight becomes a three way case: the airline, the platform, the hotel",
      "Customer service is the weak point when a trip goes wrong",
    ],
  },
  "saily": {
    resume: "A simple, affordable eSIM, created by the NordVPN team.",
    accroche: "Easy to install before you even land, no more hassle at the duty free.",
    avis: "The eSIM is installed before you leave and works the second the plane touches down. No more hunting for a shop in an airport at midnight, no more SIM card bought at three times the price at the duty free. It is data only, but when I travel I have never needed anything else.",
    depuisQuand: "For several years",
    pourQui: "Anyone who wants to be online as they step off the plane, without looking for a shop.",
    avantage: "5% off",
    jeUtilisePour: [
      "Having internet as soon as I arrive in a country",
    ],
    avantages: [
      "Installed before you leave, active as soon as you land",
      "Clear app, data use tracked in real time",
      "Regional plans that cover several countries at once",
    ],
    inconvenients: [
      "Smaller catalogue than older providers for rare destinations",
      "Data only, no calls or texts",
    ],
  },
  "holafly": {
    resume: "Unlimited data eSIMs in more than 200 destinations.",
    pourQui: "Anyone leaving for a long time, to more exotic destinations, who does not want to count gigabytes.",
    avantage: "5% off",
    avantages: [
      "Unlimited data in more than 200 destinations, with a global eSIM and more than 15 regional eSIMs",
      "Installed in two minutes, and your WhatsApp number does not change",
      "Human support 24/7, refund possible within 6 months",
      "The code can be reused on every eSIM, and gives 10% off Holafly Plans for 12 months",
    ],
    inconvenients: [
      "Hotspot sharing depends on the plan and the destination, check before you buy",
      "For a short trip with little data use, a per gigabyte plan may be enough",
    ],
  },
  "wise": {
    resume: "Multi currency account and payments abroad with no hidden fees.",
    pourQui: "Anyone paid in one currency and spending in another.",
    avantages: [
      "The real exchange rate, with no margin hidden in the rate",
      "Multi currency account with real local bank details",
      "Fees shown clearly before you confirm a transfer",
    ],
    inconvenients: [
      "It is not a bank: no overdraft, no credit, no cash deposits",
      "A transfer can take a working day depending on the currency",
    ],
  },
  "revolut": {
    resume: "Travel card, instant exchange and separate budgets.",
    pourQui: "Anyone who wants a free travel card and an app that does everything from the phone.",
    avantages: [
      "Payments in foreign currency with no fees within your plan's limit",
      "Complete app: budgets, sub accounts, instant transfers",
      "Disposable virtual card for online payments",
    ],
    inconvenients: [
      "Weekend exchange rate markup on free plans",
      "Withdrawal limits reached quickly without a paid plan",
    ],
  },
  "trade-republic": {
    resume: "Interest bearing account and investing, with a card included.",
    pourQui: "Anyone who wants to invest small amounts regularly without paying brokerage fees.",
    avantages: [
      "Stock orders for a one euro fee",
      "Free scheduled savings plans on ETFs",
      "Interest paid on uninvested cash",
    ],
    inconvenients: [
      "Investing carries a risk of capital loss",
      "Deliberately minimal interface, few analysis tools",
    ],
  },
  "boursobank": {
    resume: "A complete French online bank, with a free card.",
    pourQui: "Anyone who wants to keep a French IBAN for their salary, taxes and direct debits. Reserved for French residents.",
    avantage: "Up to 150€ offered",
    avantages: [
      "French online bank, with a real FR IBAN",
      "No fees on payments and withdrawals abroad with the premium cards",
      "Regular welcome bonus when you open an account",
    ],
    inconvenients: [
      "Income or usage conditions to meet depending on the card",
      "Fees abroad depend on the card you choose, check before you leave",
    ],
  },
  "fortuneo": {
    resume: "Online bank, free card and no fee payments abroad.",
    pourQui: "Anyone looking for a French bank with an insured card for travelling. Reserved for French residents.",
    avantage: "140€ offered",
    avantages: [
      "Gold Mastercard with no annual fee subject to usage conditions",
      "Travel insurance and assistance included with the premium cards",
      "French IBAN",
    ],
    inconvenients: [
      "Income conditions to access the best cards",
      "A less feature rich app than the neobanks",
    ],
  },
  "amex": {
    resume: "International payment card, loyalty programme and travel benefits.",
    pourQui: "Anyone who mostly travels where the card is accepted and wants solid insurance.",
    avantages: [
      "Travel and purchase insurance among the most complete on the market",
      "Points programme convertible into air miles",
      "Customer service known for helping in disputes with a merchant",
    ],
    inconvenients: [
      "Limited acceptance outside big cities, especially in Southeast Asia",
      "Annual fee on most cards",
    ],
  },
  "chapka": {
    resume: "French travel insurance, a reference for working holidays and round the world trips.",
    accroche: "The insurance I took out for my working holiday year in Australia.",
    avis: "I took it out for my working holiday in Australia, about 400 € for the year. It is the policy most clearly designed for working holiday makers: it is written for that exact case, not for a two week trip with an option added on. Before signing up, check line by line whether the sports you do are covered or need an option. Their website is in French.",
    depuisQuand: "Since I left on my working holiday, in 2026",
    pourQui: "Anyone leaving for several months or on a working holiday who wants a policy designed for that length of stay.",
    jeUtilisePour: [
      "My working holiday year in Australia",
    ],
    avantages: [
      "Policies dedicated to working holidays and long stays",
      "Medical costs covered up to several hundred thousand euros",
      "French broker: policy, quotes and customer service in French",
    ],
    inconvenients: [
      "Some sports and activities need a paid option on top",
      "You often have to pay the costs upfront before being reimbursed",
    ],
  },
  "powerbank-voyage": {
    nom: "Power bank",
    resume: "A power bank to last a full day of travel.",
    pourQui: "Anyone going from night buses to airports to whole days away from a socket.",
    avantages: [
      "Charges your phone several times over a day of travel",
      "Recent USB C models can also charge a laptop",
    ],
    inconvenients: [
      "Not allowed in the hold, it has to stay in the cabin",
      "Above a hundred watt hours, you need the airline's approval",
    ],
  },
  "adaptateur-universel": {
    nom: "Universal adapter",
    resume: "One adapter to plug in anywhere in the world.",
    pourQui: "Anyone changing countries several times on the same trip.",
    avantages: [
      "A single item for every continent",
      "Models with USB ports save you carrying several chargers",
    ],
    inconvenients: [
      "An adapter does not convert voltage, only the shape of the plug",
      "Bulky and heavy compared with a simple adapter",
    ],
  },
  "souvence": {
    resume: "Personalised photo books to keep your trips alive.",
  },
  "pvt-australie-section": {
    nom: "Working holiday in Australia",
    resume: "Visa 417, insurance, budget, bank, arrival and the 88 days.",
    libelleAction: "See the section",
  },
  "guides-juenvie": {
    nom: "My travel guides",
    resume: "My guides by destination: Bali, Laos, Vietnam, Australia.",
    libelleAction: "Read my guides",
  },
  "adidas-adizero": {
    resume: "Adidas's running range built for speed and the marathon.",
    pourQui: "Anyone chasing a time who wants a shoe for fast sessions or race day.",
    avantages: [
      "A range designed entirely for speed",
      "Carbon plate on the racing models, with a very noticeable energy return",
      "Among the lightest on the market",
    ],
    inconvenients: [
      "Short lifespan on the plated models",
      "Firm cushioning, not great for long, slow runs",
    ],
  },
  "asics": {
    resume: "A running reference, from the daily jog to race day.",
    pourQui: "Anyone looking for a reliable training shoe that lasts a whole season.",
    avantages: [
      "Well established Gel range for daily training",
      "Durable outsoles",
      "Several widths available on some models",
    ],
    inconvenients: [
      "Heavier than the competition at an equivalent level",
      "Lots of very similar models, hard to find your way",
    ],
  },
  "garmin": {
    resume: "The reference GPS watches for tracking your training.",
    pourQui: "Anyone following a training plan who wants reliable data over time.",
    avantages: [
      "Battery life from several days to several weeks depending on the model",
      "Built in maps and navigation on the high end models",
      "Detailed, exportable training data",
    ],
    inconvenients: [
      "High price on the full featured models",
      "Dense interface, it takes time to get used to",
    ],
  },
  "nutripure": {
    resume: "French supplements, with clean and transparent formulas.",
    pourQui: "Anyone who wants to supplement their diet and reads the label first.",
    avantages: [
      "French brand, with detailed composition and ingredient origins",
      "Wide range: protein, magnesium, omega three",
      "Anti doping tests on some of the products",
    ],
    inconvenients: [
      "A supplement never replaces a well built diet",
      "More expensive than supermarket brands",
    ],
  },
  "decathlon-nutrition": {
    resume: "Effective sports nutrition at a low price.",
    pourQui: "Beginners who want to try gels and drinks without spending a fortune.",
    avantages: [
      "The best balance between price and quantity to get started",
      "Available in shops all over France",
      "A simple range, few pointless products",
    ],
    inconvenients: [
      "More basic formulas than the specialist brands",
      "Limited choice of flavours",
    ],
  },
  "compex": {
    resume: "Electrical muscle stimulation for recovery.",
    pourQui: "Anyone who needs to recover fast between sessions, or keep a muscle active during an injury.",
    avantages: [
      "Muscle stimulation for recovery as well as strengthening",
      "Guided programmes, few settings to figure out",
      "Used sitting down, with no effort at all",
    ],
    inconvenients: [
      "Placing the electrodes in the right spot takes practice",
      "The electrodes are consumables to buy again regularly",
    ],
  },
  "app-running": {
    nom: "Running app",
    resume: "My training app, soon described here.",
    pourQui: "Beginners who want to structure their training before investing in a watch.",
    avantages: [
      "Tracks your sessions and progress over time",
      "Guided plans for a first ten kilometres or a marathon",
      "A social side that really helps you stay consistent",
    ],
    inconvenients: [
      "The really useful features are almost always behind a subscription",
      "Phone GPS is less accurate than a watch",
    ],
  },
  "dji-osmo-action": {
    resume: "A stabilised action camera for filming on the move.",
    pourQui: "Anyone filming alone, on the move, who needs to see themselves while shooting.",
    avantages: [
      "Two screens, including one at the front to frame yourself",
      "Effective stabilisation with no accessories",
      "Batteries that handle the cold better than the competition",
    ],
    inconvenients: [
      "A smaller range of accessories than the leading action camera brand",
      "Can overheat in high resolution on long takes",
    ],
  },
  "dji-mini": {
    resume: "A drone under 250 g, perfect for travelling.",
    pourQui: "Anyone travelling light who wants aerial shots without carrying a case of gear.",
    avantages: [
      "Under two hundred and fifty grams: lighter rules in many countries",
      "Fits in a backpack pocket",
      "Image quality far above what its weight suggests",
    ],
    inconvenients: [
      "Sensitive to wind, a direct result of its lightness",
      "Flight rules still need checking country by country before you take off",
    ],
  },
  "micro-dji": {
    nom: "DJI Mic",
    resume: "A compact wireless mic for clean sound in vlogs.",
    pourQui: "Anyone talking to camera who wants clean sound without someone holding a boom.",
    avantages: [
      "Clip on transmitter, no cable between mic and camera",
      "Backup recording in the transmitter: the take is saved even if the link drops",
      "More than enough range outdoors",
    ],
    inconvenients: [
      "The charging case is one more thing not to forget",
      "The transmitter shows on camera on light clothing",
    ],
  },
  "powerbank-createur": {
    nom: "High capacity power bank",
    resume: "To charge camera, drone and phone during a shoot.",
    pourQui: "Anyone filming all day far from any socket.",
    avantages: [
      "Charges camera, drone and phone over a full day of filming",
      "A powerful USB C model can also charge a laptop",
    ],
    inconvenients: [
      "Has to travel in the cabin, never in the hold",
      "The weight climbs very fast with capacity",
    ],
  },
  "anker": {
    resume: "Reliable chargers, cables and batteries.",
    pourQui: "Anyone who wants a single charger for laptop, camera and phone.",
    avantages: [
      "Compact, powerful GaN chargers",
      "Serious reliability and warranty",
      "Complete range: chargers, cables, batteries, hubs",
    ],
    inconvenients: [
      "Confusing model names from one generation to the next",
      "More expensive than no name brands",
    ],
  },
  "ugreen": {
    resume: "Clever hubs, adapters and charging accessories.",
    pourQui: "Anyone who needs a specific adapter without paying big brand prices.",
    avantages: [
      "Hubs and adapters at a reasonable price",
      "Well built cables for the price range",
      "A very wide choice of rare connectors",
    ],
    inconvenients: [
      "Uneven quality from one product to another",
      "Basic technical documentation",
    ],
  },
  "canva-pro": {
    resume: "Visuals, thumbnails and brand documents in a few minutes.",
    pourQui: "Anyone who needs to produce clean thumbnails and visuals fast without being a designer.",
    avantages: [
      "Instant to pick up, no training needed",
      "Automatic resizing of a visual into every format",
      "Photo and template library included in the subscription",
    ],
    inconvenients: [
      "The most used templates give visuals that all look alike",
      "Limited typographic control compared with real layout software",
    ],
  },
  "capcut-pro": {
    resume: "Mobile and desktop editing, brilliant for short formats.",
    pourQui: "Anyone posting short formats who wants to edit from their phone.",
    avantages: [
      "Fast vertical editing, designed for social media",
      "Decent automatic subtitles, including in French",
      "Mobile and desktop versions kept in sync",
    ],
    inconvenients: [
      "Terms of use to read carefully for commercial use",
      "Trendy effects date a video within a few months",
    ],
  },
  "lightroom": {
    resume: "Photo editing and colour grading, on mobile and desktop.",
    pourQui: "Anyone shooting in RAW who wants consistent editing from one image to the next.",
    avantages: [
      "Non destructive editing, the original can always be recovered",
      "Sync between phone and computer",
      "Reusable presets to keep a consistent visual identity",
    ],
    inconvenients: [
      "A monthly subscription with no end",
      "The included storage quickly becomes too small",
    ],
  },
};

const CATEGORIES_EN = {
  voyage: {
    nom: "Travel",
    description: "Bookings, connectivity, banks, insurance and bags. Everything that lets me travel far, for a long time, with a light mind.",
    sousCategories: {
      comparatifs: "My comparisons",
      reservation: "Bookings and activities",
      esim: "eSIM and connectivity",
      banque: "Banks and money",
      assurance: "Travel insurance",
      bagages: "Bags and accessories",
      souvenirs: "Photo books",
      guides: "My travel guides",
    },
  },
  sport: {
    nom: "Sport",
    description: "Shoes, watches, nutrition and recovery. The setup that takes me from the morning jog to the marathon finish line.",
    sousCategories: {
      chaussures: "Shoes",
      montres: "Watches and data",
      nutrition: "Nutrition and hydration",
      recuperation: "Recovery",
      applications: "Running apps",
    },
  },
  creation: {
    nom: "Creation",
    description: "Cameras, drone, mics, accessories and software. All the gear behind my videos, from filming to editing.",
    sousCategories: {
      materiel: "Video gear",
      accessoires: "Accessories",
      logiciels: "Software and apps",
    },
  },
};

const COLLECTIONS_EN = {
  "pvt-australie": {
    titre: "Working holiday in Australia",
    sousTitre: "The kit I sort out first before leaving on a working holiday.",
  },
};

const BADGES_EN = {
  prefere: "My favourite",
  "qualite-prix": "Great value for money",
  debutant: "Beginner",
  professionnel: "Professional",
  "plus-utilise": "Most used",
  voyage: "Travel",
  running: "Running",
  creation: "Creation",
};
