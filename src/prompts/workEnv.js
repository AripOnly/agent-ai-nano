const os = process.platform;

const shell = os === "win32" ? "PowerShell" : "bash";

export const workEnv = `
# You are running on:

- Operating System: ${os}
- Shell: ${shell}
- Your Current Location: ${process.cwd()}
- You can work in other directories when needed by using the \`workdir\` parameter.
`;
