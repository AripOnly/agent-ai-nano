const read = {
  type: "function",
  name: "Read",
  description:
    "Read a UTF-8 text file from the workspace. Never use this tool for images or binary files. Use this tool whenever the user asks to view, inspect, analyze, summarize, debug, search, or quote the contents of a local file. If only part of a file is needed, provide start_line and end_line. Never request more than 200 lines in one call.",

  parameters: {
    type: "object",
    additionalProperties: false,
    properties: {
      path: {
        type: "string",
        description:
          "Relative path inside the workspace, for example: src/index.js",
      },
      start_line: {
        type: "integer",
        minimum: 1,
        description: "First line to read (1-based).",
      },
      end_line: {
        type: "integer",
        minimum: 1,
        description: "Last line to read (1-based). Maximum 200 lines.",
      },
    },
    required: ["path"],
  },
};

const write = {
  type: "function",
  name: "Write",

  description: `
Create, overwrite, edit, or insert text into a UTF-8 file in the workspace.

Use OVERWRITE
- when creating a new file.
- when replacing the entire file.

Use LINE_EDIT
- when the user wants to modify existing lines.
- start_line and end_line are required.
- maximum editable range is 200 lines.

Use INSERT
- when the user explicitly asks to insert or add lines.
- start_line is required.
- existing lines must remain unchanged.

The tool automatically prevents path traversal and writing outside the workspace.
`,

  parameters: {
    type: "object",

    properties: {
      path: {
        type: "string",
        description: "Relative file path.",
      },

      content: {
        type: "string",
        description: "Text that will be written.",
      },

      mode: {
        type: "string",
        enum: ["OVERWRITE", "LINE_EDIT", "INSERT"],
      },

      start_line: {
        type: "integer",
        minimum: 1,
        description: "Required for LINE_EDIT and INSERT.",
      },

      end_line: {
        type: "integer",
        minimum: 1,
        description: "Required only for LINE_EDIT.",
      },
    },

    required: ["path", "content", "mode"],
  },
};

const run = {
  type: "function",

  name: "Run",

  description: `
Execute a terminal command on the user's computer.

This tool may be used for general computer assistant tasks, including software development, file management, system inspection, automation, package management, and running local applications.

Examples:
- npm install
- npm run build
- node app.js
- python main.py
- git status
- git pull
- cargo build
- go test
- dir
- ls
- cd
- mkdir
- copy
- move
- rename

Security Rules:
- Never execute commands that intentionally damage the operating system.
- Never delete, move, rename, overwrite, or modify operating system files or directories.
- Never remove or modify Windows, Linux, or macOS system folders.
- Never execute commands that format disks, modify partitions, bootloaders, firmware, registry, system services, user accounts, or security policies.
- Never disable antivirus, firewall, Windows Defender, SELinux, AppArmor, Gatekeeper, or other security mechanisms.
- Never execute ransomware-like, destructive, or data wiping commands.
- Never delete user files unless the user explicitly requests it and the target is clearly identified.
- Never move or rename files if doing so could break the operating system or installed applications.
- Never perform privilege escalation or bypass operating system security.

Only execute commands that are necessary to accomplish the user's requested task while preserving the integrity of the operating system and user data.

Execution Limits:
- Maximum execution time: 5 seconds.
- Maximum stdout/stderr: 2 MB.
- Terminal window is hidden on Windows.
`,

  parameters: {
    type: "object",

    properties: {
      command: {
        type: "string",
        description: "The exact terminal command to execute.",
      },
    },

    required: ["command"],
  },
};

export const schema = { read, write, run };
