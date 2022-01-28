import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

// At its simplest - access control is eith a yes or no value depending on the user's session

// has access to Keystone context
// yes or no
export function isSignedIn({ session }: ListAccessArgs) {
  // !!undefined = false. coerce falsy and truthy to boolean
  return !!session;
}

// array of key values -> object
const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

// check for specific permissions - each permission will be its own function
// check if someone meets a criteria - yes or no
export const permissions = {
  ...generatedPermissions,
  // can add additional permissions
};

// rule based function - return boolean or filter that limits which products they can CRUD
// multiple permissions
export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. do they the permission of canManageProducts (Admin)
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // 2. if not, do they own this item?
    // where filter (GraphQL where)
    return { user: { id: session.itemId } };
  },
  canOrder({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageCart({ session })) {
      return true;
    }
    return { user: { id: session.itemId } };
  },
  canManageOrderItems({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageCart({ session })) {
      return true;
    }
    return { order: { user: { id: session.itemId } } };
  },
  canReadProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageProducts({ session })) {
      return true; // they can read everything (draft, available, unavailable)
    }
    // they should only see available products (based on the status field)
    // bind as a where clause in GraphQL API
    return { status: 'AVAILABLE' };
  },
  canManageUsers({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageUsers({ session })) {
      return true;
    }
    // otherwise they may only update themselves
    return { id: session.itemId };
  },
};
