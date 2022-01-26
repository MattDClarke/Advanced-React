import { graphQLSchemaExtension } from '@keystone-next/keystone/schema';
import addToCart from './addToCart';
import checkout from './checkout';

// make a fake graphql tagged template literal
const graphql = String.raw;
export const extendGraphqlSchema = graphQLSchemaExtension({
  // name of method, arguments, what does it return
  typeDefs: graphql`
    type Mutation {
      addToCart(productId: ID): CartItem
      # takes in token from client and returns Order
      checkout(token: String!): Order
    }
  `,
  // links to Node functions that will run when method requested via GraphQL
  resolvers: {
    Mutation: {
      addToCart,
      checkout,
    },
  },
});
