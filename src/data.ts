import { Project, WorkExperience, Education, LeadershipExperience } from './types';

export const ABOUT_ME_BIO = `hi, i'm reb. i'm a software engineering student at concordia university, currently building experience across web development, e-commerce operations, and industrial automation.

i like making technical things feel clear, useful, and a little more fun to interact with. this portfolio is built like a tiny desktop because i wanted it to feel personal instead of like a generic resume page.

i'm interested in software, controls, creative tools, and projects that mix engineering with good design.`;

export const RPG_STATS = [
  { name: 'Java', level: 92, color: '#f97316' },
  { name: 'Python', level: 84, color: '#22c55e' },
  { name: 'JavaScript', level: 82, color: '#eab308' },
  { name: 'React', level: 78, color: '#06b6d4' },
  { name: 'HTML / CSS', level: 88, color: '#3b82f6' },
  { name: 'UI / UX', level: 76, color: '#ec4899' },
  { name: 'Problem Solving', level: 90, color: '#f97316' }
];

export const PROJECTS: Project[] = [
  {
    id: 'b1',
    name: 'Retro Desktop Portfolio',
    difficulty: 'beginner',
    description: 'An interactive portfolio built as a small retro desktop instead of a standard scrolling resume page.',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    details: 'Includes draggable windows, desktop shortcuts, a taskbar, a start menu, nested folder navigation, responsive window behavior, and custom retro styling. This is the main project I am actively building and refining.'
  },
  {
    id: 'i1',
    name: 'Paint 95 Tool',
    difficulty: 'intermediate',
    description: 'A small browser drawing tool built into the portfolio.',
    stack: ['React', 'TypeScript', 'HTML Canvas'],
    details: 'Lets visitors draw directly in the portfolio using brush controls, a color palette, clear controls, and canvas export. It is a playful feature, but also a real part of the site.'
  },
  {
    id: 'i2',
    name: '8-Bit Synth',
    difficulty: 'intermediate',
    description: 'A tiny chiptune-style synthesizer and sound board inside the desktop.',
    stack: ['React', 'TypeScript', 'Web Audio API'],
    details: 'Includes a tempo-controlled step sequencer, sound-effect buttons, clickable piano keys, and keyboard input for playing notes. It is another interactive feature of this portfolio.'
  },
  {
    id: 'i3',
    name: 'Cat Flap',
    difficulty: 'intermediate',
    description: 'A small Flappy Bird-inspired canvas game where visitors help a pixel cat dodge pipes.',
    stack: ['React', 'TypeScript', 'HTML Canvas'],
    details: 'Built as a playable mini game inside the desktop. It uses a canvas animation loop, simple gravity and flap physics, collision detection, scoring, best-score storage, and keyboard/click controls.'
  },
  {
    id: 'a1',
    name: 'Java Project',
    difficulty: 'advanced',
    description: 'Placeholder for a future Java project.',
    stack: ['Java'],
    details: 'Coming soon. I plan to add a stronger Java project here once I have something polished enough to show publicly.'
  },
  {
    id: 'a2',
    name: 'Python Project',
    difficulty: 'advanced',
    description: 'Placeholder for a future Python project.',
    stack: ['Python'],
    details: 'Coming soon. This could become an automation script, data project, AI experiment, or something related to cybersecurity or healthtech.'
  },
  {
    id: 'a3',
    name: 'Hackathon Project',
    difficulty: 'advanced',
    description: 'Placeholder for a future hackathon or team project.',
    stack: ['TBD'],
    details: 'Coming soon. I will replace this once I have a project from Hack Concordia or another event that I can describe clearly.'
  }
];

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    id: 'w1',
    role: 'Automation & Controls Intern',
    company: 'Agri-Neo',
    period: 'Sept. 2026 - Dec. 2026',
    location: 'Toronto, ON',
    achievements: [
      'Supported the development, configuration, testing, and troubleshooting of PLC-based industrial automation systems for food processing and screening applications.',
      'Worked with Allen-Bradley PLCs and Rockwell Automation software while gaining hands-on experience with industrial control system programming and operation.',
      'Helped configure HMI applications on industrial tablets, including operator interfaces and streamlined one-touch control features.',
      'Assisted with industrial drive configuration, commissioning activities, system integration, and cybersecurity risk assessment for control systems.'
    ]
  },
  {
    id: 'w2',
    role: 'Web Development & E-Commerce Operations Intern',
    company: 'ATOMS',
    period: 'June 2026 - Aug. 2026',
    location: 'Montreal, QC',
    achievements: [
      'Developed and maintained the company e-commerce website to support online sales and customer-facing product information.',
      'Built and updated front-end components using HTML, CSS, and JavaScript to improve usability, layout, and site performance.',
      'Supported product and inventory workflows across the website and Amazon storefront.',
      'Integrated and maintained third-party tools related to payments, shipping, product management, and website operations.'
    ]
  },
  {
    id: 'w3',
    role: 'Laboratory Assistant',
    company: 'Concordia University',
    period: 'Oct. 2023 - Feb. 2024',
    location: 'Montreal, QC',
    achievements: [
      'Supported laboratory operations by assisting with equipment maintenance, organization, and data collection tasks.',
      'Helped maintain a clean and reliable lab environment for students, faculty, and technical staff.'
    ]
  },
  {
    id: 'w4',
    role: 'Dental Office Assistant',
    company: 'Cite Dentaire St-Augustin',
    period: 'Feb. 2020 - Aug. 2023',
    location: 'Montreal, QC',
    achievements: [
      'Managed patient scheduling, administrative records, and front-desk operations in a fast-paced clinical environment.',
      'Communicated with patients and staff to support smooth daily operations and appointment coordination.'
    ]
  }
];

export const EDUCATION: Education[] = [
  {
    id: 'e1',
    degree: 'Bachelor of Software Engineering (BEng) - Co-operative Education',
    school: 'Concordia University',
    period: '2024 - Expected 2029',
    achievements: [
      'Pursuing a software engineering degree with a focus on programming, systems design, and engineering fundamentals.',
      'Completing the co-op program through technical internships in web development, e-commerce operations, and industrial automation.',
      'Building experience across software development, control systems, and practical engineering workflows.'
    ]
  },
  {
    id: 'e2',
    degree: 'High School Diploma',
    school: 'LCA High School',
    period: '2017 - 2023',
    achievements: [
      'Graduated as valedictorian of the class of 2023.'
    ]
  }
];

export const LEADERSHIP_EXPERIENCE: LeadershipExperience[] = [
  {
    id: 'l1',
    role: 'Director of Competitions',
    organization: 'Women in Engineering, Concordia University',
    period: 'Sept. 2025 - Present',
    location: 'Montreal, QC',
    achievements: [
      'Spearheaded EcoInnovate, a large-scale inter-university case competition between Concordia and McGill.',
      'Managed end-to-end competition logistics, sponsorship acquisition, and participant outreach across both institutions.',
      'Spearheaded FormulaWIEEE, a multidisciplinary engineering event in collaboration with IEEE.',
      'Oversaw sponsorship, promotion, and coordination for a hands-on Formula 1-style car design challenge open to students across engineering disciplines.'
    ]
  },
  {
    id: 'l2',
    role: 'Participant',
    organization: 'Hack Concordia',
    period: '2026',
    location: 'Montreal, QC',
    achievements: [
      'Participated in Hack Concordia at Concordia University.'
    ]
  }
];
