import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ShieldCheck, ArrowRight, ArrowDown } from 'lucide-react';

interface NodeData {
  id: string;
  name: string;
  tech: string;
  plainLabel: string;
  badge: string;
  responsibilities: string[];
  connectedTo: string[];
}

const NODES: NodeData[] = [
  {
    id: 'frontend',
    name: 'Frontend',
    tech: 'React + TypeScript',
    plainLabel: 'What you see and use',
    badge: 'Client Layer',
    responsibilities: [
      'UI & design system',
      'Authentication',
      'Chat interface',
      'Applicant dashboard',
      'Document submission',
    ],
    connectedTo: ['backend'],
  },
  {
    id: 'backend',
    name: 'Backend',
    tech: 'NestJS',
    plainLabel: 'Central conductor & coordinator',
    badge: 'API & Orchestration',
    responsibilities: [
      'API management',
      'Authentication and authorisation',
      'Profile management',
      'Workflow orchestration',
      'Eligibility assessment',
    ],
    connectedTo: ['frontend', 'ai', 'rules', 'database'],
  },
  {
    id: 'ai',
    name: 'AI Processing Layer',
    tech: 'LLMs & Vision Extraction',
    plainLabel: 'Extraction & language understanding',
    badge: 'Parsing & Extraction',
    responsibilities: [
      'Conversational intelligence',
      'Document extraction',
      'Intro video analysis',
      'Structured data generation',
      'CV generation',
      'Missing-information detection',
    ],
    connectedTo: ['backend'],
  },
  {
    id: 'rules',
    name: 'Rules Engine',
    tech: 'Deterministic Logic',
    plainLabel: 'Deterministic qualification checker',
    badge: 'Zero Hallucinations',
    responsibilities: [
      'Predefined qualification criteria',
      'Eligibility checks',
      'Validation',
      'Inconsistency detection',
      'Next-step determination',
    ],
    connectedTo: ['backend'],
  },
  {
    id: 'database',
    name: 'Database',
    tech: 'PostgreSQL',
    plainLabel: 'Secure verified data store',
    badge: 'Persistence Layer',
    responsibilities: [
      'Applicant profiles',
      'Extracted information',
      'Document metadata',
      'Eligibility results',
      'Conversation history',
    ],
    connectedTo: ['backend'],
  },
];

