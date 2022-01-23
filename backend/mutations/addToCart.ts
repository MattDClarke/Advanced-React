import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput } from '../.keystone/schema-types';
import { Session } from '../types';

async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  //   console.log('ADDING TO CART');
  // 1. query curr user - see if signed in
  const sesh = context.session as Session;
  if (!sesh.itemId) {
    throw new Error('You must be logged in to do this!');
  }
  // 2. query curr users cart
  // use findMany because you can't use findOne unless all fields used are unique
  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: sesh.itemId }, product: { id: productId } },
    // explicitly tell Keystone which fields u want
    resolveFields: 'id, quantity',
  });
  //   console.log(productId);
  //   console.log(allCartItems);
  const [existingCartItem] = allCartItems;
  if (existingCartItem) {
    // console.log(existingCartItem);
    // console.log(
    //   `There are already ${existingCartItem.quantity}, increment by 1.`
    // );
    // 3. check if curr item is in their cart
    //    4. if it is, inc by 1
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity + 1 },
    });
  }
  //    4. if not, create a new cart item
  return await context.lists.CartItem.createOne({
    data: {
      // create relationship
      product: { connect: { id: productId } },
      user: { connect: { id: sesh.itemId } },
    },
  });
}

export default addToCart;
