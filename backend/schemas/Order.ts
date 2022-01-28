import {
  integer,
  relationship,
  select,
  text,
  virtual,
} from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { isSignedIn, rules } from '../access';
import formatMoney from '../lib/formatMoney';

export const Order = list({
  access: {
    create: isSignedIn,
    read: rules.canOrder,
    update: () => false,
    delete: () => false,
  },
  fields: {
    label: virtual({
      graphQLReturnType: 'String',
      resolver(item) {
        return `${formatMoney(item.total)}`;
      },
    }),
    total: integer(),
    // can be related to many order items - not other way round
    items: relationship({ ref: 'OrderItem.order', many: true }),
    user: relationship({ ref: 'User.orders' }),
    charge: text(),
  },
  ui: {
    listView: {
      initialColumns: ['label', 'user', 'charge', 'items'],
    },
  },
});
