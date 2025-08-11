## Commands

The ZardUI CLI provides two main commands to help you manage components in your project.

### init

Initialize your project and install dependencies for ZardUI components.

**Usage:**
```bash
npx @ngzard/ui init
```

**Options:**
- `-y, --yes` - Skip confirmation prompts
- `-c, --cwd <path>` - Specify working directory

**Examples:**

Initialize ZardUI with interactive prompts:
```bash title="Terminal" copyButton
npx @ngzard/ui init
```

Initialize ZardUI without confirmation prompts:
```bash title="Terminal" copyButton  
npx @ngzard/ui init --yes
```

### add

Add components to your project with automatic dependency management.

**Usage:**
```bash
npx @ngzard/ui add [components...]
```

**Options:**
- `-y, --yes` - Skip confirmation prompts
- `-o, --overwrite` - Overwrite existing files
- `-c, --cwd <path>` - Specify working directory
- `-a, --all` - Add all available components
- `-p, --path <path>` - Custom path for components

**Examples:**

Add a single component:
```bash title="Terminal" copyButton
npx @ngzard/ui add button
```

Add multiple components:
```bash title="Terminal" copyButton
npx @ngzard/ui add button card dialog
```

Add all available components:
```bash title="Terminal" copyButton
npx @ngzard/ui add --all
```

Interactive component selection:
```bash title="Terminal" copyButton
npx @ngzard/ui add
```