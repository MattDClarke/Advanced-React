import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { CURRENT_USER_QUERY } from './User';
import { useCart } from '../lib/CartState';

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID!) {
    # custom Keystone resolver
    addToCart(productId: $id) {
      id
    }
  }
`;

export default function AddToCart({ id }) {
  const { openCart } = useCart();
  const [addToCart, { loading }] = useMutation(ADD_TO_CART_MUTATION, {
    variables: {
      id,
    },
    // so that added item shows in cart without having to refresh
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  function handleAddToCart() {
    // open cart
    openCart();
    addToCart();
  }

  return (
    <button disabled={loading} type="button" onClick={handleAddToCart}>
      Add{loading && 'ing'} To Cart 🛒
    </button>
  );
}
