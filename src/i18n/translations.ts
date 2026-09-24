import type { Language } from '../models/types'

export const languages: { id: Language; label: string; native: string }[] = [
  { id: 'en', label: 'English', native: 'English' },
  { id: 'mr', label: 'Marathi', native: 'मराठी' },
  { id: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { id: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ' },
]

const copy = {
  en: {
    liveClassroom: 'Live classroom', today: 'Today', plan: 'Dynamic plan', catchUp: 'Catch-up', more: 'More',
    nextAttention: 'Next attention', currentFocus: 'Current focus', why: 'Why', afterThat: 'After that', start: 'Start', goTo: 'Go to',
    classroom: 'Classroom', updateGroups: 'Update groups', viewPlan: 'View plan', onTrack: 'On track', slowing: 'Slowing', stuck: 'Stuck', finished: 'Finished',
    needsTeacher: 'Needs teacher', teaching: 'Teaching', practice: 'Practice', independent: 'Independent', peerPractice: 'Peer practice',
    workingOffline: 'Working offline', synced: 'Synced', planUpdated: 'Plan updated', simulator: 'Classroom simulator', resetDemo: 'Reset demo',
    grade: 'Grade', minutes: 'min', activity: 'Activity', mode: 'Mode', materials: 'Materials', progress: 'Progress', teacherNeed: 'Teacher need',
    checkpoint: 'Checkpoint', secure: 'Secure', needsPractice: 'Needs practice', save: 'Save', cancel: 'Cancel', language: 'Language',
    openGroup: 'Open group', finishExplanation: 'Finish explanation', grade2Stuck: 'Grade 2 is stuck', grade3Finished: 'Grade 3 finished', grade1Weak: 'Grade 1 checkpoint weak',
  },
  mr: {
    liveClassroom: 'चालू वर्ग', today: 'आज', plan: 'बदलता आराखडा', catchUp: 'भरपाई', more: 'अधिक',
    nextAttention: 'पुढील लक्ष', currentFocus: 'सध्याचे लक्ष', why: 'का', afterThat: 'त्यानंतर', start: 'सुरू करा', goTo: 'जा',
    classroom: 'वर्ग', updateGroups: 'गट अपडेट', viewPlan: 'आराखडा पहा', onTrack: 'योग्य मार्गावर', slowing: 'हळू', stuck: 'अडलेला', finished: 'पूर्ण',
    needsTeacher: 'शिक्षक हवे', teaching: 'शिकवणे', practice: 'सराव', independent: 'स्वयं-अभ्यास', peerPractice: 'मित्र सराव',
    workingOffline: 'ऑफलाइन काम सुरू', synced: 'सिंक झाले', planUpdated: 'आराखडा बदलला', simulator: 'वर्ग सिम्युलेटर', resetDemo: 'डेमो रीसेट',
    grade: 'इयत्ता', minutes: 'मि.', activity: 'कृती', mode: 'पद्धत', materials: 'साहित्य', progress: 'प्रगती', teacherNeed: 'शिक्षकाची गरज',
    checkpoint: 'तपासणी', secure: 'पक्के', needsPractice: 'सराव हवा', save: 'जतन', cancel: 'रद्द', language: 'भाषा',
    openGroup: 'गट उघडा', finishExplanation: 'स्पष्टीकरण पूर्ण', grade2Stuck: 'इयत्ता २ अडली', grade3Finished: 'इयत्ता ३ पूर्ण', grade1Weak: 'इयत्ता १ तपासणी कमकुवत',
  },
  hi: {
    liveClassroom: 'चलती कक्षा', today: 'आज', plan: 'बदलती योजना', catchUp: 'पकड़ समूह', more: 'और',
    nextAttention: 'अगला ध्यान', currentFocus: 'अभी ध्यान', why: 'क्यों', afterThat: 'उसके बाद', start: 'शुरू करें', goTo: 'जाएँ',
    classroom: 'कक्षा', updateGroups: 'समूह अपडेट', viewPlan: 'योजना देखें', onTrack: 'सही गति', slowing: 'धीमा', stuck: 'अटका', finished: 'पूरा',
    needsTeacher: 'शिक्षक चाहिए', teaching: 'शिक्षण', practice: 'अभ्यास', independent: 'स्व-अध्ययन', peerPractice: 'साथी अभ्यास',
    workingOffline: 'ऑफलाइन काम जारी', synced: 'सिंक हुआ', planUpdated: 'योजना बदली', simulator: 'कक्षा सिम्युलेटर', resetDemo: 'डेमो रीसेट',
    grade: 'कक्षा', minutes: 'मि.', activity: 'गतिविधि', mode: 'तरीका', materials: 'सामग्री', progress: 'प्रगति', teacherNeed: 'शिक्षक की जरूरत',
    checkpoint: 'जाँच', secure: 'पक्का', needsPractice: 'अभ्यास चाहिए', save: 'सहेजें', cancel: 'रद्द', language: 'भाषा',
    openGroup: 'समूह खोलें', finishExplanation: 'समझाना पूरा', grade2Stuck: 'कक्षा २ अटक गई', grade3Finished: 'कक्षा ३ पूरी', grade1Weak: 'कक्षा १ की जाँच कमजोर',
  },
  or: {
    liveClassroom: 'ଚାଲୁ ଶ୍ରେଣୀ', today: 'ଆଜି', plan: 'ବଦଳୁଥିବା ଯୋଜନା', catchUp: 'ପୂରଣ ଗୋଷ୍ଠୀ', more: 'ଅଧିକ',
    nextAttention: 'ପରବର୍ତ୍ତୀ ଧ୍ୟାନ', currentFocus: 'ବର୍ତ୍ତମାନ ଧ୍ୟାନ', why: 'କାହିଁକି', afterThat: 'ତାପରେ', start: 'ଆରମ୍ଭ', goTo: 'ଯାଆନ୍ତୁ',
    classroom: 'ଶ୍ରେଣୀ', updateGroups: 'ଗୋଷ୍ଠୀ ବଦଳାନ୍ତୁ', viewPlan: 'ଯୋଜନା ଦେଖନ୍ତୁ', onTrack: 'ଠିକ୍ ଗତି', slowing: 'ଧୀର', stuck: 'ଅଟକିଛି', finished: 'ସମାପ୍ତ',
    needsTeacher: 'ଶିକ୍ଷକ ଦରକାର', teaching: 'ଶିକ୍ଷାଦାନ', practice: 'ଅଭ୍ୟାସ', independent: 'ସ୍ୱୟଂ ଅଭ୍ୟାସ', peerPractice: 'ସାଥୀ ଅଭ୍ୟାସ',
    workingOffline: 'ଅଫଲାଇନରେ କାମ', synced: 'ସିଙ୍କ ହୋଇଛି', planUpdated: 'ଯୋଜନା ବଦଳିଲା', simulator: 'ଶ୍ରେଣୀ ସିମୁଲେଟର', resetDemo: 'ଡେମୋ ପୁନଃସ୍ଥାପନ',
    grade: 'ଶ୍ରେଣୀ', minutes: 'ମି.', activity: 'କାର୍ଯ୍ୟ', mode: 'ପଦ୍ଧତି', materials: 'ସାମଗ୍ରୀ', progress: 'ପ୍ରଗତି', teacherNeed: 'ଶିକ୍ଷକ ଆବଶ୍ୟକତା',
    checkpoint: 'ଯାଞ୍ଚ', secure: 'ନିଶ୍ଚିତ', needsPractice: 'ଅଭ୍ୟାସ ଦରକାର', save: 'ସଞ୍ଚୟ', cancel: 'ବାତିଲ', language: 'ଭାଷା',
    openGroup: 'ଗୋଷ୍ଠୀ ଖୋଲନ୍ତୁ', finishExplanation: 'ବ୍ୟାଖ୍ୟା ସମାପ୍ତ', grade2Stuck: 'ଶ୍ରେଣୀ ୨ ଅଟକିଛି', grade3Finished: 'ଶ୍ରେଣୀ ୩ ସମାପ୍ତ', grade1Weak: 'ଶ୍ରେଣୀ ୧ ଯାଞ୍ଚ ଦୁର୍ବଳ',
  },
} as const

export type TranslationKey = keyof typeof copy.en

export function getCopy(language: Language, key: TranslationKey): string {
  return copy[language][key] ?? copy.en[key]
}
