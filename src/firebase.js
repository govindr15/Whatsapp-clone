import {initializeApp} from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { getStorage } from "@firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDp0xdrmROvsHpiNERRPjw_QJLmbZ3j6s0",
    authDomain: "whats-appclone-68aeb.firebaseapp.com",
    projectId: "whats-appclone-68aeb",
    storageBucket: "whats-appclone-68aeb.appspot.com",
    messagingSenderId: "422126199269",
    appId: "1:422126199269:web:695fd0bd6f7ac9c676cf0c",
    measurementId: "G-PTPX3TSS8Y"
  };

  const firebaseApp=initializeApp
  (firebaseConfig);
  
  const db=getFirestore(firebaseApp);
  const auth=getAuth(firebaseApp);
  const storage=getStorage(firebaseApp);
  const provider= new GoogleAuthProvider(firebaseApp);

  export { auth,provider,storage };
  export default db;