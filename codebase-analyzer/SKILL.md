---
name: codebase-analyzer
description: Comprehensive codebase analysis, tech debt tracking, and code quality management. Use when the user asks to analyze their codebase, find design flaws, identify redundancy, improve architecture, assess tech debt, score debt severity, plan refactoring sprints, track code health trends, or wants a systematic code review. Also use for legacy code modernization, maintenance cost estimation, debt prioritization, or cleanup sprint planning.
---

# Codebase Analyzer

Comprehensive skill for analyzing codebases and managing technical debt. Combines deep code analysis (logic flow, architecture, redundancy, security) with structured debt scoring, prioritization frameworks, and sprint planning tools.

## Core Workflow

When this skill is invoked, follow these steps systematically:

### Step 1: Confirm Understanding

Start by restating what the user has asked for. For example:

"Let me confirm what you're asking for:
- Analyze all files and functions in the codebase
- Identify logical disconnects in the code flow
- Find opportunities for better system design
- Identify areas for code improvement
- Find redundant functionality that can be streamlined
- Provide comprehensive recommendations

Is this correct? And are there any specific areas or concerns you'd like me to focus on?"

Wait for user confirmation before proceeding.

### Step 2: Ask Clarifying Questions

Before diving into analysis, gather important context:

1. **Scope**: Should I analyze the entire codebase or focus on specific modules/directories?
2. **Known issues**: Are there any specific problem areas or pain points you're already aware of?
3. **Priorities**: What matters most to you right now - performance, maintainability, scalability, or code organization?
4. **Constraints**: Are there any parts of the code that cannot be changed (legacy integrations, external dependencies)?
5. **Output preference**: Do you want a qualitative analysis, quantitative debt scoring, or both?

Adjust these questions based on what's already clear from context.

### Step 3: Systematic Codebase Exploration

Explore the codebase methodically:

1. **Start with structure**: Use Glob to understand the project structure, identify main directories, and file organization
2. **Identify entry points**: Find main files, initialization code, and primary execution flows
3. **Map components**: Identify major modules, classes, and functional areas
4. **Read systematically**: Read through files, starting with core/critical paths, then supporting modules

Use the Explore agent for broad discovery when needed, and read files directly for detailed analysis.

### Step 4: Multi-Dimensional Analysis

Analyze the codebase across these dimensions:

#### A. Logical Flow Analysis
- Trace execution paths from entry points through the system
- Identify breaks in logic flow, missing error handling, or incomplete state transitions
- Look for unreachable code or dead ends
- Find inconsistent control flow patterns
- Check if data flows match the intended business logic

#### B. System Design & Architecture
- Evaluate overall architecture (layered, microservices, monolithic, etc.)
- Identify tight coupling between components
- Look for missing abstractions or over-abstraction
- Check separation of concerns (business logic, data access, presentation)
- Identify violations of SOLID principles
- Look for missing design patterns that would help (Strategy, Factory, Observer, etc.)
- Find circular dependencies
- Evaluate module boundaries and interfaces

#### C. Redundant Functionality Detection
This is critical - look for:
- **Duplicate code**: Similar or identical functions/methods across different files or classes
- **Reimplemented functionality**: Multiple implementations of the same concept
- **Overlapping responsibilities**: Classes or modules doing similar things that could be consolidated
- **Repeated patterns**: Code patterns that appear multiple times and could be extracted into shared utilities
- **Similar data structures**: Multiple classes/types representing the same domain concepts
- **Duplicate business logic**: Same rules implemented in multiple places

For each redundancy found, identify:
- Where it occurs (file paths and line numbers)
- How many instances exist
- What can be consolidated
- How to streamline it (create shared utility, base class, helper function, etc.)

#### D. Code Quality & Improvement Areas
- Overly complex functions (high cyclomatic complexity)
- Poor naming conventions
- Missing documentation for complex logic
- Inconsistent error handling patterns
- Magic numbers or hard-coded values
- Missing input validation
- Potential memory leaks or resource management issues
- Security vulnerabilities (SQL injection, XSS, insecure data handling)
- Performance bottlenecks (N+1 queries, inefficient algorithms)

#### E. Data Flow & State Management
- How data flows through the system
- State management patterns and consistency
- Immutability vs mutability issues
- Side effects and their management
- Data validation at boundaries

### Step 5: Generate Comprehensive Report

Structure your findings into a clear, actionable report:

## Executive Summary
- Brief overview of codebase health
- Top 3-5 critical issues
- Overall recommendations

## Detailed Findings

### 1. Logical Disconnects
For each issue:
- **Location**: File path and line numbers
- **Issue**: Clear description of the disconnect
- **Impact**: Why this matters
- **Recommendation**: How to fix it

### 2. System Design Improvements
For each opportunity:
- **Current Design**: What exists now
- **Problem**: Why it's suboptimal
- **Proposed Design**: Better approach
- **Benefits**: What improves (maintainability, scalability, etc.)
- **Implementation Steps**: High-level plan

### 3. Redundant Functionality
For each redundancy:
- **Type**: Code duplication, overlapping responsibilities, etc.
- **Locations**: All places where redundancy occurs (with file:line references)
- **Consolidation Strategy**: How to merge/streamline
- **Example**: Show before/after if helpful

### 4. Code Quality Issues
Categorized by severity (Critical, High, Medium, Low):
- **Issue**: What's wrong
- **Location**: Where it occurs
- **Fix**: What to do about it

### 5. Quick Wins
List of easy, high-impact improvements that can be done quickly

### 6. Long-Term Recommendations
Strategic improvements that require more effort but provide significant value

---

## Tech Debt Scoring & Prioritization

