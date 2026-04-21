/**
 * Simple Drug Interaction Checking Service
 * 
 * Compares incoming prescription medicines with existing ones
 */

const knownConflicts = [
  { drug1: 'Aspirin', drug2: 'Ibuprofen', warning: 'High risk of gastrointestinal bleeding.' },
  { drug1: 'Sildenafil', drug2: 'Nitrates', warning: 'Potential life-threatening drop in blood pressure.' },
  { drug1: 'Warfarin', drug2: 'Aspirin', warning: 'High risk of severe bleeding.' },
  { drug1: 'Lisinopril', drug2: 'Potassium', warning: 'Risk of hyperkalemia (high potassium).' },
  // Simple predefined dataset
];

export const checkInteractions = (newMedicines, existingPrescriptions) => {
  const warnings = [];
  const currentMeds = newMedicines.map(m => m.name.toLowerCase());
  
  // Extract all existing active medicines (in a real scenario, this would check duration and overlap)
  let existingMeds = [];
  existingPrescriptions.forEach(prescription => {
    prescription.medicines.forEach(m => {
      existingMeds.push(m.name.toLowerCase());
    });
  });

  // check new vs existing
  for (let conflict of knownConflicts) {
    const d1 = conflict.drug1.toLowerCase();
    const d2 = conflict.drug2.toLowerCase();

    // Check if new meds contain one part of interaction, and existing contains the other
    if ((currentMeds.includes(d1) && existingMeds.includes(d2)) ||
        (currentMeds.includes(d2) && existingMeds.includes(d1))) {
      warnings.push(`Interaction Warning between ${conflict.drug1} and ${conflict.drug2}: ${conflict.warning}`);
    }

    // Check if new meds contain both parts of interaction themselves
    if (currentMeds.includes(d1) && currentMeds.includes(d2)) {
      warnings.push(`Interaction Warning between newly prescribed ${conflict.drug1} and ${conflict.drug2}: ${conflict.warning}`);
    }
  }

  // Remove duplicate warnings
  return [...new Set(warnings)];
};
