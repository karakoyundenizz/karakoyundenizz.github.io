/* ════════════════════════════════════════════════════════════════════
   content.js — the ONLY file you need to edit to change what the site says.
   Every node of the tree lives here. Renderers contain zero copy.

   Item fields:
     id        unique slug
     title     card + node heading
     node      short label shown on the tree leaf (defaults to title)
     subtitle  org · dates line
     icon      id of an <symbol> in index.html (without "i-")
     summary   one-liner under the subtitle
     bullets   [] of strings (plain text, keep them punchy)
     tags      [] of tech chips
     links     [] of {label, href, kind: web|github|appstore|playstore|email|linkedin}
     media     [] of {src, alt, w, h, wide} — screenshot/photo strip; files that
               don't exist yet are skipped silently, so you can pre-wire photo
               slots. w/h = intrinsic pixel size (prevents layout shift);
               wide: true → landscape frame
     flagship  true → bigger "golden fruit" leaf + richer card
     theme     "dark" → card header gets the near-black Phera band
     note      handwritten footnote at the bottom of the card
     hidden    true → item disappears from the site (easy pruning)
     dx, dy    optional fine-tune offset of the leaf, in stage pixels
   ════════════════════════════════════════════════════════════════════ */

window.PORTFOLIO = window.PORTFOLIO || {};

