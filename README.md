# Claude Code Skills

A collection of skills for [Claude Code](https://claude.ai/claude-code) — Anthropic's CLI for Claude.

## Skills Included

| Skill | Description |
|-------|-------------|
| **system-design** | Design scalable distributed systems (load balancing, caching, DB scaling, message queues). Combined from [wondelai/skills](https://github.com/wondelai/skills) + [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills) |
| **codebase-analyzer** | Codebase analysis, tech debt tracking, and code quality management |
| **ci-cd-pipeline-builder** | Build CI/CD pipelines (GitHub Actions, GitLab CI) |
| **security-audit** | Security auditing |
| **pr-review-expert** | Expert PR reviews |
| **dependency-auditor** | Audit project dependencies |
| **performance-profiler** | Performance profiling |
| **playwright-skill** | Browser automation and testing with Playwright |
| **superdesign** | Frontend UI/UX design agent |
| **skill-creator** | Create, modify, and benchmark skills |
| **skill-security-auditor** | Security audit skills before installation |

## Installation

Copy the skills you want into your Claude Code skills directory:

```bash
# Copy all skills
cp -r claude-code-skills/* ~/.claude/skills/

# Or copy a specific skill
cp -r claude-code-skills/system-design ~/.claude/skills/
```

## License

Individual skills retain their original licenses. See each skill's `SKILL.md` for details.
