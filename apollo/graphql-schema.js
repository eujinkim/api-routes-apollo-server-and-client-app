// from graphql-schema.js from grand-stack-starter /src/graphql-schema.js
import { neo4jgraphql } from "neo4j-graphql-js";
import fs from "fs";
import path from "path";

// workaround
import getConfig from 'next/config'
const { serverRuntimeConfig } = getConfig()

/*
 * Check for GRAPHQL_SCHEMA environment variable to specify schema file
 * fallback to schema.graphql if GRAPHQL_SCHEMA environment variable is not set
 */

export const typeDefs = fs
  .readFileSync(
    process.env.GRAPHQL_SCHEMA || path.join(serverRuntimeConfig.PROJECT_ROOT, "/apollo/schema.graphql")
  )
  .toString("utf-8");

