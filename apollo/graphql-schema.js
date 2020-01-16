// from graphql-schema.js from grand-stack-starter /src/graphql-schema.js
import { neo4jgraphql } from "neo4j-graphql-js";
import fs from "fs";
import path from "path";

// TODO
// With Now, make it work reading the file (locally working but not in now)
// For now, export typeDefs directly instead of loading from schema.graphql

// workaround
// import getConfig from 'next/config'
// const { env } = getConfig()

/*
 * Check for GRAPHQL_SCHEMA environment variable to specify schema file
 * fallback to schema.graphql if GRAPHQL_SCHEMA environment variable is not set
 */
// export const typeDefs = fs
//   .readFileSync(
//     process.env.GRAPHQL_SCHEMA || path.join(serverRuntimeConfig.PROJECT_ROOT, "/apollo/schema.graphql")
//   )
//   .toString("utf-8");

export const typeDefs = `
  type User {
    id: ID!
    name: String
    friends: [User] @relation(name: "FRIENDS", direction: "BOTH")
    reviews: [Review] @relation(name: "WROTE", direction: "OUT")
    avgStars: Float
      @cypher(
        statement: "MATCH (this)-[:WROTE]->(r:Review) RETURN toFloat(avg(r.stars))"
      )
    numReviews: Int
      @cypher(statement: "MATCH (this)-[:WROTE]->(r:Review) RETURN COUNT(r)")
    recommendations(first: Int = 3): [Business] @cypher(statement: "MATCH (this)-[:WROTE]->(r:Review)-[:REVIEWS]->(:Business)<-[:REVIEWS]-(:Review)<-[:WROTE]-(:User)-[:WROTE]->(:Review)-[:REVIEWS]->(rec:Business) WHERE NOT EXISTS( (this)-[:WROTE]->(:Review)-[:REVIEWS]->(rec) )WITH rec, COUNT(*) AS num ORDER BY num DESC LIMIT $first RETURN rec")
  }

  type Business {
    id: ID!
    name: String
    address: String
    city: String
    state: String
    avgStars: Float @cypher(statement: "MATCH (this)<-[:REVIEWS]-(r:Review) RETURN coalesce(avg(r.stars),0.0)")
    reviews: [Review] @relation(name: "REVIEWS", direction: "IN")
    categories: [Category] @relation(name: "IN_CATEGORY", direction: "OUT")
  }

  type Review {
    id: ID!
    stars: Int
    text: String
    date: Date
    business: Business @relation(name: "REVIEWS", direction: "OUT")
    user: User @relation(name: "WROTE", direction: "IN")
  }

  type Category {
    name: ID!
    businesses: [Business] @relation(name: "IN_CATEGORY", direction: "IN")
  }

  type Query {
    usersBySubstring(substring: String): [User]
      @cypher(
        statement: "MATCH (u:User) WHERE u.name CONTAINS $substring RETURN u"
      )
  }
`
