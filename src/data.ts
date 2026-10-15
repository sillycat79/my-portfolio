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
    category: 'featured',
    description: 'An interactive portfolio built as a small retro desktop instead of a standard scrolling resume page.',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    details: 'Includes draggable windows, desktop shortcuts, a taskbar, a start menu, nested folder navigation, responsive window behavior, and custom retro styling. This is the main project I am actively building and refining.'
  },
  {
    id: 'b2',
    name: 'LeetTrack',
    category: 'featured',
    description: 'My LeetCode / OA practice tracker — logs every problem I solve and tells me which topics I am weakest at.',
    stack: ['React', 'Vite', 'Node.js', 'Express', 'SQLite'],
    details: 'Tracks topic, difficulty, time, and result for every problem I log, then scores each topic 0-100 by combining fail rate and average time (adjusted for difficulty) so I know exactly where to focus next. Also tracks a daily practice streak and a 16-week activity heatmap. The weakness-score logic lives in a small Express API backed by SQLite, tested with node:test.',
    liveUrl: 'https://leettrack-k8v3.onrender.com/',
    repoUrl: 'https://github.com/sillycat79/leettrack'
  },
  {
    id: 'i1',
    name: 'Paint 95 Tool',
    category: 'portfolio',
    description: 'A small browser drawing tool built into the portfolio.',
    stack: ['React', 'TypeScript', 'HTML Canvas'],
    details: 'Lets visitors draw directly in the portfolio using brush controls, a color palette, clear controls, and canvas export. It is a playful feature, but also a real part of the site.'
  },
  {
    id: 'i2',
    name: '8-Bit Synth',
    category: 'portfolio',
    description: 'A tiny chiptune-style synthesizer and sound board inside the desktop.',
    stack: ['React', 'TypeScript', 'Web Audio API'],
    details: 'Includes a tempo-controlled step sequencer, sound-effect buttons, clickable piano keys, and keyboard input for playing notes. It is another interactive feature of this portfolio.'
  },
  {
    id: 'i3',
    name: 'Cat Flap',
    category: 'portfolio',
    description: 'A small Flappy Bird-inspired canvas game where visitors help a pixel cat dodge pipes.',
    stack: ['React', 'TypeScript', 'HTML Canvas'],
    details: 'Built as a playable mini game inside the desktop. It uses a canvas animation loop, simple gravity and flap physics, collision detection, scoring, best-score storage, and keyboard/click controls.'
  },
  {
    id: 'h1',
    name: 'One-Click HMI Login Automation',
    category: 'hmi',
    description: 'An automation tool built during my internship at Agri-Neo that cuts remote HMI access time from ~5 minutes to ~10 seconds, replacing an 8-step manual login process with a single tap.',
    stack: ['PowerShell', 'Java Access Bridge', 'Windows Credential Manager', 'TightVNC', 'Allen-Bradley PLC', 'PanelView HMI', 'Ewon / Talk2m'],
    details: 'Started with a cybersecurity risk assessment across 30+ IT/OT assets — Allen-Bradley PLCs, PanelView HMIs, Ewon gateways, engineering workstations, and remote-access systems — covering asset identification, vulnerability analysis, and remediation planning, along with assessment and authorization documentation defining testing boundaries and safety requirements. From there I built the automation: operators previously had to work through eCatcher, a VPN connection, and a VNC viewer by hand just to reach a PanelView HMI screen. eCatcher is a Java/Swing application invisible to standard Windows UI Automation, so I engineered a Java Access Bridge (JAB) layer to drive it directly and reliably trigger one-click device connections, with credentials kept out of any script via Windows Credential Manager. That feeds into a PowerShell-based launcher with connection-monitoring and recovery logic, which also resolves 32-bit/64-bit interop constraints, to automate the full eCatcher-to-TightVNC remote HMI workflow. Now rolled out to the team and used daily for remote HMI access.'
  },
  {
    id: 'a1',
    name: 'Java Project',
    category: 'coming-soon',
    description: 'Placeholder for a future Java project.',
    stack: ['Java'],
    details: 'Coming soon. I plan to add a stronger Java project here once I have something polished enough to show publicly.'
  },
  {
    id: 'a2',
    name: 'Python Project',
    category: 'coming-soon',
    description: 'Placeholder for a future Python project.',
    stack: ['Python'],
    details: 'Coming soon. This could become an automation script, data project, AI experiment, or something related to cybersecurity or healthtech.'
  },
  {
    id: 'a3',
    name: 'Hackathon Project',
    category: 'coming-soon',
    description: 'Placeholder for a future hackathon or team project.',
    stack: ['TBD'],
    details: 'Coming soon. I will replace this once I have a project from Hack Concordia or another event that I can describe clearly.'
  }
];

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    id: 'w1',
    role: 'Software Engineering Intern',
    company: 'Agri-Neo',
    period: 'Sept. 2026 - Dec. 2026',
    location: 'Toronto, ON',
    achievements: [
      'Cut remote HMI access time from ~5 minutes to ~10 seconds by automating an 8-step workflow (Ewon eCatcher + TightVNC) into a one-click launcher using Java Access Bridge and PowerShell.',
      'Rolled out the launcher to the team, where it is now used daily for remote HMI access.',
      'Drove Ewon eCatcher, a Java/Swing app invisible to standard Windows UI Automation, by writing a Java Access Bridge layer that controls it programmatically.',
      'Fixed 32-bit/64-bit interoperability failures and added connection monitoring and recovery logic so automated remote sessions stay reliable.',
      'Assessed cybersecurity risk across 30+ IT/OT assets, from Allen-Bradley PLCs and PanelView HMIs to Ewon gateways, engineering workstations, and remote-access systems.'
    ]
  },
  {
    id: 'w3',
    role: 'Laboratory Assistant',
    company: 'Concordia University',
    period: 'Oct. 2023 - Feb. 2024',
    location: 'Montreal, QC',
    achievements: [
      'Set up laboratory equipment, supported experimental data collection, and kept technical records organized.'
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
    degree: 'Bachelor of Engineering, Software Engineering (Co-op)',
    school: 'Concordia University',
    period: '2025 - Expected 2028',
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
