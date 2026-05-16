// functions/index.js
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.midnightRolloverEngine = onSchedule({
    schedule: "1 0 * * *", // 12:01 AM every day
    timeZone: "America/Toronto", // Ensures accurate midnight for Ontario
    timeoutSeconds: 60,
    memory: "256MiB"
}, async (event) => {
    logger.info("Starting Schell Family Calendar midnight rollover...");
    
    const batch = db.batch();
    const today = new Date();
    const isSaturday = today.getDay() === 6; // 0 is Sunday, 6 is Saturday
    
    try {
        // --- 1. ARCHIVE DAILY COMPLETIONS ---
        const completionsRef = db.collection('completions');
        const completionsSnap = await completionsRef.get();
        
        completionsSnap.forEach((docSnap) => {
            const data = docSnap.data();
            
            const historyRef = db.collection('history').doc(docSnap.id);
            batch.set(historyRef, {
                ...data,
                archivedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            
            batch.delete(docSnap.ref);
        });

        // --- 2. SATURDAY ALLOWANCE PAYOUT & WEEKLY RESET ---
        if (isSaturday) {
             logger.info("Saturday detected: Calculating weekly payouts...");
             
             // REFACTORED: Query anyone who has chore tracking enabled
             const membersRef = db.collection('familyMembers');
             const participantsQuery = await membersRef.where('participatesInChores', '==', true).get();
             
             participantsQuery.forEach((memberDoc) => {
                 const memberData = memberDoc.data();
                 const currentPoints = memberData.points || 0;
                 const payRate = memberData.payRate || 0.01;
                 
                 const payoutAmount = currentPoints * payRate; 
                 
                 if (currentPoints > 0) {
                     const payoutRef = db.collection('payouts').doc();
                     batch.set(payoutRef, {
                         memberId: memberDoc.id,
                         memberName: memberData.name,
                         amount: payoutAmount,
                         date: admin.firestore.FieldValue.serverTimestamp(),
                         pointsConverted: currentPoints,
                         status: 'unpaid' 
                     });

                     // Reset the member's points to 0
                     batch.update(memberDoc.ref, { points: 0 });
                 }
             });
        }
        
        // --- 3. COMMIT THE ATOMIC BATCH ---
        await batch.commit();
        logger.info(`Rollover complete! Archived ${completionsSnap.size} chores.`);
        
    } catch (error) {
        logger.error("CRITICAL: Rollover Engine Failed!", error);
    }
});