# CLI Application (apps/cli/)

This directory contains the Command Line Interface (CLI) application built using React and Ink for terminal-based UI rendering.

## Overview

The CLI application provides an interactive interface for users to communicate with the AI agent directly from the terminal. It leverages React components to structure the conversation and handle various states of interaction.

## Core Files

*   **`App.jsx`**: The main entry point for the CLI application.
*   **`cli.jsx`**: Logic for initializing and rendering the CLI interface.
*   **`cli-app.js`**: Helper script or wrapper for executing the CLI application.

## Components

The UI is built using several modular components found in `components/`:

*   **`BoxChat.jsx`**: Likely manages the layout for chat bubbles or interaction boxes.
*   **`Response.jsx`**: Displays the AI's final responses.
*   **`Thinking.jsx`**: Shows a loading or "thinking" state while the AI processes requests.
*   **`ToolCall.jsx`**: Renders indicators when the AI is invoking tools (like WebSearch or File Tools).
*   **`User.jsx`**: Represents the user's input messages.
*   **`markdown/MarkdownRenderer.jsx`**: Handles the rendering of Markdown-formatted text for cleaner, readable AI responses.
