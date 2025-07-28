import QB from "quickblox/quickblox.min";

const APP_ID = Number(process.env.NEXT_PUBLIC_QB_APP_ID);
const AUTH_KEY = process.env.NEXT_PUBLIC_QB_AUTH_KEY!;
const ACCOUNT_KEY = process.env.NEXT_PUBLIC_QB_ACCOUNT_KEY!;
const AUTH_SECRET = process.env.NEXT_PUBLIC_QB_AUTH_SECRET!;

export const initQuickBlox = () => {
  console.log("INICIALIZANDO QB");
  console.log('APP_ID', process.env.NEXT_PUBLIC_QB_APP_ID);
  console.log('AUTH_KEY', process.env.NEXT_PUBLIC_QB_AUTH_KEY);
  console.log('ACCOUNT_KEY', process.env.NEXT_PUBLIC_QB_ACCOUNT_KEY);
  
  
  QB.init(APP_ID, AUTH_KEY, AUTH_SECRET, {
    accountKey: ACCOUNT_KEY,
    debug: true,
  });
  
};

export default QB;
