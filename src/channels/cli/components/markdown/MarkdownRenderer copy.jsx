import React from "react";
import { Box, Text } from "ink";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

function renderInline(node, key) {
  switch (node.type) {
    case "text":
      return node.value;

    case "strong":
      return (
        <Text key={key} bold>
          {node.children.map((child, i) => renderInline(child, i))}
        </Text>
      );

    case "emphasis":
      return (
        <Text key={key} italic>
          {node.children.map((child, i) => renderInline(child, i))}
        </Text>
      );

    case "inlineCode":
      return (
        <Text key={key} color="gray">
          {node.value}
        </Text>
      );

    case "link":
      return (
        <Text key={key} underline color="blue">
          {node.children.map((child, i) => renderInline(child, i))}
        </Text>
      );

    case "break":
      return "\n";

    default:
      return node.children?.map((child, i) => renderInline(child, i));
  }
}

function renderBlock(node, key, context = {}) {
  switch (node.type) {
    case "root":
      return (
        <Box key={key} flexDirection="column">
          {node.children.map((child, i) => renderBlock(child, i))}
        </Box>
      );

    case "heading":
      return (
        <Box key={key} marginTop={1} marginBottom={1}>
          <Text bold color="green">
            {node.children.map((child, i) => renderInline(child, i))}
          </Text>
        </Box>
      );

    case "paragraph":
      return (
        <Box key={key} marginBottom={1}>
          <Text>{node.children.map((child, i) => renderInline(child, i))}</Text>
        </Box>
      );

    case "list":
      return (
        <Box key={key} flexDirection="column">
          {node.children.map((child, i) =>
            renderBlock(child, i, {
              ordered: node.ordered,
              index: i + 1,
            }),
          )}
        </Box>
      );

    case "listItem":
      return (
        <Box key={key} flexDirection="row" marginLeft={1}>
          <Text>{context.ordered ? `${context.index}. ` : "• "}</Text>

          <Box flexDirection="column">
            {node.children.map((child, i) => renderBlock(child, i))}
          </Box>
        </Box>
      );

    case "code":
      return (
        <Box
          key={key}
          paddingBottom={1}
          paddingX={1}
          borderStyle="round"
          borderColor={"gray"}
        >
          <Text color="cyan">{node.value}</Text>
        </Box>
      );

    case "blockquote":
      return (
        <Box key={key} marginLeft={2} flexDirection="column">
          <Text color="gray">│</Text>

          {node.children.map((child, i) => renderBlock(child, i))}
        </Box>
      );

    case "thematicBreak":
      return (
        <Box paddingBottom={1}>
          <Text key={key} color={"gray"}>
            {"─".repeat(50)}
          </Text>
        </Box>
      );

    default:
      return null;
  }
}

function parseMarkdown(content) {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkBreaks)
    .parse(content);
}

const MarkdownRenderer = ({ children }) => {
  if (!children) return null;

  const tree = parseMarkdown(children);

  return renderBlock(tree, 0);
};

export default MarkdownRenderer;
