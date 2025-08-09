# ZardUI MCP Server

A Model Context Protocol (MCP) server for the ZardUI Angular component library. This server provides AI assistants with comprehensive access to ZardUI components, enabling seamless component discovery, installation, and usage through natural language interactions.

## 🚀 Features

- 🔍 **Component Discovery**: List and search through all available ZardUI components
- 📖 **Source Code Access**: Retrieve component source code, variants, and TypeScript modules
- 🎨 **Demo Retrieval**: Access component demos and usage examples with real code
- 📚 **Documentation**: Get component documentation (overview and API reference)
- 🔧 **Metadata Extraction**: Component dependencies, variants, and properties analysis
- 🚀 **CLI Integration**: Install components directly using the official `@ngzard/ui` CLI
- 🛠️ **Project Setup**: Initialize ZardUI in Angular projects automatically
- 📋 **Installation Guides**: Generate step-by-step installation instructions
- 🏗️ **Auto-detection**: Smart project detection with customizable paths
- 📝 **Comprehensive Logging**: Configurable logging levels for debugging

## 📦 Installation

### Via NPX (Recommended)
```bash
npx @zardui/mcp-server
```

### Global Installation
```bash
npm install -g @zardui/mcp-server
zardui-mcp
```

### Local Development
```bash
git clone https://github.com/zard-ui/zardui.git
cd zardui/mcp
npm install
npm run build
npm start
```

## 🔧 Configuration

### Claude Desktop Integration

Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

#### Basic Configuration
```json
{
  "mcpServers": {
    "zardui": {
      "command": "npx",
      "args": ["@zardui/mcp-server"],
      "cwd": "/path/to/your/angular/project"
    }
  }
}
```

#### Advanced Configuration with Logging
```json
{
  "mcpServers": {
    "zardui": {
      "command": "npx",
      "args": [
        "@zardui/mcp-server",
        "--log-level", "debug",
        "--project-path", "/path/to/zardui/project"
      ],
      "cwd": "/path/to/your/angular/project"
    }
  }
}
```

### Command Line Options

```bash
npx @zardui/mcp-server [options]

Options:
  --help                    Show help message and exit
  --version                 Show version information and exit
  --log-level <level>       Set logging level (error, warn, info, debug)
                            Default: info
  --project-path <path>     Path to ZardUI project root
                            Default: auto-detect from current directory

Examples:
  npx @zardui/mcp-server
  npx @zardui/mcp-server --log-level debug
  npx @zardui/mcp-server --project-path /home/user/zardui
```

## 🛠️ Available Tools

### Component Discovery Tools

#### `list_components`
List all available ZardUI components with optional filtering.

**Usage Example:**
> "List all ZardUI components"
> "Show me all available ZardUI components"

**Response:** Returns a formatted list of all components with count.

---

#### `search_components` 
Search for components by name or functionality.

**Parameters:**
- `query` (required): Search term
- `type` (optional): Search scope ("name", "description", "demo", "all")

**Usage Examples:**
> "Search for form-related components"
> "Find components with 'button' in the name"
> "Search for input components in demos"

---

### Component Information Tools

#### `get_component`
Retrieve source code for specific ZardUI components.

**Parameters:**
- `name` (required): Component name (e.g., "button", "card", "dialog")
- `file` (optional): Specific file ("component.ts", "variants.ts", "all")

**Usage Examples:**
> "Get the source code for the button component"
> "Show me the variants file for the dialog component"
> "Retrieve all files for the card component"

**Response:** Returns formatted TypeScript source code with file organization.

---

#### `get_component_demo`
Retrieve demo code showing component usage patterns.

**Parameters:**
- `name` (required): Component name
- `demo` (optional): Specific demo name

**Usage Examples:**
> "Show me demo code for the button component"
> "Get the 'default' demo for the input component"
> "Show all demos for the dialog component"

**Response:** Returns TypeScript demo code with Angular templates.

---

#### `get_component_docs`
Retrieve comprehensive component documentation.

