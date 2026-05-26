export interface Candidate {
  id: string;
  name: string;
  party: string;
  color: string;
}

export interface StationResult {
  stationId: string;
  stationName: string;
  province: string;
  votes: Record<string, number>; // candidateId -> count
  timestamp: string;
  verified: boolean;
}

export const CANDIDATES: Candidate[] = [
  { id: 'efx', name: 'Economic Freedom X', party: 'EFX', color: '#BE0000' },
  { id: 'dx', name: 'Democratic X', party: 'DX', color: '#005BA6' },
  { id: 'anx', name: 'African National X', party: 'ANX', color: '#fdec00ff' },
  { id: 'mx', name: 'uMkhonto X', party: 'MX', color: '#2C2C2C' },
  { id: 'ifx', name: 'Inkatha Freedom X', party: 'IFX', color: '#FF0000' },
  { id: 'px', name: 'Patriotic X', party: 'PX', color: '#000000' },
];

export const PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape',
  'Western Cape',
  'International/Abroad'
];

export const TRANSLATIONS = {
  en: {
    title: 'Voter Identification',
    subtitle: 'Please enter your South African ID number to proceed.',
    btnNext: 'Verify Identity',
    btnBack: 'Back',
    btnVote: 'Confirm Vote',
    selectStation: 'Select Voting Station',
    selectProvince: 'Select Your Province',
    chooseParty: 'Cast Your Vote',
    successTitle: 'Vote Cast Successfully!',
    successMsg: 'Your vote has been securely recorded on the national digital roll.',
    receiptLabel: 'Your Official Vote Receipt:',
    checkLink: 'Verify this vote later',
    errorId: 'Please enter a valid 13-digit SA ID number.',
    errorParty: 'Please select a party.',
    errorProvince: 'Please select a province.',
    placeholderId: 'Ex: 9001015800084',
    scanTitle: 'Biometric Verification',
    scanMsg: 'Position your face within the frame. Connecting to Home Affairs...',
    verifying: 'Verifying...',
    seats: 'Seats'
  },
  zu: {
    title: 'Ukuqinisekiswa Kwavoti',
    subtitle: 'Sicela ufake inombolo yakho kamazisi (ID) ukuze uqhubeke.',
    btnNext: 'Qinisekisa',
    btnBack: 'Emuva',
    btnVote: 'Vota Manje',
    selectStation: 'Khetha Isiteshi Sokuvota',
    selectProvince: 'Khetha Isifundazwe Sakho',
    chooseParty: 'Khetha Iqembu Lakho',
    successTitle: 'Ivoti Lakho Liphumelele!',
    successMsg: 'Ivoti lakho libhaliswe ngokuphephile ohlelweni lukazwelonke.',
    receiptLabel: 'Irisidi Lakho Lokuvota:',
    checkLink: 'Qinisekisa ivoti lakho',
    errorId: 'Sicela ufake inombolo ye-ID evumelekile.',
    errorParty: 'Sicela ukhethe iqembu.',
    errorProvince: 'Sicela ukhethe isifundazwe.',
    placeholderId: 'Isib: 9001015800084',
    scanTitle: 'Ukuqinisekiswa Kobuso',
    scanMsg: 'Beka ubuso bakho phakathi kwebhokisi. Sixhumana ne-Home Affairs...',
    verifying: 'Siyaqinisekisa...',
    seats: 'Izihlalo'
  },
  xh: {
    title: 'Ukuqinisekiswa Kovoti',
    subtitle: 'Nceda ufake inombolo yakho yesazisi (ID) ukuze uqhubeke.',
    btnNext: 'Qinisekisa',
    btnBack: 'Buyela',
    btnVote: 'Vota Ngoku',
    selectStation: 'Khetha Isikhululo Sokuvota',
    selectProvince: 'Khetha Iphondo Lakho',
    chooseParty: 'Khetha Umbutho Wakho',
    successTitle: 'Ivoti Lakho Liphumelele!',
    successMsg: 'Ivoti lakho libhaliswe ngokukhuselekileyo.',
    receiptLabel: 'Iirisithi Yakho Yokuvota:',
    checkLink: 'Qinisekisa ivoti lakho',
    errorId: 'Nceda ufake inombolo ye-ID eyiyo.',
    errorParty: 'Nceda ukhethe umbutho.',
    errorProvince: 'Nceda ukhethe iphondo.',
    placeholderId: 'Umz: 9001015800084',
    scanTitle: 'Ukuqinisekiswa Kobuso',
    scanMsg: 'Beka ubuso bakho ebhokisini. Siqhagamshelana ne-Home Affairs...',
    verifying: 'Siyaqinisekisa...',
    seats: 'Izihlalo'
  },
  af: {
    title: 'Kieser Identifikasie',
    subtitle: 'Voer asseblief u Suid-Afrikaanse ID-nommer in om voort te gaan.',
    btnNext: 'Verifieer',
    btnBack: 'Terug',
    btnVote: 'Bevestig Stem',
    selectStation: 'Kies Stemlokaal',
    selectProvince: 'Kies U Provinsie',
    chooseParty: 'Kies U Party',
    successTitle: 'Stem Suksesvol Uitgebring!',
    successMsg: 'U stem is veilig op die nasionale digitale rol aangeteken.',
    receiptLabel: 'U Amptelike Stembewys:',
    checkLink: 'Verifieer hierdie stem later',
    errorId: 'Voer asseblief \'n geldige 13-syfer ID-nommer in.',
    errorParty: 'Kies asseblief \'n party.',
    errorProvince: 'Kies asseblief \'n provinsie.',
    placeholderId: 'Bv: 9001015800084',
    scanTitle: 'Biometriese Verifikasie',
    scanMsg: 'Plaas u gesig binne die raam. Koppel tans aan Binnelandse Sake...',
    verifying: 'Verifieer...',
    seats: 'Setels'
  }
};

export const TOTAL_ELIGIBLE_VOTERS = 5000; // Scaled down for demo (Real SA stats would be ~40M)

export const STATIONS = [
  { id: 'WC001', name: 'Cape Town City Hall', province: 'Western Cape' },
  { id: 'GP001', name: 'Soweto Community Center', province: 'Gauteng' },
  { id: 'KZN001', name: 'Durban ICC', province: 'KwaZulu-Natal' },
  { id: 'EC001', name: 'Gqeberha High', province: 'Eastern Cape' },
  { id: 'FS001', name: 'Bloemfontein Central', province: 'Free State' },
];
