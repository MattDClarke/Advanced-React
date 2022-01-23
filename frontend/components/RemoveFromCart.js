import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { CURRENT_USER_QUERY } from './User';

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: var(--red);
    cursor: pointer;
  }
`;

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    # Keystone GraphQL resolver
    deleteCartItem(id: $id) {
      id
    }
  }
`;

// runs after server response
function update(cache, payload) {
  cache.evict({ id: cache.identify(payload.data.deleteCartItem) });
}

export default function RemoveFromCart({ id }) {
  const [removeFromCart, { loading }] = useMutation(DELETE_ITEM_MUTATION, {
    variables: {
      id,
    },
    // not always best solution - not specific - better to remove item from cache instead  of making another request to server
    // refetchQueries: [{ query: CURRENT_USER_QUERY }],
    update,
    // optamistic update - does not work currently
    optimisticResponse: {
      deleteCartItem: {
        __typename: 'CartItem',
        id,
      },
    },
  });
  return (
    <BigButton
      type="button"
      title="Remove this item from cart"
      disabled={loading}
      onClick={removeFromCart}
    >
      &times;
    </BigButton>
  );
}