**Parameters:**
- `name` (required): Component name
- `type` (optional): Documentation type ("overview", "api", "both")

**Usage Examples:**
> "Show documentation for the input component"
> "Get API documentation for the dialog component"
> "Show overview docs for the button component"

**Response:** Returns markdown documentation with usage guidelines.

---

#### `get_component_metadata`
Get detailed metadata including dependencies, variants, and properties.

**Parameters:**
- `name` (required): Component name

**Usage Examples:**
> "Get metadata for the dialog component"
> "Show me the variants available for the button component"
> "What are the dependencies of the input component?"

**Response:** Returns structured metadata with variants, files, and dependencies.

---

### Installation & Setup Tools

#### `install_component`
Install ZardUI components using the official CLI.

**Parameters:**
- `components` (required): Array of component names
- `path` (optional): Target installation path
- `overwrite` (optional): Overwrite existing files

**Usage Examples:**
> "Install button and card components"
> "Add the dialog component to my project"
> "Install input component with overwrite enabled"

**Response:** Executes CLI installation and returns success/error status.

---

#### `init_zardui`
Initialize ZardUI configuration in an Angular project.

**Parameters:**
- `path` (optional): Project path (defaults to current directory)
- `style` (optional): Style format ("css", "scss")

**Usage Examples:**
> "Initialize ZardUI in my Angular project"
> "Set up ZardUI with SCSS support"
> "Initialize ZardUI in /path/to/my/project"

**Response:** Configures TailwindCSS, adds dependencies, and sets up project structure.

---

#### `get_installation_guide`
Generate step-by-step installation instructions.

**Parameters:**
- `components` (required): Array of component names
- `format` (optional): Output format ("markdown", "text", "json")

**Usage Examples:**
> "Generate installation guide for button and input components"
> "Get setup instructions for dialog component in JSON format"
> "Show me how to install card and avatar components"

**Response:** Returns formatted installation guide with CLI commands and setup steps.

---

## 💡 Usage Examples

### Getting Started
```
AI: "I want to use ZardUI components in my Angular project."

Response: The server will help you:
1. Initialize ZardUI in your project
2. Install required dependencies
3. Add components as needed
4. Provide usage examples
```

### Component Development
```
AI: "I need a button component with different variants."

Response: 
1. Lists available button variants
2. Shows source code structure
3. Provides demo implementations
4. Offers installation commands
```

### Troubleshooting
```
AI: "The dialog component isn't working correctly."

Response:
1. Shows component documentation
2. Provides working demo code
3. Lists dependencies and requirements
4. Offers debugging guidance
```

## 🏗️ Architecture

### Project Structure
```
mcp/
├── src/
│   ├── index.ts              # Main entry point with CLI parsing
│   ├── handler.ts            # Request handler setup and routing
│   ├── tools/
│   │   ├── index.ts          # Tool definitions and schemas
│   │   └── handlers.ts       # Tool implementation logic
│   └── utils/
│       ├── args.ts           # Command-line argument parser
│       ├── logger.ts         # Logging system with levels
│       └── project.ts        # Project detection and utilities
├── dist/                     # Built TypeScript output
├── package.json              # Dependencies and npm scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This documentation
```

### Design Principles

- **Modular Architecture**: Clean separation between tools, handlers, and utilities
- **Error Resilience**: Comprehensive error handling with informative messages
- **Type Safety**: Full TypeScript implementation with strict typing
- **Extensibility**: Easy to add new tools and capabilities
- **Performance**: Efficient project detection and file operations
- **User Experience**: Natural language interactions with helpful responses

### Technology Stack

- **Model Context Protocol (MCP)**: v1.17.2 SDK for AI assistant integration
- **TypeScript**: Full type safety and modern JavaScript features
- **Node.js**: Cross-platform runtime with ES modules
- **Angular CLI Integration**: Uses official `@ngzard/ui` CLI package
- **File System Operations**: Efficient async file handling

## 🚀 Development

