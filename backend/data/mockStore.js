const users = [
  {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    phone: null,
    passwordHash: '$2a$10$ifIiOSUK4kJLAMlNKyVU.umVOLPHoLvBbM59FGvixcJZ4.QzIctFa', // password123
    createdAt: new Date().toISOString(),
  },
];

const providers = [
  {
    id: 1,
    name: 'Ola',
    logo_url: 'ola.png',
    app_scheme: 'olacabs://app/launch',
    play_store_url: 'https://play.google.com/store/apps/details?id=com.olacabs.customer',
    intent_uri: 'intent:#Intent;package=com.olacabs.customer;scheme=olacabs;end',
    supports_bike: true,
    supports_auto: true,
    supports_cab: true,
    supports_parcel: true,
    supports_rental: true,
  },
  {
    id: 2,
    name: 'Uber',
    logo_url: 'uber.png',
    app_scheme: 'uber://',
    play_store_url: 'https://play.google.com/store/apps/details?id=com.ubercab',
    intent_uri: 'intent:#Intent;package=com.ubercab;scheme=uber;end',
    supports_bike: true,
    supports_auto: false,
    supports_cab: true,
    supports_parcel: true,
    supports_rental: false,
  },
  {
    id: 3,
    name: 'Namma Yatri',
    logo_url: 'namma_yatri.png',
    app_scheme: 'nammayatri://',
    play_store_url: 'https://play.google.com/store/apps/details?id=in.yatri',
    intent_uri: 'intent:#Intent;package=in.yatri;end', // Optimized intent
    supports_bike: true,
    supports_auto: true,
    supports_cab: false,
    supports_parcel: false,
    supports_rental: false,
  },
  {
    id: 4,
    name: 'Rapido',
    logo_url: 'rapido.png',
    app_scheme: 'rapido://',
    play_store_url: 'https://play.google.com/store/apps/details?id=com.rapido.passenger',
    intent_uri: 'intent:#Intent;package=com.rapido.passenger;end', // Optimized intent
    supports_bike: true,
    supports_auto: true,
    supports_cab: false,
    supports_parcel: false,
    supports_rental: false,
  },
];

const rideTypes = [
  { id: 1, name: 'Bike', description: 'Two-wheeler ride', category: 'bike', icon: 'motorcycle' },
  { id: 2, name: 'Auto', description: 'Three-wheeler ride', category: 'auto', icon: 'electric-rickshaw' },
  { id: 3, name: 'Cab', description: 'Four-wheeler ride', category: 'cab', icon: 'directions-car' },
  { id: 6, name: 'Parcel', description: 'Package delivery', category: 'parcel', icon: 'inventory-2' },
  { id: 9, name: 'Rental', description: 'Hourly rental', category: 'rental', icon: 'history-toggle-off' },
];

const vehicleCategories = [
  { id: 1, provider_id: 1, ride_type_id: 1, name: 'Ola Bike', base_fare: 30, per_km_rate: 10, per_min_rate: 1 },
  { id: 2, provider_id: 1, ride_type_id: 2, name: 'Ola Auto', base_fare: 45, per_km_rate: 15, per_min_rate: 1.5 },
  { id: 3, provider_id: 1, ride_type_id: 3, name: 'Ola Mini', base_fare: 80, per_km_rate: 18, per_min_rate: 2 },
  { id: 4, provider_id: 2, ride_type_id: 1, name: 'Uber Moto', base_fare: 25, per_km_rate: 9, per_min_rate: 1.2 },
  { id: 5, provider_id: 2, ride_type_id: 3, name: 'Uber Go', base_fare: 75, per_km_rate: 17, per_min_rate: 1.8 },
  { id: 6, provider_id: 3, ride_type_id: 1, name: 'NY Bike', base_fare: 20, per_km_rate: 8, per_min_rate: 0.5 },
  { id: 7, provider_id: 3, ride_type_id: 2, name: 'NY Auto', base_fare: 35, per_km_rate: 13, per_min_rate: 1 },
  { id: 8, provider_id: 4, ride_type_id: 1, name: 'Rapido Bike', base_fare: 28, per_km_rate: 9.5, per_min_rate: 1 },
  { id: 9, provider_id: 4, ride_type_id: 2, name: 'Rapido Auto', base_fare: 40, per_km_rate: 14, per_min_rate: 1.5 },
];

let searches = [];
let nextUserId = 2;
let nextSearchId = 1;

const createUser = ({ email, name, phone, passwordHash }) => {
  const user = {
    id: nextUserId++,
    email,
    name: name || null,
    phone: phone || null,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  return user;
};

const findUserByEmail = (email) => users.find((u) => u.email.toLowerCase() === email.toLowerCase());

const getPublicUser = (user) => ({ id: user.id, email: user.email, name: user.name });

const addSearch = (entry) => {
  const search = {
    id: nextSearchId++,
    created_at: new Date().toISOString(),
    ...entry,
  };
  searches.push(search);
  return search;
};

const getSearchHistoryByUser = (userId, limit = 10) =>
  searches
    .filter((s) => s.user_id === userId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit);

module.exports = {
  users,
  providers,
  rideTypes,
  vehicleCategories,
  createUser,
  findUserByEmail,
  getPublicUser,
  addSearch,
  getSearchHistoryByUser,
};
