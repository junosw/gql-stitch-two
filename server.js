const express = require('express')
const graphqlHTTP = require('express-graphql')
const {
  makeRemoteExecutableSchema,
  makeExecutableSchema,
  mergeSchemas
} = require('graphql-tools')
const { createApolloFetch } = require('apollo-fetch')
const { find, filter, concat } = require('lodash')

const typeDefs = `
  type Dolphin {
    id: Int!
    name: String
    genre: String!
  }

  type Query {
    dolphins: [Dolphin]
  }
`

const dolphins = [
  { id: 1, name: 'Bob' },
  { id: 2, name: 'Nemo' },
  { id: 3, name: 'Ariel' }
]

const resolvers = {
  Query: {
    dolphins: () => dolphins
  }
}

makeRemoteExecutableSchema(
  createApolloFetch({
    uri: 'http://localhost:3000/graphql'
  })
)
  .then(remoteSchema => {
    const localSchema = makeExecutableSchema({
      typeDefs,
      resolvers
    })

    const schema = mergeSchemas({
      onTypeConflict: (leftType, rightType) => leftType,
      schemas: [localSchema, remoteSchema]
    })

    const app = express()

    app.use(
      '/graphql',
      graphqlHTTP({
        schema: schema,
        graphiql: true
      })
    )

    app.listen(3001)
    console.log('Started on port 3001')
  })
  .catch(error => {
    console.log('Error occurred starting server', error)
  })