export const Architecture: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string>('backend');
  const shouldReduceMotion = useReducedMotion();

  const activeNodeData = NODES.find((n) => n.id === activeNode) || NODES[1];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };



  return (
    <section
      id="architecture"
      aria-label="System Architecture"
      className="max-w-6xl xl:max-w-7xl mx-auto my-24 sm:my-32 px-4 sm:px-6 lg:px-8 scroll-mt-24"
    >
      {/* Section Header */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={containerVariants}
        className="max-w-3xl mx-auto text-center mb-12 sm:mb-16"
      >
        {/* Eyebrow badge */}
        <motion.div variants={itemVariants} className="mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            <span className="font-mono text-[11px] font-semibold tracking-widest uppercase text-zinc-700 dark:text-zinc-300">
              SYSTEM ARCHITECTURE
            </span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h2
          variants={itemVariants}
          className="font-sans text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-zinc-950 dark:text-white leading-[1.12]"
        >
          Intelligent by design.{' '}
          <span className="font-serif italic font-normal text-blue-600 dark:text-blue-400 block sm:inline">
            Structured by architecture.
          </span>
        </motion.h2>

        {/* Supporting text */}
        <motion.p
          variants={itemVariants}
          className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto"
        >
          Behind every guided recommendation is a structured system connecting applicant data, document intelligence, eligibility rules and personalised guidance.
        </motion.p>
      </motion.div>

      {/* Main Architecture Diagram Container */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={itemVariants}
        className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)]/70 dark:bg-zinc-900/50 backdrop-blur-xl p-5 sm:p-8 lg:p-10 shadow-lg shadow-black/5 dark:shadow-black/20"
      >
        {/* Desktop View: Multi-column Interactive Topology */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Frontend (Col 1-3) */}
          <div className="lg:col-span-3 flex flex-col justify-center">
            <div
              tabIndex={0}
              data-cursor="hover"
              onClick={() => setActiveNode('frontend')}
              onMouseEnter={() => setActiveNode('frontend')}
              onFocus={() => setActiveNode('frontend')}
              className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer outline-none ${
                activeNode === 'frontend'
                  ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20'
                  : 'border-[var(--border-subtle)] bg-[var(--surface-card)] hover:border-blue-500/30'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-[10px] font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400">
                  What you see and use
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-zinc-500">
                  Client
                </span>
              </div>
              <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                Frontend
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                React + TypeScript
              </p>
            </div>
          </div>

          {/* Flow 1: Frontend <-> Backend Bridge (Col 4) */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-mono text-zinc-400 mb-1">User input</span>
            <svg width="48" height="20" className="overflow-visible text-blue-500">
              <line
                x1="0"
                y1="10"
                x2="38"
                y2="10"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="4 4"
                className={shouldReduceMotion ? '' : 'animate-flow-dash'}
              />
              <polygon points="38,6 48,10 38,14" fill="currentColor" />
            </svg>
          </div>

          {/* Center Column: Backend & Database (Col 5-8) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Center Node: Backend */}
            <div
              tabIndex={0}
              data-cursor="hover"
              onClick={() => setActiveNode('backend')}
              onMouseEnter={() => setActiveNode('backend')}
              onFocus={() => setActiveNode('backend')}
              className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer outline-none ${
                activeNode === 'backend'
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/25'
                  : 'border-[var(--border-subtle)] bg-[var(--surface-card)] hover:border-indigo-500/30'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-[10px] font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
                  Central Conductor &amp; Coordinator
                </span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
                  Core Hub
                </span>
              </div>
              <h3 className="text-lg font-bold text-zinc-950 dark:text-white">
                Backend
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                NestJS Orchestration
              </p>
            </div>

            {/* Downward Flow to Database */}
            <div className="flex flex-col items-center justify-center -my-2 text-zinc-400">
              <svg width="20" height="32" className="overflow-visible text-violet-500">
                <line
                  x1="10"
                  y1="0"
                  x2="10"
                  y2="22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className={shouldReduceMotion ? '' : 'animate-flow-dash'}
                />
                <polygon points="6,22 10,32 14,22" fill="currentColor" />
              </svg>
              <span className="text-[10px] font-mono text-zinc-500 mt-0.5">Verified profile persistence</span>
            </div>

            {/* Bottom Node: Database */}
            <div
              tabIndex={0}
              data-cursor="hover"
              onClick={() => setActiveNode('database')}
              onMouseEnter={() => setActiveNode('database')}
              onFocus={() => setActiveNode('database')}
              className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer outline-none ${
                activeNode === 'database'
                  ? 'border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/10 ring-2 ring-violet-500/20'
                  : 'border-[var(--border-subtle)] bg-[var(--surface-card)] hover:border-violet-500/30'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-[10px] font-semibold tracking-wider uppercase text-violet-600 dark:text-violet-400">
                  Secure verified data store
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-zinc-500">
                  Storage
                </span>
              </div>
              <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                Database
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                PostgreSQL
              </p>
            </div>
          </div>

          {/* Right Column: AI Processing Layer & Rules Engine (Col 9-12) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Top Right: AI Processing Layer */}
            <div
              tabIndex={0}
              data-cursor="hover"
              onClick={() => setActiveNode('ai')}
              onMouseEnter={() => setActiveNode('ai')}
              onFocus={() => setActiveNode('ai')}
              className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer outline-none ${
                activeNode === 'ai'
                  ? 'border-sky-500 bg-sky-500/10 shadow-lg shadow-sky-500/10 ring-2 ring-sky-500/20'
                  : 'border-[var(--border-subtle)] bg-[var(--surface-card)] hover:border-sky-500/30'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-[10px] font-semibold tracking-wider uppercase text-sky-600 dark:text-sky-400">
                  Extraction &amp; language understanding
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-zinc-500">
                  AI Layer
                </span>
              </div>
              <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                AI Processing Layer
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Document OCR &amp; Structured Data
              </p>

              {/* Two-way indicator labels */}
              <div className="mt-3 pt-2.5 border-t border-black/5 dark:border-white/5 flex justify-between text-[10px] font-mono text-zinc-400">
                <span>← Dispatch docs</span>
                <span className="text-sky-600 dark:text-sky-400">Structured data →</span>
              </div>
            </div>

            {/* Bottom Right: Rules Engine */}
            <div
              tabIndex={0}
              data-cursor="hover"
              onClick={() => setActiveNode('rules')}
              onMouseEnter={() => setActiveNode('rules')}
              onFocus={() => setActiveNode('rules')}
              className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer outline-none ${
                activeNode === 'rules'
                  ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/20'
                  : 'border-[var(--border-subtle)] bg-[var(--surface-card)] hover:border-emerald-500/30'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-[10px] font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                  Deterministic qualification checker
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                  Zero Hallucination
                </span>
              </div>
              <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                Rules Engine
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Predefined qualification criteria
              </p>

              {/* Two-way indicator labels */}
              <div className="mt-3 pt-2.5 border-t border-black/5 dark:border-white/5 flex justify-between text-[10px] font-mono text-zinc-400">
                <span>← Validation criteria</span>
                <span className="text-emerald-600 dark:text-emerald-400">Eligibility result →</span>
              </div>
            </div>
          </div>
        </div>

        {/* Medium Tablet View (md:grid, 2 columns) */}
        <div className="hidden md:grid lg:hidden md:grid-cols-2 gap-4">
          {NODES.map((node) => {
            const isSelected = activeNode === node.id;
            return (
              <div
                key={node.id}
                tabIndex={0}
                data-cursor="hover"
                onClick={() => setActiveNode(node.id)}
                onFocus={() => setActiveNode(node.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20'
                    : 'border-[var(--border-subtle)] bg-[var(--surface-card)]'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold">
                    {node.plainLabel}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-zinc-500">
                    {node.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                  {node.name}
                </h3>
                <p className="text-xs text-zinc-500">{node.tech}</p>
              </div>
            );
          })}
        </div>

        {/* Mobile View: Vertical Stack with Downward Animated Connectors */}
        <div className="md:hidden flex flex-col gap-3">
          {NODES.map((node, index) => {
            const isSelected = activeNode === node.id;
            return (
              <React.Fragment key={node.id}>
                <div
                  tabIndex={0}
                  data-cursor="hover"
                  onClick={() => setActiveNode(node.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20'
                      : 'border-[var(--border-subtle)] bg-[var(--surface-card)]'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold">
                      {node.plainLabel}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-zinc-500">
                      {node.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                    {node.name}
                  </h3>
                  <p className="text-xs text-zinc-500">{node.tech}</p>
                </div>

                {/* Downward Connector between stacked nodes */}
                {index < NODES.length - 1 && (
                  <div className="flex justify-center py-0.5 text-blue-500">
                    <ArrowDown className={`w-4 h-4 ${shouldReduceMotion ? '' : 'animate-bounce'}`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Inspector Panel: Responsibilities of currently selected node */}
        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                Active Node Responsibilities: {activeNodeData.name} ({activeNodeData.tech})
              </h4>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              {activeNodeData.plainLabel}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {activeNodeData.responsibilities.map((resp) => (
              <span
                key={resp}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-xs text-zinc-700 dark:text-zinc-300"
              >
                <ArrowRight className="w-3 h-3 text-blue-500 shrink-0" />
                <span>{resp}</span>
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Trust Callout under diagram */}
      <div className="mt-8 sm:mt-10 p-4 sm:p-5 rounded-2xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10 backdrop-blur-md flex items-start sm:items-center gap-3.5 max-w-3xl mx-auto text-left">
        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <span className="font-semibold text-zinc-900 dark:text-white">Deterministic Foundation: </span>
          AI extracts and interprets information. The rules engine determines eligibility using predefined criteria. LOTSE never fabricates missing applicant information.
        </p>
      </div>
    </section>
  );
};
