import { db, auth, storage } from '../config/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function testWrite() {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error('User not authenticated');
  }

  try {
    const docRef = await addDoc(collection(db, "users", uid, "debug"), {
      ok: true,
      at: serverTimestamp(),
      message: "Firestore write test successful",
    });
    console.log("Test document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error writing test document: ", error);
    throw error;
  }
}

export async function testStorage() {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error('User not authenticated');
  }

  try {
    const storageRef = ref(storage, `users/${uid}/hello.txt`);
    const blob = new Blob([`Hi ${uid} - Storage test at ${new Date().toISOString()}`], { type: "text/plain" });

    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);

    console.log("File uploaded successfully. URL:", url);
    return url;
  } catch (error) {
    console.error("Error uploading file: ", error);
    throw error;
  }
}