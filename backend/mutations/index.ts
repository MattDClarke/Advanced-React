import { graphQLSchemaExtension } from '@keystone-next/keystone/schema';
import addToCart from './addToCart';

// make a fake graphql tagged template literal
const graphql = String.raw;
export const extendGraphqlSchema = graphQLSchemaExtension({
  // name of method, arguments, what does it return
  typeDefs: graphql`
    type Mutation {
      addToCart(productId: ID): CartItem
    }
  `,
  // links to Node functions that will run when method requested via GraphQL
  resolvers: {
    Mutation: {
      addToCart,
    },
  },
});