### Prerequisites
- Node.js 20 or higher
- TypeScript 5.7+
- Access to ZardUI project (local or remote)

### Development Workflow
```bash
# Install dependencies
npm install

# Run in development mode with hot reload
npm run dev

# Build for production
npm run build

# Test the built version
npm start

# Clean build directory
npm run clean

# Prepare for publishing
npm run prepublishOnly
```

### Adding New Tools

1. **Define the tool** in `src/tools/index.ts`
2. **Implement the handler** in `src/tools/handlers.ts`
3. **Register the tool** in `src/handler.ts`
4. **Update documentation** with usage examples
5. **Test thoroughly** with different scenarios

### Testing

```bash
# Test basic functionality
npx @zardui/mcp-server --help

# Test with debug logging
npx @zardui/mcp-server --log-level debug

# Test project detection
npx @zardui/mcp-server --project-path /path/to/zardui
```

## 🔍 Troubleshooting

### Common Issues

#### Server Won't Start
- **Check Node.js version**: Ensure Node.js 20+ is installed
- **Verify dependencies**: Run `npm install` to ensure all packages are present
- **Check permissions**: Ensure the script has execution permissions
- **Review logs**: Use `--log-level debug` for detailed information

#### Components Not Found
- **Project detection**: Verify ZardUI project structure exists
- **Path configuration**: Use `--project-path` to specify correct location
- **Component directory**: Ensure `libs/zard/src/lib/components` exists
- **Debug mode**: Enable debug logging to see detection process

#### CLI Commands Fail
- **Network connectivity**: Ensure internet access for `npx` commands
- **Angular project**: Verify you're in a valid Angular project directory
- **CLI compatibility**: Check `@ngzard/ui` CLI version compatibility
- **Permissions**: Ensure write permissions for target directories

#### Claude Desktop Integration Issues
- **Configuration syntax**: Validate JSON syntax in config file
- **Path accuracy**: Use absolute paths in configuration
- **Server accessibility**: Test server startup independently
- **Restart Claude**: Restart Claude Desktop after configuration changes

### Debug Mode

Enable comprehensive logging for troubleshooting:

```bash
npx @zardui/mcp-server --log-level debug --project-path /your/project
```

This will show:
- Project detection process
- Component discovery steps
- File system operations
- CLI command execution
- Error stack traces

### Getting Help

1. **Check logs** with `--log-level debug`
2. **Verify project structure** matches ZardUI requirements
3. **Test CLI independently** with `npx @ngzard/ui --help`
4. **Review configuration** for syntax errors
5. **Open an issue** on GitHub with debug logs

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository** on GitHub
2. **Create a feature branch** from `main`
3. **Make your changes** with proper TypeScript typing
4. **Add tests** if applicable
5. **Update documentation** for new features
6. **Submit a pull request** with clear description

### Contribution Guidelines

- Follow existing code style and patterns
- Add comprehensive error handling
- Include usage examples in documentation
- Test with both local and remote ZardUI projects
- Ensure backward compatibility

## 🔗 Related Projects

- **[ZardUI](https://zardui.com)** - Main Angular component library
- **[@ngzard/ui](https://npmjs.com/package/@ngzard/ui)** - Official CLI tool
- **[Model Context Protocol](https://modelcontextprotocol.io)** - MCP specification
- **[Claude Desktop](https://claude.ai/desktop)** - AI assistant with MCP support

## 📊 Roadmap

### Planned Features
- [ ] Component dependency graph analysis
- [ ] Automated component testing integration
- [ ] Theme and styling customization tools
- [ ] Component performance metrics
- [ ] Integration with popular IDEs
- [ ] Multi-framework support (React, Vue)
- [ ] Cloud-based component registry
- [ ] AI-powered component recommendations

### Performance Improvements
- [ ] Intelligent caching system
- [ ] Parallel file operations
- [ ] Memory optimization
- [ ] Streaming for large responses
- [ ] Connection pooling
- [ ] Request deduplication

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**MCP SDK**: 1.17.2  
**Node.js**: 20+