window.PORTFOLIO.CONTENT = {

  /* card that opens when someone clicks the root node (me!) */
  about: {
    id: "about",
    title: "Deniz Karakoyun",
    subtitle: "Computer Engineering @ METU · Ankara, Türkiye",
    icon: "tree",
    summary: "Happiest a few layers below the surface — Assembly, OS internals, and making code faster cycle by cycle.",
    bullets: [
      "How I work: understand the problem, design the algorithm, write it efficiently, test it well.",
      "Built two live products — Guild and Phera Labs, each co-founded with a friend — but my compass points at OS and low-level systems, with algorithm design a close second.",
      "Outside code: time with friends and anything physical — tennis, volleyball, basketball, camping, cycling, fitness.",
    ],
    tags: [],
    links: [
      { label: "Download CV", href: "assets/cv/Deniz_Karakoyun_CV.pdf", kind: "download", download: true },
      { label: "GitHub", href: "https://github.com/karakoyundenizz", kind: "github" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/deniz-karakoyun-2235b922a/", kind: "linkedin" },
      { label: "karakoyun.deniz@metu.edu.tr", href: "mailto:karakoyun.deniz@metu.edu.tr", kind: "email" },
    ],
    note: "root node = me. everything else grew from here.",
  },

  sections: [

    /* ─────────────── EDUCATION ─────────────── */
    {
      id: "education",
      label: "Education",
      icon: "gradcap",
      accent: "gold",
      items: [
        {
          id: "metu",
          title: "Middle East Technical University",
          node: "METU · CENG",
          subtitle: "B.Sc. Computer Engineering · 2021 – 2027 (expected) · Ankara",
          icon: "gradcap",
          summary: "CGPA 3.61 / 4.00",
          bullets: [
            "Focus: operating systems, computer organization, low-level programming, algorithms.",
          ],
          tags: ["Operating Systems", "Computer Organization", "Algorithms", "Embedded Systems"],
          links: [],
          media: [
            { src: "assets/img/metu-ceng.webp", alt: "The METU Department of Computer Engineering entrance", w: 1000, h: 667, wide: true },
          ],
          note: "seed of this tree: ranked 799 out of ~3,000,000 in the national university exam",
        },
        {
          id: "highschool",
          title: "Süleyman Demirel Anatolian High School",
          node: "High School",
          subtitle: "2017 – 2021",
          icon: "star",
          summary: "Graduated with 94.41 / 100.",
          bullets: [],
          tags: [],
          links: [],
        },
      ],
    },

    /* ─────────────── EXPERIENCE ─────────────── */
    {
      id: "experience",
      label: "Experience",
      icon: "briefcase",
      accent: "honey",
      items: [
        {
          id: "kuartis",
          title: "KUARTIS — Software Engineering Intern",
          node: "KUARTIS · now",
          subtitle: "2026 – present · Ankara",
          icon: "gps",
          summary: "ROS 2 GNSS signal-health monitoring on an autonomous platform.",
          bullets: [
            "C++17 lifecycle node on NVIDIA Jetson — turns a raw GPS stream into a clear \"can we trust this fix?\" verdict.",
            "Caught a case where a silent GPS looked healthy: wrote the failing test first, then the fix.",
            "Fixed a data race in the multi-threaded test harness.",
          ],
          tags: ["ROS 2", "C++17", "GNSS", "TDD", "GTest", "Jetson"],
          links: [],
          logo: "assets/img/kuartis.png",
        },
        {
          id: "aselsan-ce",
          title: "ASELSAN — Candidate Engineer",
          node: "ASELSAN",
          subtitle: "Jul 2026 – present · Ankara",
          icon: "chip",
          summary: "High-volume data pipelines for system evaluation.",
          bullets: [
            "Pipelines that process millions of data points for evaluation and offline experiments.",
            "Multithreading and synchronization to keep the streams race-free.",
          ],
          tags: ["C++", "Multithreading", "Data Pipelines"],
          links: [],
          logo: "assets/img/aselsan-logo.jpg",
        },
        {
          id: "romer",
          title: "ROMER — Undergraduate Researcher",
          node: "ROMER 🐝",
          subtitle: "Jan 2026 – present · METU Robotics & AI Center",
          icon: "bee",
          summary: "Teaching computers to tell which way a honey bee is facing.",
          bullets: [
            "CNN and ResNet models for bee orientation detection.",
            "Full model lifecycle: dataset, training, tuning.",
          ],
          tags: ["Python", "CNN", "ResNet", "Computer Vision"],
          links: [],
          media: [
            { src: "assets/img/romer-bee.webp", alt: "A honey bee from the ROMER orientation-detection dataset", w: 900, h: 506 },
          ],
          logo: "assets/img/romer-logo.jpg",
          note: "yes, the bee flying around this tree is a colleague",
        },
        {
          id: "bites",
          title: "BİTES — Software Engineering Intern",
          node: "BİTES",
          subtitle: "Aug – Sep 2025 · Ankara",
          icon: "window",
          summary: "A team & project management desktop app.",
          bullets: [
            "C# / WPF features for users, teams, projects and tasks — MVVM, data binding, validation.",
            "xUnit tests with mocks; iterated on user feedback.",
          ],
          tags: ["C#", "WPF", "MVVM", "xUnit"],
          links: [],
          logo: "assets/img/bites-logo.jpg",
        },
        {
          id: "aselsan-intern",
          title: "ASELSAN — Intern",
          node: "ASELSAN '25",
          subtitle: "Jul – Aug 2025 · Ankara",
          icon: "chip",
          summary: "Testing embedded systems, automating the boring parts.",
          bullets: [
            "C++ unit tests with Google Test for embedded systems.",
            "Automated GUI workflows with Python and Pywinauto.",
          ],
          tags: ["C++", "Google Test", "Python", "Pywinauto"],
          links: [],
          logo: "assets/img/aselsan-logo.jpg",
        },
        {
          id: "exa4mind",
          title: "EXA4MIND — Data Mining Intern",
          node: "EXA4MIND",
          subtitle: "Aug – Sep 2024 · EU Horizon research project",
          icon: "flow",
          summary: "Low-latency streaming pipelines for scientific data.",
          bullets: [
            "Streaming pipelines with Kafka, Flink and ZeroMQ.",
            "Benchmarked ZeroMQ against Kafka for speed and accuracy.",
          ],
          tags: ["Kafka", "Flink", "ZeroMQ"],
          links: [],
          logo: "assets/img/exa4mind-logo.jpg",
        },
      ],
    },

    /* ─────────────── PRODUCTS (shipped, in the wild) ─────────────── */
    {
      id: "products",
      label: "Products",
      icon: "star",
      accent: "maroon",
      items: [
        {
          id: "guild",
          title: "Guild",
          node: "Guild ★",
          subtitle: "Co-founder & developer · live on the App Store and Google Play",
          icon: "star",
          summary: "A student community app for Turkey — verify with your university email, get your whole campus in one feed.",
          bullets: [
            "Co-founded with my close friend Emirhan Güler at METU; I built and shipped the code — iOS, Android, web, backend, admin.",
            "Forum with anonymous posts and polls, events with seat reservations and door check-in, student societies, and a nationwide opportunities board.",
            "Live at METU, Hacettepe and Ankara University.",
          ],
          tags: [],
          links: [
            { label: "getguild.app", href: "https://getguild.app", kind: "web" },
            { label: "App Store", href: "https://apps.apple.com/app/id6761904539", kind: "appstore" },
            { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.metustars.guild", kind: "playstore" },
          ],
          media: [
            { src: "assets/img/guild-shot-feed.webp", alt: "Guild home feed screen with ranked posts", w: 640, h: 1384 },
            { src: "assets/img/guild-shot-events.webp", alt: "Guild discover screen listing campus events", w: 640, h: 1384 },
            { src: "assets/img/guild-shot-forum.webp", alt: "Guild forum thread with anonymous posts and a poll", w: 640, h: 1384 },
            { src: "assets/img/guild-shot-unimnet.webp", alt: "Guild Ünimnet screen with featured nationwide opportunities", w: 640, h: 1384 },
          ],
          logo: "assets/img/guild-icon.png",
          flagship: true,
          live: true,
        },
        {
          id: "phera",
          title: "Phera Labs",
          node: "Phera Labs ★",
          subtitle: "Co-founder & developer · pheralabs.com",
          icon: "star",
          summary: "An art-tech startup's platform — students exhibit digital art, and the best of it joins an international NFT collection.",
          bullets: [
            "Co-founded and grew it with my high school friend Sabri Ilgaz; I built the platform — design, frontend, backend, database, admin.",
            "\"Phera-Land\": a 360° drag-to-spin gallery you can wander through.",
            "The whole commerce side too: limited prints, QR-ticketed events, referral rewards.",
          ],
          tags: [],
          links: [
            { label: "pheralabs.com", href: "https://pheralabs.com", kind: "web" },
          ],
          logo: "assets/img/phera-mark.jpg",
          flagship: true,
          live: true,
          theme: "dark",
        },
      ],
    },

    /* ─────────────── PROJECTS (systems & coursework) ─────────────── */
    {
      id: "projects",
      label: "Projects",
      icon: "rocket",
      accent: "plum",
      items: [
        {
          id: "orchestrator",
          title: "Concurrent Data Pipeline Orchestrator",
          node: "Orchestrator",
          subtitle: "C · Unix system programming",
          icon: "tree",
          summary: "A process controller running multi-stage CSV pipelines with fork, exec and pipes.",
          bullets: [
            "Like a shell pipeline, but shaped like a tree: every stage runs as its own process, and streams merge upward through sub-merger nodes.",
            "The tricky part was the plumbing — deadlock-free IPC over Unix domain sockets, so no stage ever blocks another.",
          ],
          tags: ["C", "fork/exec", "IPC", "Unix sockets"],
          links: [],
          media: [
            { src: "assets/img/orchestrator-figs.png", alt: "The assignment's structure figures: an operator chain pipeline (sort, filter, unique) and the N-ary merger tree", w: 830, h: 600, wide: true },
          ],
          note: "this project is also a tree — of processes. trees all the way down.",
        },
        {
          id: "y86",
          title: "Pipelined Processor Optimization",
          node: "Y86-64",
          subtitle: "Assembly · HCL · Y86-64",
          icon: "chip",
          summary: "Extended a pipelined processor simulator, then made programs measurably faster on it.",
          bullets: [
            "Y86-64 is a teaching version of x86-64 — I worked on the processor itself, adding instructions and resolving data and control hazards in its control logic.",
            "Then tuned programs to run fast on it: loop unrolling, instruction reordering, custom functions — every saved cycle counts.",
          ],
          tags: ["Y86-64", "HCL", "Assembly", "CPE"],
          links: [],
          media: [
            { src: "assets/img/perf-results.webp", alt: "My actual benchmark run on the course server: bilateral filter down from 1442 to 688 CPE — a 2.1x speedup", w: 1100, h: 612, wide: true },
          ],
          note: "real output from my run: 1442 → 688 cycles per element",
        },
        {
          id: "bomblab",
          title: "Bomb & Attack Labs",
          node: "Bomb Lab",
          subtitle: "x86-64 · GDB · reverse engineering",
          icon: "terminal",
          summary: "Defused a multi-stage binary bomb with GDB and a disassembler.",
          bullets: [
            "Each phase hides a password inside a binary — you disassemble it, watch the registers, and read the logic backwards. Every phase ends in a call to explode_bomb; guess wrong and it goes off.",
            "Then switched sides: crafted code-injection and return-oriented-programming exploits against vulnerable binaries, in a sandboxed course lab.",
          ],
          tags: ["x86-64", "GDB", "Reverse Engineering", "ROP"],
          links: [],
          media: [
            { src: "assets/img/bomb-asm.webp", alt: "GDB disassembly of phase_2 from my bomb, with the explode_bomb branch at the bottom", w: 1000, h: 717, wide: true },
            { src: "assets/img/bomb-defused.webp", alt: "Terminal output: all six phases defused — Congratulations! You've defused the bomb!", w: 1000, h: 551, wide: true },
          ],
          note: "all six phases defused. my favourite kind of puzzle.",
        },
        {
          id: "pic18",
          title: "PIC18 Embedded Systems",
          node: "PIC18",
          subtitle: "Assembly / C (PIC18F8722) · MPLAB X",
          icon: "chip",
          summary: "Bare-metal microcontroller work: a Flappy Bird game on an LED matrix, and a timer-free round-robin scheduler.",
          bullets: [
            "Flappy Bird on the board's LED grid: the bird flaps on a button interrupt, gravity pulls it down, pipes scroll in from the right, collisions end the game — and a 7-segment display keeps score.",
            "A separate control task: round-robin scheduling of three state machines with no hardware timers or interrupts at all — every deadline met by counting instructions.",
            "Direct LED control across PORTB, PORTC and PORTD, every output pin in a known state.",
          ],
          tags: ["PIC18", "Assembly", "C", "Interrupts", "Embedded"],
          links: [],
          media: [
            { src: "assets/img/pic18-board.webp", alt: "The actual PIC18 development board with the Flappy Bird LED game area marked, next to its LED grid layout", w: 950, h: 320, wide: true },
          ],
          note: "the board photo is my Flappy Bird — bird on the left, pipes scrolling in",
          dx: 14, dy: -10,
        },
        {
          id: "flightfinder",
          title: "Flight Finder",
          node: "Flight Finder",
          subtitle: "C++ · graph theory",
          icon: "plane",
          summary: "A flight search engine on a directional multigraph.",
          bullets: [
            "Airports are nodes, flights are edges — and since two cities can be connected by many flights, it's a multigraph, backed by a hash table for fast lookups.",
            "Dijkstra with heuristics that blend ticket cost and travel time, plus airline filtering.",
          ],
          tags: ["C++", "Dijkstra", "Hash Table"],
          links: [],
          media: [
            { src: "assets/img/flight-listing.png", alt: "The MultiGraph data layout: GraphEdge and GraphVertex structs with adjacency lists in C++", w: 1000, h: 640, wide: true },
          ],
        },
        {
          id: "modelhub",
          title: "AI Model Hub Database",
          node: "Model Hub DB",
          subtitle: "Java · SQL · H2",
          icon: "db",
          summary: "A normalized database for models, datasets and training runs.",
          bullets: [
            "Schema design first: normalized tables that track which model trained on which dataset, and how each run went.",
            "SQL analytics on top — user reputation scores and model performance metrics.",
          ],
          tags: ["Java", "SQL", "Database Design"],
          links: [],
          media: [
            { src: "assets/img/modelhub-schema.webp", alt: "The platform's relational schema: Users, Organizations, Models, ModelVersions, Datasets, Runs, Results and their references", w: 1000, h: 1160 },
          ],
        },
        {
          id: "kso",
          title: "KSO — Marine Biodiversity Platform",
          node: "KSO",
          subtitle: "Team of two · Software Engineering (CENG350)",
          icon: "flow",
          summary: "Architecture design for the Koster Seafloor Observatory — spotting marine species in seafloor video with ML and citizen science.",
          bullets: [
            "Co-authored a 74-page Software Architecture Description: six subsystems, from a researcher web UI to a YOLO-based detection pipeline trained on HPC.",
            "The loop that makes it work: volunteers annotate footage on Zooniverse, annotations retrain the models, results flow to global biodiversity databases (GBIF, OBIS) in Darwin Core format.",
            "Full UML set — component, class, sequence, state and activity diagrams — plus the SRS.",
          ],
          tags: ["Software Architecture", "UML", "SRS / SAD", "ML System Design"],
          links: [],
          media: [
            { src: "assets/img/kso-components.png", alt: "KSO component diagram: researcher, data management, citizen science, model API and ML/HPC subsystems", w: 1120, h: 560, wide: true },
            { src: "assets/img/kso-classes.webp", alt: "KSO internal interfaces class diagram", w: 1000, h: 1230 },
          ],
          note: "diagrams straight from our SAD — drawn box by box in StarUML",
        },
      ],
    },

    /* ─────────────── SKILLS ─────────────── */
    {
      id: "skills",
      label: "Skills",
      icon: "wrench",
      accent: "teal",
      items: [
        {
          id: "sk-languages",
          title: "Languages",
          node: "Languages",
          icon: "chip",
          summary: "The ones I think in.",
          bullets: [],
          tags: ["C", "C++", "C#", "x86-64 Assembly", "Java", "Python", "SQL", "Haskell", "TypeScript", "JavaScript", "Verilog"],
          links: [],
        },
        {
          id: "sk-systems",
          title: "Systems & Low-level",
          node: "Systems ♥",
          icon: "chip",
          summary: "Home turf.",
          bullets: [],
          tags: ["OS internals", "Memory management", "Multithreading & sync", "Unix system programming", "Computer organization", "Performance tuning", "ROS 2", "Embedded (PIC18, Jetson)"],
          links: [],
          note: "this is the branch I want to grow the most",
        },
        {
          id: "sk-people",
          title: "People & Process",
          node: "Teamwork",
          icon: "heart",
          summary: "The parts that aren't code.",
          bullets: [],
          tags: ["Teamwork", "Clear communication", "Ownership", "Planning & prioritizing", "Working with feedback", "Teaching & mentoring"],
          links: [],
        },
        {
          id: "sk-data",
          title: "Data & ML",
          node: "Data & ML",
          icon: "flow",
          summary: "Streams and neural nets.",
          bullets: [],
          tags: ["CNN / ResNet", "Kafka", "Flink", "ZeroMQ", "MySQL / PostgreSQL"],
          links: [],
        },
        {
          id: "sk-tools",
          title: "Tools & Practice",
          node: "Tools",
          icon: "wrench",
          summary: "Sharp tools, tested code.",
          bullets: [],
          tags: ["Git", "GDB", "GoogleTest / GMock", "xUnit", "Jest / Maestro", "Valgrind", "clang-tidy", "Docker", "CI (GitHub Actions / GitLab)", "MATLAB"],
          links: [],
        },
      ],
    },

    /* ─────────────── BEYOND CODE ─────────────── */
    {
      id: "beyond",
      label: "Beyond Code",
      icon: "sprout",
      accent: "sky",
      items: [
        {
          id: "karate",
          title: "Karate",
          node: "Karate",
          icon: "karate",
          summary: "Competed through middle and high school.",
          bullets: [
            "First place in inter-school and inter-regional competitions.",
          ],
          tags: [],
          links: [],
          media: [
            { src: "assets/img/karate.webp", alt: "Deniz at a karate competition", w: 900, h: 520 },
          ],
          hidden: false,
        },
        {
          id: "volunteering",
          title: "Volunteering",
          node: "Volunteering",
          icon: "heart",
          summary: "Showing up when it matters.",
          bullets: [
            "Earthquake relief in Hatay (certified).",
            "Educational volunteering with primary-school kids.",
          ],
          tags: [],
          links: [],
          hidden: false,
        },
        {
          id: "sports",
          title: "Sports & Outdoors",
          node: "Sports",
          icon: "bike",
          summary: "If it's physical, I'm in.",
          bullets: [
            "Tennis, volleyball, basketball, camping, cycling, fitness — usually with friends.",
          ],
          tags: [],
          links: [],
          hidden: false,
        },
        {
          id: "ates",
          title: "Ateş",
          node: "Ateş 🐕",
          icon: "paw",
          summary: "My dog of 7+ years — walked twice a day, every day.",
          bullets: [
            "Chief Morale Officer. Sits at the base of this tree.",
          ],
          tags: [],
          links: [],
          media: [
            { src: "assets/img/ates.webp", alt: "Ateş the dog", w: 900, h: 675 },
          ],
          hidden: false,
        },
      ],
    },
  ],
};
