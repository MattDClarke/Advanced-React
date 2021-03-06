import { createAuth } from '@keystone-next/auth';
import 'dotenv/config';
import { config, createSchema } from '@keystone-next/keystone/schema';
import {
  withItemData,
  statelessSessions,
} from '@keystone-next/keystone/session';
import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { CartItem } from './schemas/CartItem';
import { Order } from './schemas/Order';
import { OrderItem } from './schemas/OrderItem';
import { Role } from './schemas/Role';
import { ProductImage } from './schemas/ProductImage';
import { insertSeedData } from './seed-data';
import { sendPasswordResetEmail } from './lib/mail';
import { extendGraphqlSchema } from './mutations';
import { permissionsList } from './schemas/fields';

const databaseURL =
  process.env.DATABASE_URL ||
  'mongodb://localhost/key-stone-sick-fits-tutorial';

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // session sign in time
  secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
  // user logs in
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    // TODO: Add in initial roles here
  },
  passwordResetLink: {
    async sendToken(args) {
      // send the email
      await sendPasswordResetEmail(args.token, args.identity);
    },
  },
});

export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    db: {
      adapter: 'mongoose',
      url: databaseURL,
      async onConnect(keystone) {
        // only run if seed script run
        if (process.argv.includes('--seed-data'))
          await insertSeedData(keystone);
      },
    },
    // Keystone refers to datatypes as lists
    lists: createSchema({
      // Schema items go in here
      User,
      Product,
      ProductImage,
      CartItem,
      Order,
      OrderItem,
      Role,
    }),
    extendGraphqlSchema,
    ui: {
      // show the ui only for ppl who passed the test
      isAccessAllowed: ({ session }) => !!session?.data,
    },
    session: withItemData(statelessSessions(sessionConfig), {
      // GraphQL query - on every request
      User: `id name email role { ${permissionsList.join(' ')} }`,
    }),
  })
);
