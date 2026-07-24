import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createLocalMcpServer } from './mcp.js';

const server = createLocalMcpServer();
await server.connect(new StdioServerTransport());
