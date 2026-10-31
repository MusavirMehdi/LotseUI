Lotse was an Agentic AI app for helping those Students moving from India to Germany.
It has diffn pathways like study, work,vocational training.
It asks the user about their qualifications, work experience,language certifications.
It then has a rules engine that checks against the eligibility of each path and return criteria labels like MET, UNMET etc
The gemini free LLM api key being used here is for Deciding what tool to call next or which step to ask next.
We use neondb postgress for backend with prisma and zod.
we use typescript, vite, next and next js, jwt.



> **"AI reads and words things. CODE decides."**

### Key Implications in LOTSE:
* **AI's Role**: Parses unstructured input (documents, applicant messages), suggests next steps / tools (`pickTool`), and phrases conversational responses (`polish`, `ask_applicant`).
* **Code's Role**: Evaluates eligibility rules, validates schemas (Zod), enforces tool guards, manages state transitions, and commits authoritative data to PostgreSQL.
* **The Rule**: The AI never determines eligibility, invents applicant facts, overwrites verified information, or bypasses deterministic guards.
