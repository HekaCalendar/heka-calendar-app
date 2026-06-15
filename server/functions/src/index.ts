import * as admin from 'firebase-admin';

admin.initializeApp();

export { deleteUserData } from './deleteUserData';
export { getEntitlements } from './entitlements';
export { samlLogin, oidcLogin } from './sso';
