import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, deleteField } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useMidnightTick } from './useMidnightTick';

export function useCustody() {
  const todayStr = useMidnightTick();
  const [overrides, setOverrides] = useState({});

  const getLocalIsoDate = (dateString) => {
    const d = new Date(dateString);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayIso = getLocalIsoDate(todayStr);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'dailyOverrides', todayIso), (docSnap) => {
      if (docSnap.exists()) {
        setOverrides(docSnap.data());
      } else {
        setOverrides({});
      }
    });
    return () => unsub();
  }, [todayIso]);

  const checkBaseSchedule = (kid, targetDateStr) => {
    // If no schedule exists, default to always here
    if (!kid || !kid.schedule || !kid.schedule.pattern || kid.schedule.pattern.length === 0) return true;
    if (!kid.schedule.referenceDate) return true;

    const pattern = kid.schedule.pattern;
    const cycleLength = pattern.length;

    // Standardize target to local midnight
    const target = new Date(targetDateStr);
    target.setHours(0, 0, 0, 0);

    // Standardize the anchor string (YYYY-MM-DD) to local midnight
    const [refY, refM, refD] = kid.schedule.referenceDate.split('-');
    const refDate = new Date(refY, refM - 1, refD);
    refDate.setHours(0, 0, 0, 0);

    const msPerDay = 1000 * 60 * 60 * 24;
    // Difference in days. Math.round handles daylight savings time shifts safely.
    const daysDiff = Math.round((target - refDate) / msPerDay);

    // Calculate the exact index in the pattern array. 
    // The ((n % m) + m) % m formula ensures negative days (past dates) wrap correctly.
    const cycleDay = ((daysDiff % cycleLength) + cycleLength) % cycleLength; 
    
    return pattern[cycleDay];
  };

  const isHereToday = (kid) => {
    if (!kid) return false;
    if (overrides[kid.id] !== undefined) return overrides[kid.id];
    return checkBaseSchedule(kid, todayStr);
  };

  const toggleOverride = async (kidId, currentlyHere) => {
    const overrideRef = doc(db, 'dailyOverrides', todayIso);
    await setDoc(overrideRef, { [kidId]: !currentlyHere }, { merge: true });
  };

  const clearOverride = async (kidId) => {
    const overrideRef = doc(db, 'dailyOverrides', todayIso);
    await setDoc(overrideRef, { [kidId]: deleteField() }, { merge: true });
  };

  return { isHereToday, checkBaseSchedule, overrides, toggleOverride, clearOverride };
}