---
name: file-editing
description: "Safe file editing discipline. Use when: editing existing files, making targeted code changes, refactoring specific lines, applying code review fixes, replacing strings. NEVER rewrite entire files. DO NOT use terminal write commands (Set-Content, tee, cat >) as a fallback for failed replace operations. Fix replace failures by reading the exact current text first."
---

# File Editing Discipline

## Core Rule

**Always make targeted, minimal edits. Never rewrite a file that already has working content.**

## Procedure

### 1. Read before editing
Always read the relevant section of the file before making changes. Confirm the exact text that exists — `replace_string_in_file` requires a perfect match.

```
read_file → confirm exact text → replace_string_in_file
```

### 2. One change = one replace call
Split independent changes into separate `replace_string_in_file` calls. Do NOT bundle unrelated changes into one large replacement.

**Bad:** Replace 80 lines to change a constant name  
**Good:** Replace only the 1 line where the constant is declared, then separately replace each usage

### 3. When replace fails — re-read, don't rewrite
If `replace_string_in_file` fails (no match found):
- Call `read_file` on the specific lines again
- Copy the exact whitespace, punctuation, and surrounding context
- Retry with corrected `old_str`

**Never fall back to Set-Content / tee / terminal write as a workaround.**

### 4. Validate after every edit
After each `replace_string_in_file`, call `get_errors` on the file.  
If new errors appear — fix them with a targeted replace, not a full rewrite.

### 5. Order of operations for multi-change tasks
When applying N independent changes to one file:

1. Read the file once (large range or full file)
2. Plan all N replacements
3. Apply them sequentially, smallest/safest first
4. Run `get_errors` once at the end

### 6. When a full rewrite IS acceptable
Only rewrite a file entirely if:
- The file is brand new (creating it)
- Over 80% of the file content changes
- The existing content is confirmed broken/corrupted beyond targeted repair

Even then — use `create_file` with full content, not a terminal write command.

## Anti-patterns to avoid

| Anti-pattern | Why it's bad |
|---|---|
| Replace imports block + entire component in one call | Destroys unrelated code between them |
| Use `Set-Content` when replace fails | Bypasses diff tracking, wastes tokens, risky |
| Read file after making changes to "check" | Read BEFORE to get exact match string |
| Re-apply changes already made | Creates duplicates and compile errors |
