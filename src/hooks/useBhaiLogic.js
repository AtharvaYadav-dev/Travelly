import { useCallback } from 'react';

/**
 * useBhaiLogic Hook: Adaptive Accessibility
 * Dynamic AI-driven translation of UI technical jargon into Mumbai street slang / Hinglish.
 */
export const useBhaiLogic = (isSlangEnabled = true) => {
  const dictionary = {
    "Submit": "Bhej de Bhai!",
    "Searching": "Dhoond raha hoon...",
    "Loading": "Wait kar, bhai ban raha hai...",
    "Error": "Bhai, gadbad ho gayi!",
    "Success": "Itinerary ready hai, party kar!",
    "Budget": "Kitna paisa kharcha karega?",
    "Location": "Kahan jaana hai?",
    "Destinations": "Mast Jagah",
    "Itinerary": "Trip ka Plan",
    "Logistics": "Intezaam",
    "Create": "Banao Bhai",
    "Share": "Doston ko dikhao",
    "Copy": "Nakal karlo",
    "Delete": "Hata de bhai",
    "Login": "Andar aao",
    "Logout": "Bahar jao",
    "Profile": "Apna Swag",
    "Back": "Piche hato",
    "Next": "Aage badho"
  };

  const translate = useCallback((text) => {
    if (!isSlangEnabled) return text;
    
    // Exact match
    if (dictionary[text]) return dictionary[text];

    // Fallback: If no exact match, return as is (or could use an AI call if needed)
    return text;
  }, [isSlangEnabled]);

  return { translate };
};
