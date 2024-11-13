import { auth, db, storage } from './firebaseconfig';  // Make sure to import storage from your firebase config
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc
} from "firebase/firestore";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";

// Sign up user
export const signUpUser = async (obj) => {
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, obj.email, obj.password);
    const user = userCredential.user;
    console.log(user.uid);
    

    // Optionally upload photo to Firebase Storage if it exists
    let photoURL = null;
    if (obj.photo) {
      const photoRef = ref(storage, `profile_photos/${user.uid}`);
      await uploadBytes(photoRef, obj.photo);  // Upload photo
      photoURL = await getDownloadURL(photoRef);  // Get the uploaded photo URL
    }

    // Save user data in Firestore with additional information
    await setDoc(doc(db, "users", user.uid), {
      name: obj.name,
      username: obj.username,
      email: obj.email,
      photo: photoURL,  // Save photo URL if uploaded
      gender: obj.gender,
      phone: obj.phone,
      website: obj.website,
      uid: user.uid,
      createdAt: new Date()  // Store the creation timestamp
    });

    return user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

// Log in user
export const loginUser = async (obj) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, obj.email, obj.password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

// Log out user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    alert('logged out')
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

// Get data from a specific document
export const dataGet = async (nodeName, id) => {
  try {
    const docRef = doc(db, nodeName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log(docSnap.data());
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
};

// Set new data in a specific document
export const dataSet = async (nodeName, id, obj) => {
  try {
    await setDoc(doc(db, nodeName, id), obj);
    console.log("Document written successfully");
  } catch (error) {
    console.error("Error setting document:", error);
    throw error;
  }
};

// Edit/update data in a specific document
export const dataEdit = async (nodeName, id, obj) => {
  try {
    const docRef = doc(db, nodeName, id);
    await updateDoc(docRef, obj);
    console.log("Document updated successfully");
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

// Delete a specific document
export const dataDelete = async (nodeName, id) => {
  try {
    await deleteDoc(doc(db, nodeName, id));
    console.log("Document deleted successfully");
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};
