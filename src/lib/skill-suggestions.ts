// Broad skill suggestions (tech + tools + interpersonal). De-duped into ~300 entries.

const languages = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C#",
  "C++",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "Kotlin",
  "Swift",
  "Scala",
  "Dart",
  "R",
  "SQL",
  "NoSQL",
  "Shell Scripting",
  "Bash",
  "Powershell",
  "GraphQL",
];

const frontend = [
  "React",
  "Next.js",
  "Vue.js",
  "Nuxt",
  "Angular",
  "Svelte",
  "Tailwind CSS",
  "CSS Modules",
  "Styled Components",
  "Design Systems",
  "Accessibility (A11y)",
  "Storybook",
  "Webpack",
  "Vite",
];

const backend = [
  "Node.js",
  "Express",
  "FastAPI",
  "Django",
  "Flask",
  "Spring Boot",
  ".NET Core",
  "NestJS",
  "Ktor",
  "gRPC",
  "REST API Design",
  "Microservices",
  "Message Queues (Kafka/RabbitMQ)",
  "Event-Driven Architecture",
  "API Gateway",
];

const databases = [
  "PostgreSQL",
  "MySQL",
  "SQLite",
  "MongoDB",
  "Redis",
  "Elasticsearch",
  "Cassandra",
  "DynamoDB",
  "BigQuery",
  "Snowflake",
  "Data Modeling",
  "Query Optimization",
];

const devops = [
  "CI/CD",
  "GitHub Actions",
  "GitLab CI",
  "Jenkins",
  "CircleCI",
  "Terraform",
  "Pulumi",
  "Ansible",
  "Docker",
  "Kubernetes",
  "Helm",
  "Istio",
  "Linkerd",
  "ArgoCD",
  "FluxCD",
  "SRE",
  "Observability",
  "Prometheus",
  "Grafana",
  "OpenTelemetry",
  "Logging (ELK/EFK)",
  "On-call/Incident Response",
];

const cloud = [
  "AWS",
  "AWS Architecture",
  "Azure",
  "GCP",
  "Cloud Networking",
  "CDN (CloudFront/Fastly)",
  "Serverless (Lambda/Cloud Functions)",
  "Cloud Security",
  "Cost Optimization",
];

const security = [
  "AppSec",
  "Threat Modeling",
  "Penetration Testing",
  "Secure Coding",
  "OWASP",
  "Identity & Access Management",
  "OAuth/OpenID Connect",
  "Zero Trust",
  "SIEM",
  "SOC2/ISO27001",
];

const data = [
  "Data Engineering",
  "Data Warehousing",
  "ETL/ELT",
  "dbt",
  "Airflow",
  "Kafka Streams",
  "Spark",
  "Pandas",
  "Numpy",
  "Data Visualization",
  "BI Dashboards",
  "Power BI",
  "Tableau",
  "Looker",
];

const ml_ai = [
  "Machine Learning",
  "Deep Learning",
  "LLMs",
  "Prompt Engineering",
  "Retrieval-Augmented Generation",
  "Vector Databases",
  "Pinecone",
  "Weaviate",
  "Chroma",
  "LangChain",
  "PyTorch",
  "TensorFlow",
  "Keras",
  "scikit-learn",
  "Hugging Face",
  "MLOps",
  "Model Serving",
  "Feature Stores",
  "A/B Testing",
  "Experimentation",
];

const mobile = [
  "React Native",
  "Flutter",
  "SwiftUI",
  "Android (Kotlin)",
  "iOS (Swift)",
  "Mobile CI/CD",
];

const blockchain = [
  "Solidity",
  "Smart Contracts",
  "Hardhat",
  "Foundry",
  "Ethers.js",
  "web3.js",
  "WalletConnect",
  "DeFi Protocols",
  "Tokenomics",
  "NFT Standards (ERC721/1155)",
  "Chainlink",
  "Subgraphs (The Graph)",
];

const testing = [
  "Unit Testing",
  "Integration Testing",
  "E2E Testing",
  "Playwright",
  "Cypress",
  "Jest",
  "Mocha/Chai",
  "Testing Library",
  "Contract Testing",
];

const design_product = [
  "UX Research",
  "UI Design",
  "Interaction Design",
  "Design Systems",
  "Figma",
  "Prototyping",
  "Product Strategy",
  "Roadmapping",
  "A/B Testing (Product)",
  "Analytics for Product",
];

const analytics_bi = [
  "SQL Analytics",
  "Product Analytics",
  "Amplitude",
  "Mixpanel",
  "GA4",
  "Event Instrumentation",
];

const infra_network = [
  "Linux Administration",
  "Networking",
  "Load Balancing",
  "Reverse Proxies (Nginx/Envoy)",
  "Caching (Redis/Memcached)",
  "Storage (S3/EBS)",
];

const tools = [
  "Git",
  "GitHub",
  "GitLab",
  "Bitbucket",
  "Jira",
  "Linear",
  "Confluence",
  "Notion",
  "Slack",
  "Zoom",
  "Miro",
];

const interpersonal = [
  "Communication",
  "Stakeholder Management",
  "Technical Writing",
  "Collaboration",
  "Mentoring",
  "Leadership",
  "Conflict Resolution",
  "Negotiation",
  "Presentation Skills",
  "Product Sense",
  "Analytical Thinking",
  "Problem Solving",
  "Time Management",
  "Prioritization",
  "Remote Collaboration",
  "Cross-functional Alignment",
];

const project_process = [
  "Agile",
  "Scrum",
  "Kanban",
  "OKRs",
  "Roadmapping",
  "Sprint Planning",
  "Retrospectives",
  "Estimation",
  "Risk Management",
];

const qa_security = [
  "QA Strategy",
  "Test Automation",
  "Performance Testing",
  "Load Testing",
  "Vulnerability Management",
  "Secure SDLC",
];

const ai_tools = [
  "OpenAI API",
  "Anthropic API",
  "Vertex AI",
  "AWS Bedrock",
  "Azure OpenAI",
  "Claude Prompting",
  "Prompt Chaining",
  "Guardrails (AI)",
  "Safety Evaluations",
];

const support_ops = [
  "Customer Support",
  "CX Tooling",
  "CRM (Salesforce/HubSpot)",
  "Zendesk",
  "Intercom",
];

const supply_chain = [
  "Supply Chain Systems",
  "Logistics Platforms",
  "ERP Integration",
];

const biotech_health = [
  "HIPAA Compliance",
  "HL7/FHIR",
  "Clinical Data Pipelines",
];

const fintech = [
  "PCI Compliance",
  "Payments Integration",
  "Ledger Systems",
  "KYC/AML",
];

const ar_vr = [
  "Unity",
  "Unreal Engine",
  "3D Pipelines",
  "WebXR",
];

const gaming = [
  "Game Design",
  "Gameplay Engineering",
  "Economy Design",
];

const list = [
  ...languages,
  ...frontend,
  ...backend,
  ...databases,
  ...devops,
  ...cloud,
  ...security,
  ...data,
  ...ml_ai,
  ...mobile,
  ...blockchain,
  ...testing,
  ...design_product,
  ...analytics_bi,
  ...infra_network,
  ...tools,
  ...interpersonal,
  ...project_process,
  ...qa_security,
  ...ai_tools,
  ...support_ops,
  ...supply_chain,
  ...biotech_health,
  ...fintech,
  ...ar_vr,
  ...gaming,
];

export const SKILL_SUGGESTIONS: string[] = Array.from(new Set(list)).sort();
