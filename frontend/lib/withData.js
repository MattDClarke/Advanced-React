import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/link-error';
import { getDataFromTree } from '@apollo/client/react/ssr';
import { createUploadLink } from 'apollo-upload-client';
import withApollo from 'next-with-apollo';
import { endpoint, prodEndpoint } from '../config';
import paginationField from './paginationField';

function createClient({ headers, initialState }) {
  return new ApolloClient({
    // link is a standard interface for mod control flow of
    // GraphQL requests and fetching GraphQL results
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        // back end down, CORS issues, back end not running
        if (networkError)
          console.log(
            `[Network error]: ${networkError}. Backend is unreachable. Is it running?`
          );
      }),
      // this uses apollo-link-http under the hood, so all the options here come from that package
      // allows queries and mutations
      createUploadLink({
        // graphql endpoint
        uri: process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint,
        fetchOptions: {
          // send cookies with request
          credentials: 'include',
        },
        // pass the headers along from this request. This enables SSR with logged in state
        // render logged in state on server -> user gets logged in UI right away
        headers,
      }),
    ]),
    // in browser
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            // Manually deal with invalidation
            allProducts: paginationField(),
          },
        },
      },
      // initially rendered views on server -> pass data to hydration on client
      // prevents data being fetched on server and then fetched on client again
    }).restore(initialState || {}),
  });
}

// withApollo -> crawl pages -> look for queries -> wait for data to be fetched before server sends HTML from server to client
export default withApollo(createClient, { getDataFromTree });
