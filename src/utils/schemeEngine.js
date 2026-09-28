import schemesData from '../data/schemes.json';

const _normalize = (value) => {
  if (value === null || value === undefined) return null;
  return String(value).trim().toLowerCase();
};

export const checkEligibility = (profile, scheme) => {
  const rules = scheme.eligibility_rules || {};
  const reasons = [];
  let eligible = true;

  // Age check
  const age = profile.age;
  const age_min = rules.age_min;
  const age_max = rules.age_max;

  if (age === undefined || age === null || age === "") {
    if (age_min !== null || age_max !== null) {
      eligible = false;
      reasons.push("Age not provided — cannot verify age criteria");
    } else {
      reasons.push("No age criteria for this scheme");
    }
  } else {
    const numericAge = parseInt(age, 10);
    if (!isNaN(numericAge)) {
      if (age_min !== null && numericAge < age_min) {
        eligible = false;
        reasons.push(`Age ${numericAge} is below minimum ${age_min}`);
      } else if (age_min !== null) {
        reasons.push(`Age ${numericAge} meets minimum ${age_min}`);
      }
      
      if (age_max !== null && numericAge > age_max) {
        eligible = false;
        reasons.push(`Age ${numericAge} exceeds maximum ${age_max}`);
      } else if (age_max !== null) {
        reasons.push(`Age ${numericAge} within maximum ${age_max}`);
      }
    } else {
      eligible = false;
      reasons.push(`Invalid age format: ${age}`);
    }
  }

  // Income check
  const income = profile.income;
  const income_max = rules.income_max;
  
  if (income_max !== null && income_max !== undefined) {
    if (income === undefined || income === null || income === "") {
      eligible = false;
      reasons.push("Income not provided — cannot verify income ceiling");
    } else {
      const numericIncome = parseFloat(income);
      if (!isNaN(numericIncome)) {
        if (numericIncome > income_max) {
          eligible = false;
          reasons.push(`Income ₹${numericIncome} exceeds ceiling ₹${income_max}`);
        } else {
          reasons.push(`Income ₹${numericIncome} within ceiling ₹${income_max}`);
        }
      } else {
        eligible = false;
        reasons.push(`Invalid income format: ${income}`);
      }
    }
  }

  // Occupation check
  const allowedOccupations = rules.occupation;
  const userOccupation = profile.business || profile.occupation; // Map 'business' input to occupation

  if (allowedOccupations !== null && allowedOccupations !== undefined && Array.isArray(allowedOccupations)) {
    if (!userOccupation) {
      eligible = false;
      reasons.push("Occupation not provided — required for this scheme");
    } else {
      const normalized = _normalize(userOccupation);
      // Very basic keyword matching for demonstration, as exact match is too strict for manual entry
      const isAllowed = allowedOccupations.some(o => normalized.includes(_normalize(o)) || _normalize(o).includes(normalized));
      
      if (!isAllowed) {
        eligible = false;
        reasons.push(`Occupation '${userOccupation}' may not fit allowed list: ${allowedOccupations.join(", ")}`);
      } else {
        reasons.push(`Occupation '${userOccupation}' is eligible`);
      }
    }
  }

  // State check - simplify for frontend demo
  const allowedStates = rules.state;
  const userState = profile.location; // User might type "Latur, Maharashtra"

  if (allowedStates !== null && allowedStates !== undefined && Array.isArray(allowedStates)) {
    if (!userState) {
      eligible = false;
      reasons.push("Location not provided — required for this state scheme");
    } else {
      const normalizedState = _normalize(userState);
      const isAllowed = allowedStates.some(s => normalizedState.includes(_normalize(s)));
      if (!isAllowed) {
        eligible = false;
        reasons.push(`Location '${userState}' may not be in allowed states: ${allowedStates.join(", ")}`);
      } else {
        reasons.push(`Location matches eligible state`);
      }
    }
  } else {
    reasons.push("Central scheme — no state restriction");
  }

  // Category check
  const allowedCategories = rules.caste || rules.social_category;
  const userCategory = profile.category;

  if (allowedCategories !== null && allowedCategories !== undefined && Array.isArray(allowedCategories)) {
    if (!userCategory) {
      eligible = false;
      reasons.push("Category not provided — required for this scheme");
    } else {
      const normUserCat = _normalize(userCategory);
      const normAllowed = allowedCategories.map(c => _normalize(c));
      
      if (normAllowed.includes("all") || normAllowed.includes("general") || normAllowed.includes("open")) {
        reasons.push(`Scheme open to all categories`);
      } else if (!normAllowed.includes(normUserCat)) {
        eligible = false;
        reasons.push(`Category '${userCategory}' not eligible (Target: ${allowedCategories.join(", ")})`);
      } else {
        reasons.push(`Category '${userCategory}' matches target criteria`);
      }
    }
  } else {
    reasons.push("Universal Scheme — open to all categories");
  }

  // Gender check
  const allowedGenders = rules.gender;
  const userGender = profile.gender;

  if (allowedGenders !== null && allowedGenders !== undefined && Array.isArray(allowedGenders)) {
    if (!userGender) {
      eligible = false;
      reasons.push("Gender not provided — required for this scheme");
    } else {
      const normUserGender = _normalize(userGender);
      const normAllowed = allowedGenders.map(g => _normalize(g));
      
      if (!normAllowed.includes(normUserGender)) {
        eligible = false;
        reasons.push(`Gender '${userGender}' not eligible (Target: ${allowedGenders.join(", ")})`);
      } else {
        reasons.push(`Gender '${userGender}' matches target criteria`);
      }
    }
  } else {
    reasons.push("Gender neutral scheme");
  }

  return {
    eligible,
    scheme_id: scheme.id,
    scheme_name: scheme.name,
    reasons,
    scheme
  };
};

export const findBestScheme = (profile) => {
  const matches = [];
  for (const scheme of schemesData) {
    const result = checkEligibility(profile, scheme);
    if (result.eligible) {
      matches.push(result);
    }
  }
  
  // Return the best match or a default if none match
  if (matches.length > 0) {
    return matches[0].scheme;
  }
  
  // Fallback if no scheme strictly matches (so the demo doesn't break)
  return schemesData.find(s => s.id === 'mudra') || schemesData[0];
};

// Returns ALL schemes with eligibility status and reasons (for the results screen)
export const findAllMatches = (profile) => {
  const results = [];
  for (const scheme of schemesData) {
    const result = checkEligibility(profile, scheme);
    results.push({
      ...result,
      category: scheme.category || "General",
      benefits: scheme.benefits || "",
      description: scheme.description || scheme.offline_explanation || "",
      documents_required: scheme.documents_required || [],
      apply_url: scheme.apply_url || "",
      is_target_specific: !!(scheme.eligibility_rules && (scheme.eligibility_rules.caste || scheme.eligibility_rules.gender))
    });
  }
  // Sort: eligible first. If both eligible, target-specific first.
  results.sort((a, b) => {
    if (a.eligible && !b.eligible) return -1;
    if (!a.eligible && b.eligible) return 1;
    if (a.eligible && b.eligible) {
      if (a.is_target_specific && !b.is_target_specific) return -1;
      if (!a.is_target_specific && b.is_target_specific) return 1;
    }
    return 0;
  });
  return results;
};
