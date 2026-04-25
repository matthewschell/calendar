import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { DEFAULT_MEMBERS, DEFAULT_CHORES } from '../constants/defaults';

export async function seedFirestore() {
  try {
    console.log("🌱 Seeding family members...");
    for (const member of DEFAULT_MEMBERS) {
      // Writes to the 'familyMembers' collection, using the member's ID as the document ID
      await setDoc(doc(db, 'familyMembers', member.id), member);
    }

    console.log("🌱 Seeding chores...");
    for (const chore of DEFAULT_CHORES) {
      // Writes to the 'chores' collection, using the chore's ID as the document ID
      await setDoc(doc(db, 'chores', chore.id), chore);
    }

    alert("✅ Database successfully seeded! Go check your Firebase Console.");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    alert("❌ Error seeding database. Check the developer console for details.");
  }
}