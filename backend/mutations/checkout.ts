import { KeystoneContext } from '@keystone-next/types';
import {
  CartItemCreateInput,
  OrderCreateInput,
} from '../.keystone/schema-types';
import stripeConfig from '../lib/stripe';
import { CartItem } from '../schemas/CartItem';

const graphql = String.raw;
interface Arguments {
  token: string;
}

async function checkout(
  root: any,
  // arguments
  { token }: Arguments,
  context: KeystoneContext
): Promise<OrderCreateInput> {
  // 1. Make sure they are signed in
  const userId = context.session.itemId;
  if (!userId) {
    throw new Error('You must be signed in to create an order.');
  }
  // 2. Query the current user
  // id is unique so you can use findOne
  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: graphql`
    id
    name
    email
    cart {
      id
      quantity
      product {
        id
        name
        price
        description
        photo {
          id
          image {
            publicUrlTransformed
          }
        }
      }
    }
    `,
  });
  // wont truncate object
  // console.dir(user, { depth: null });
  // 3. calc total price for their order - order info from backend - each time user adds item to cart - GraphQL mutation - store added cart item on backend
  // filter out cart items where product = null
  const cartItems = user.cart.filter((cartItem) => cartItem.product);
  const amount = cartItems.reduce(function (
    tally: number,
    cartItem: CartItemCreateInput
  ) {
    return tally + cartItem.quantity * cartItem.product.price;
  },
  0);

  // console.log(amount);
  // 4. create the charge with the Stripe library
  const charge = await stripeConfig.paymentIntents
    .create({
      amount,
      currency: 'USD',
      // most often you want to charge card immediately - no further confirmation
      confirm: true,
      payment_method: token,
    })
    .catch((err) => {
      // console.log(err);
      throw new Error(err.message);
    });
  // console.log(charge);
  // 5. Convert the cartItems to OrderItems - can't leave as regular product (snapshot of product at time of purchase)
  const orderItems = cartItems.map((cartItem) => {
    const orderItem = {
      name: cartItem.product.name,
      description: cartItem.product.name,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      // make a relationship - connect to existing one
      photo: { connect: { id: cartItem.product.photo.id } },
    };
    return orderItem;
  });
  // 6. create the order and return it
  const order = await context.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      // order may have relationship to many items
      // orderItems created before order
      items: { create: orderItems },
      user: { connect: { id: userId } },
    },
  });
  // 7. clean up any old cart items - delete all existing cart items
  const cartItemIds = user.cart.map((cartItem) => cartItem.id);
  await context.lists.CartItem.deleteMany({
    ids: cartItemIds,
  });
  // return to user
  return order;
}

export default checkout;
