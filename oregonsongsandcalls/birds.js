// Oregon Bird Song Challenge - Bird Database
// Contains information on 30 common Western Oregon birds organized by category

const birdsDatabase = [
    // Common Backyard Birds
    {
      id: 1,
      commonName: "American Robin",
      scientificName: "Turdus migratorius",
      category: ["Common Backyard Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/NHMQPROGZS/XC655482-210509_003%20American%20Robin.mp3",
      description: "Medium-sized songbird with rusty-orange breast and gray-brown back. Known for its clear, cheerful song consisting of several phrases."
    },
    {
      id: 2,
      commonName: "Black-capped Chickadee",
      scientificName: "Poecile atricapillus",
      category: ["Common Backyard Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/XWQNKEOUWT/XC582534-Black-capped%20Chickadee%20chickadee%20Dec%202%202019%20Ithaca%20NY.mp3",
      description: "Small bird with black cap and throat, white cheeks, and grayish back. Distinctive 'chick-a-dee-dee-dee' call."
    },
    {
      id: 3,
      commonName: "Dark-eyed Junco",
      scientificName: "Junco hyemalis",
      category: ["Common Backyard Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/VSBFYBDQEW/XC741513-230117_Dark-eyed%20Junco_trills_NY.mp3",
      description: "Small sparrow with dark hood, white belly, and distinctive white outer tail feathers visible in flight. Trill-like song and sharp 'tick' calls."
    },
    {
      id: 4,
      commonName: "Song Sparrow",
      scientificName: "Melospiza melodia",
      category: ["Common Backyard Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/OOECIWCSWV/XC736692-Song%20sparrow%202_221224.mp3",
      description: "Medium-sized sparrow with heavily streaked breast and central spot. Complex song starts with distinct notes followed by a buzzy trill."
    },
    {
      id: 5,
      commonName: "Spotted Towhee",
      scientificName: "Pipilo maculatus",
      category: ["Common Backyard Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/AITHJBIPVO/XC634841-210315-142446%20Spotted%20Towhee%20MOSL.mp3",
      description: "Large sparrow with black upper parts (male), white belly, rufous sides, and white spots on wings. Song is a rising 'drink-your-teeeee'."
    },
    {
      id: 6,
      commonName: "Anna's Hummingbird",
      scientificName: "Calypte anna",
      category: ["Common Backyard Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/BPSDKWYAPC/XC643288-210424%20CUH%20Anna%27s%20hummingbird%20singing%204.mp3",
      description: "Compact hummingbird with green back and iridescent rose-pink throat (male). Squeaky, electrical buzzing calls and a distinctive diving display sound."
    },
    {
      id: 7,
      commonName: "American Crow",
      scientificName: "Corvus brachyrhynchos",
      category: ["Common Backyard Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/QAJPJJRJUDI/XC733662-American%20Crow_221120.mp3",
      description: "Large all-black bird with fan-shaped tail. Well-known for its harsh 'caw-caw' calls."
    },
    {
      id: 8,
      commonName: "House Finch",
      scientificName: "Haemorhous mexicanus",
      category: ["Common Backyard Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/ZEPUUCOIZN/XC677334-HOUFI011_180528.mp3",
      description: "Small finch with streaked body; males have red head and breast. Song is a warbling series of notes ending in a slight downward slur."
    },
    {
      id: 9,
      commonName: "Northern Flicker",
      scientificName: "Colaptes auratus",
      category: ["Common Backyard Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/YTUXOCTUEM/XC616439-210130_YellowShNorthernFlicker_CallsAwayFromDrum.mp3",
      description: "Large woodpecker with brown barred back, spotted underparts, and red nape crescent. Loud 'wicka-wicka-wicka' call and distinctive drumming."
    },
    {
      id: 10,
      commonName: "Steller's Jay",
      scientificName: "Cyanocitta stelleri",
      category: ["Common Backyard Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/BPSDKWYAPC/XC747764-230201%20Steller%27s%20jays%20talking%2C%20cuz%20they%27re%20jays.mp3",
      description: "Crested, blue and black jay with prominent head crest. Produces a variety of harsh, scolding calls and excellent mimicry."
    },
    
    // Water & Wetland Birds
    {
      id: 11,
      commonName: "Great Blue Heron",
      scientificName: "Ardea herodias",
      category: ["Water & Wetland Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/KSIMQOBPEK/XC711323-GBHE%20call.mp3",
      description: "Tall wading bird with blue-gray plumage, long neck, and dagger-like bill. Makes deep, hoarse croaking or squawking sounds."
    },
    {
      id: 12,
      commonName: "Mallard",
      scientificName: "Anas platyrhynchos",
      category: ["Water & Wetland Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/SDPCHKOHRH/XC650045-NV210426%20RWBB%20Mallard.mp3",
      description: "Common duck with green head (male), orange feet, and curled tail feathers. Females give the familiar 'quack' while males produce a softer raspy call."
    },
    {
      id: 13,
      commonName: "Canada Goose",
      scientificName: "Branta canadensis",
      category: ["Water & Wetland Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/SDPCHKOHRH/XC704536-MN220424%20CANG.mp3",
      description: "Large goose with black head and neck, white chinstrap, and brown body. Produces the familiar honking call, especially in flight."
    },
    {
      id: 14,
      commonName: "Red-winged Blackbird",
      scientificName: "Agelaius phoeniceus",
      category: ["Water & Wetland Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/COLQGYQDCJ/XC612284-RWBL%20(Red-winged%20Blackbird)%20-%20Agelaius%20phoeniceus%20-%20song%20-%2004-02-21%20-%20Timber%20Shadows%20Ln.%2C%20Spicewood%2C%20TX.mp3",
      description: "Medium-sized blackbird; males have red and yellow shoulder patches. Song is a liquid 'conk-la-ree!' with distinctive harsh 'check' calls."
    },
    {
      id: 15,
      commonName: "Belted Kingfisher",
      scientificName: "Megaceryle alcyon",
      category: ["Water & Wetland Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/VQHUXVYMHL/XC607701-beki%20calls.mp3",
      description: "Medium-sized bird with large head, shaggy crest, and dagger-like bill. Known for its harsh, rattling call often given in flight."
    },
    {
      id: 16,
      commonName: "Wood Duck",
      scientificName: "Aix sponsa",
      category: ["Water & Wetland Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/QAJPJJRJUDI/XC713602-WoodDuck_220629.mp3",
      description: "Ornate, colorful duck with crested head and iridescent plumage. Males make a squealing 'jeeeee' while females produce a drawn-out 'oo-eek'."
    },
    {
      id: 17,
      commonName: "American Coot",
      scientificName: "Fulica americana",
      category: ["Water & Wetland Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/XDCXICMRTM/XC603686-AMCO_UT_Dec20.mp3",
      description: "Duck-like waterbird with slate-gray body and white bill. Makes a variety of pullet-like clucking, purring, and pumping sounds."
    },
    {
      id: 18,
      commonName: "Great Egret",
      scientificName: "Ardea alba",
      category: ["Water & Wetland Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/QAJPJJRJUDI/XC738559-GreatEgret_221232.mp3",
      description: "Tall, white wading bird with long yellow bill and black legs. Produces hoarse croaks and squawks similar to herons."
    },
    {
      id: 19,
      commonName: "Cinnamon Teal",
      scientificName: "Spatula cyanoptera",
      category: ["Water & Wetland Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/YTUXOCTUEM/XC603991-200418_CinnamonTeal_calls_001.mp3",
      description: "Small duck with cinnamon-red plumage (males) and mottled brown (females). Males give a low, rattling call; females have a quack similar to Mallards."
    },
    {
      id: 20,
      commonName: "Common Yellowthroat",
      scientificName: "Geothlypis trichas",
      category: ["Water & Wetland Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/COLQGYQDCJ/XC636118-COYE%20(Common%20Yellowthroat)%20-%20Geothlypis%20trichas%20-%20song%20-%2005-09-21%20-%20Hornsby%20Bend%2C%20TX.mp3",
      description: "Small warbler with bright yellow throat and black mask (male). Song is a distinctive 'witchity-witchity-witchity'."
    },
    
    // Forest & Mountain Birds
    {
      id: 21,
      commonName: "Varied Thrush",
      scientificName: "Ixoreus naevius",
      category: ["Forest & Mountain Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/BPSDKWYAPC/XC608752-210101%20Varied%20thrush%20song%20UBNA.mp3",
      description: "Robin-like thrush with orange-and-black plumage and black breast band. Haunting, ethereal song consisting of a single whistled note on one pitch."
    },
    {
      id: 22,
      commonName: "Pileated Woodpecker",
      scientificName: "Dryocopus pileatus",
      category: ["Forest & Mountain Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/ZNCDXTUOFL/XC699941-220218_Pileated%20Woodpecker.mp3",
      description: "Crow-sized woodpecker with flaming red crest and white neck stripe. Loud, resonant drumming and high, clear 'cuk-cuk-cuk' calls."
    },
    {
      id: 23,
      commonName: "Pacific Wren",
      scientificName: "Troglodytes pacificus",
      category: ["Forest & Mountain Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/BPSDKWYAPC/XC645142-210507%20Pacific%20wren%20UBNA.mp3",
      description: "Tiny, round-bodied wren with short tail often held upright. Song is an incredibly complex, bubbling series of high-pitched notes."
    },
    {
      id: 24,
      commonName: "Western Tanager",
      scientificName: "Piranga ludoviciana",
      category: ["Forest & Mountain Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/LAXBXVPBRU/XC595486-Western_Tanager_5-4-21.mp3",
      description: "Medium-sized songbird with yellow body, black wings, and red head (male). Song is similar to American Robin but harsher, with a rising 'pi-ti-pit'."
    },
    {
      id: 25,
      commonName: "Hermit Thrush",
      scientificName: "Catharus guttatus",
      category: ["Forest & Mountain Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/AITHJBIPVO/XC634788-210411-111551%20Hermit%20Thrush%20MOSL.mp3",
      description: "Small thrush with spotted breast and rufous tail. Song begins with a clear, flute-like note followed by ethereal, echoing phrases."
    },
    {
      id: 26,
      commonName: "Olive-sided Flycatcher",
      scientificName: "Contopus cooperi",
      category: ["Forest & Mountain Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/BPSDKWYAPC/XC638577-210327%20Olive-sided%20flycatcher%20singing%20Scatter%20Creek.mp3",
      description: "Medium-sized flycatcher with olive-gray sides and white patch down middle of dark breast. Distinctive 'quick, three beers!' whistled song."
    },
    {
      id: 27,
      commonName: "Wilson's Warbler",
      scientificName: "Cardellina pusilla",
      category: ["Forest & Mountain Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/BPSDKWYAPC/XC644918-210505%20Wilson%27s%20warbler%20UBNA.mp3",
      description: "Small, bright yellow warbler with black cap (male). Song is a descending, accelerating series of chirps."
    },
    {
      id: 28,
      commonName: "Swainson's Thrush",
      scientificName: "Catharus ustulatus",
      category: ["Forest & Mountain Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/BPSDKWYAPC/XC645141-210507%20Swainson%27s%20thrush%20UBNA.mp3",
      description: "Medium-sized thrush with spotted breast and olive-brown upperparts. Song is an upward-spiraling, flute-like series of notes."
    },
    {
      id: 29,
      commonName: "Evening Grosbeak",
      scientificName: "Coccothraustes vespertinus",
      category: ["Forest & Mountain Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/ZNCDXTUOFL/XC583183-191231_1248_EVGR.mp3",
      description: "Stocky finch with large bill and yellow-and-black plumage (male). Calls include clear, ringing chirps and trills."
    },
    {
      id: 30,
      commonName: "Red-breasted Nuthatch",
      scientificName: "Sitta canadensis",
      category: ["Forest & Mountain Birds"],
      soundUrl: "https://xeno-canto.org/sounds/uploaded/ZNCDXTUOFL/XC700056-220220_Red-breasted%20Nuthatch.mp3",
      description: "Small nuthatch with blue-gray back, rusty underparts, and black-and-white face pattern. Makes nasal 'yank-yank' calls."
    }
  ];
  
  // Export the database for use in other scripts
  export default birdsDatabase;