When the user wants quantitative debt analysis, scoring, or sprint planning, use the automated tools below.

### Automated Debt Scanning

Run the debt scanner to generate a quantitative inventory with health scores:

```bash
python3 scripts/debt_scanner.py /path/to/codebase
python3 scripts/debt_scanner.py /path/to/codebase --output report.json --format both
```

The scanner detects: long functions, high complexity, duplicate code, TODO/FIXME comments, empty catch blocks, hardcoded paths, SQL injection risks, missing docstrings, and more. It produces a health score (0-100) and prioritized debt inventory.

### Debt Prioritization

Take scanner output and apply prioritization frameworks (Cost-of-Delay, WSJF, or RICE):

```bash
python3 scripts/debt_prioritizer.py debt_inventory.json --framework cost_of_delay
python3 scripts/debt_prioritizer.py debt_inventory.json --framework wsjf --team-size 6 --sprint-capacity 80
python3 scripts/debt_prioritizer.py debt_inventory.json --framework rice --output prioritized.json
```

This calculates interest rates, cost-of-delay scores, effort estimates, and generates sprint allocation plans with recommended debt budgets.

### Trend Dashboard

Track debt health over time using multiple scan snapshots:

```bash
python3 scripts/debt_dashboard.py scan1.json scan2.json scan3.json --period monthly
python3 scripts/debt_dashboard.py --input-dir ./debt_scans/ --team-size 8 --output dashboard.json
```

Produces trend analysis, debt velocity (accruing vs paying down), health forecasts, and executive summaries.

### Debt Classification Framework

When classifying debt manually or reviewing scanner output, use the 6-category taxonomy. See [references/debt-classification-taxonomy.md](references/debt-classification-taxonomy.md) for the complete taxonomy:

| Category | Examples |
|----------|----------|
| **Code Debt** | Long functions, high complexity, duplicates, poor naming |
| **Architecture Debt** | Monolithic design, circular deps, god objects, tight coupling |
| **Test Debt** | Low coverage, flaky tests, missing integration tests |
| **Documentation Debt** | Missing API docs, outdated READMEs, no ADRs |
| **Dependency Debt** | Outdated packages, vulnerabilities, unused deps |
| **Infrastructure Debt** | Manual deployments, missing monitoring, env drift |

### Prioritization Frameworks

See [references/prioritization-framework.md](references/prioritization-framework.md) for detailed framework guidance:

- **Cost-of-Delay**: Best when you have clear business metrics. `Priority = (Business Value + Urgency + Risk Reduction) / Effort`
- **WSJF**: Best for SAFe/Agile environments. `WSJF = (Business Value + Time Criticality + Risk Reduction) / Job Size`
- **RICE**: Best for product-focused teams. `RICE = (Reach x Impact x Confidence) / Effort`
- **Fowler's Quadrants**: Best for understanding debt context (Reckless/Prudent x Deliberate/Inadvertent)

### Severity Scoring & Interest Rates

See [references/debt-frameworks.md](references/debt-frameworks.md) for the complete scoring system including:

- Impact assessment (1-10) across velocity, quality, team productivity, and business impact
- Effort estimation (XS to XL t-shirt sizing)
- Interest rate formula: `Interest = Impact Score x Frequency of Encounter / Time Period`
- Cost of delay calculation: `CoD = Interest Rate x Time Until Fix x Team Size Multiplier`

### Sprint Allocation Guide

When planning debt reduction sprints:
- **Velocity < 70% capacity**: 60% debt, 40% features (major blockers present)
- **Velocity 70-85%**: 30% debt, 70% features (balanced maintenance)
- **Velocity > 85%**: 15% debt, 85% features (opportunistic reduction)
- Reserve 20% of sprint capacity for tech debt as a baseline

---

## Important Guidelines

1. **Be specific**: Always provide file paths and line numbers (use format `file.py:123`)
2. **Be constructive**: Don't just criticize, offer solutions
3. **Prioritize**: Help the user understand what matters most
4. **Show examples**: Use code snippets to illustrate points when helpful
5. **Be thorough but concise**: Comprehensive doesn't mean verbose
6. **Think holistically**: Consider how changes interact with each other
7. **Consider context**: Not all patterns are anti-patterns; understand the constraints

## Handling Large Codebases

For large codebases (>50 files):
1. Start with high-level structure analysis
2. Focus on core/critical paths first
3. Sample representative files from each module
4. Ask user if they want deep-dive on specific areas after initial overview
5. Consider running the automated scanner first for a quantitative baseline

## Redundancy Detection Patterns

Pay special attention to these common redundancy patterns:

1. **Validation Logic**: Often duplicated across different input handlers
2. **Data Transformation**: Similar mapping/conversion logic in multiple places
3. **Error Handling**: Repeated try-catch patterns that could be centralized
4. **API Calls**: Multiple wrappers around the same external services
5. **String Formatting**: Similar formatting logic scattered around
6. **Configuration Access**: Multiple ways to read the same config values
7. **Logging**: Inconsistent logging that could be standardized
8. **Authentication/Authorization**: Repeated permission checks

## Output Format

Use markdown formatting with:
- Clear headers (##, ###, ####)
- Code blocks with syntax highlighting
- Tables for comparisons when useful
- Bullet points for lists
- Bold for emphasis on critical points
- File references in the format: `path/to/file.py:line_number`

## Final Step

After presenting the report, ask:
"Would you like me to:
1. Deep dive into any specific area?
2. Show concrete refactoring examples for any issue?
3. Create a prioritized action plan?
4. Run the automated debt scanner for quantitative scoring?
5. Generate a sprint allocation plan for debt reduction?
6. Start implementing any of these improvements?"
