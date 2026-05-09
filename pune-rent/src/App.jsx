import * as React from 'react';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, MarkerClusterer, InfoWindow } from '@react-google-maps/api';

// API BASE URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Area Coordinates Mapping - All Pune areas with accurate geocoded coordinates
const AREA_COORDINATES = {
  // West Pune / IT Corridor
  'hinjewadi': { lat: 18.5921, lng: 73.7576, radius: 1200 },
  'wakad': { lat: 18.6022, lng: 73.7644, radius: 1200 },
  'baner': { lat: 18.5642, lng: 73.7769, radius: 1200 },
  'balewadi': { lat: 18.5820, lng: 73.7690, radius: 1200 },
  'aundh': { lat: 18.5619, lng: 73.8102, radius: 1200 },
  'pimple saudagar': { lat: 18.5982, lng: 73.7978, radius: 1200 },
  'pimple nilakh': { lat: 18.5697, lng: 73.7941, radius: 1200 },
  'bavdhan': { lat: 18.5210, lng: 73.7781, radius: 1200 },
  'sus': { lat: 18.5537, lng: 73.7527, radius: 1200 },
  'mahalunge': { lat: 18.6154, lng: 73.7502, radius: 1200 },
  'tathawade': { lat: 18.6154, lng: 73.7502, radius: 1200 },
  'punawale': { lat: 18.6383, lng: 73.7462, radius: 1200 },
  'ravet': { lat: 18.6433, lng: 73.7451, radius: 1200 },
  'nigdi': { lat: 18.6598, lng: 73.7773, radius: 1200 },
  'akurdi': { lat: 18.6486, lng: 73.7647, radius: 1200 },
  'chinchwad': { lat: 18.6404, lng: 73.7917, radius: 1200 },
  'pimpri': { lat: 18.6232, lng: 73.8020, radius: 1200 },
  'thergaon': { lat: 18.6093, lng: 73.7729, radius: 1200 },
  'sangvi': { lat: 18.6182, lng: 73.8210, radius: 1200 },
  
  // East Pune / Airport / IT Belt
  'kharadi': { lat: 18.5513, lng: 73.9417, radius: 1200 },
  'viman nagar': { lat: 18.5704, lng: 73.9133, radius: 1200 },
  'kalyani nagar': { lat: 18.5481, lng: 73.9026, radius: 1200 },
  'koregaon park': { lat: 18.5366, lng: 73.8933, radius: 1200 },
  'yerawada': { lat: 18.5656, lng: 73.8866, radius: 1200 },
  'vishrantwadi': { lat: 18.5726, lng: 73.8782, radius: 1200 },
  'dhanori': { lat: 18.5907, lng: 73.8913, radius: 1200 },
  'lohegaon': { lat: 18.5804, lng: 73.9182, radius: 1200 },
  'wagholi': { lat: 18.5806, lng: 73.9833, radius: 1200 },
  'mundhwa': { lat: 18.5343, lng: 73.9298, radius: 1200 },
  'keshav nagar': { lat: 18.5323, lng: 73.9384, radius: 1200 },
  'hadapsar annexe': { lat: 18.4844, lng: 73.9665, radius: 1200 },
  'magarpatta': { lat: 18.5112, lng: 73.9274, radius: 1200 },
  'amanora': { lat: 18.5178, lng: 73.9440, radius: 1200 },
  'kharadi bypass': { lat: 18.5040, lng: 73.9277, radius: 1200 },
  
  // Central Pune
  'shivajinagar': { lat: 18.5326, lng: 73.8513, radius: 1200 },
  'deccan': { lat: 18.5489, lng: 73.8749, radius: 1200 },
  'model colony': { lat: 18.5314, lng: 73.8375, radius: 1200 },
  'erandwane': { lat: 18.5087, lng: 73.8318, radius: 1200 },
  'karve nagar': { lat: 18.4894, lng: 73.8213, radius: 1200 },
  'kothrud': { lat: 18.5071, lng: 73.8051, radius: 1200 },
  'warje': { lat: 18.4820, lng: 73.8002, radius: 1200 },
  'nal stop': { lat: 18.5087, lng: 73.8310, radius: 1200 },
  'sadashiv peth': { lat: 18.5108, lng: 73.8502, radius: 1200 },
  'narayan peth': { lat: 18.5156, lng: 73.8511, radius: 1200 },
  'camp': { lat: 18.5216, lng: 73.8718, radius: 1200 },
  'sangamvadi': { lat: 18.5200, lng: 73.8480, radius: 1200 },
  
  // South Pune
  'hadapsar': { lat: 18.5008, lng: 73.9379, radius: 1200 },
  'magarpatta city': { lat: 18.5112, lng: 73.9274, radius: 1200 },
  'amanora park town': { lat: 18.5178, lng: 73.9461, radius: 1200 },
  'kondhwa': { lat: 18.4780, lng: 73.8941, radius: 1200 },
  'nibm road': { lat: 18.4626, lng: 73.9158, radius: 1200 },
  'undri': { lat: 18.4519, lng: 73.8914, radius: 1200 },
  'mohammadwadi': { lat: 18.4733, lng: 73.9238, radius: 1200 },
  'pisoli': { lat: 18.4516, lng: 73.8927, radius: 1200 },
  'bibwewadi': { lat: 18.4752, lng: 73.8562, radius: 1200 },
  'katraj': { lat: 18.4537, lng: 73.8563, radius: 1200 },
  'dhankawadi': { lat: 18.4653, lng: 73.8550, radius: 1200 },
  'ambegaon': { lat: 18.4750, lng: 73.8500, radius: 1200 },
  'sinhagad road': { lat: 18.5005, lng: 73.8446, radius: 1200 },
  'dhayari': { lat: 18.4374, lng: 73.8190, radius: 1200 },
  'manjari': { lat: 18.5236, lng: 73.9872, radius: 1200 },
  
  // North / Industrial / Budget-Friendly
  'moshi': { lat: 18.6523, lng: 73.8442, radius: 1200 },
  'chikhali': { lat: 18.6642, lng: 73.8267, radius: 1200 },
  'charholi': { lat: 18.6616, lng: 73.8870, radius: 1200 },
  'alandi road': { lat: 18.5612, lng: 73.8766, radius: 1200 },
  'bhosari': { lat: 18.6210, lng: 73.8501, radius: 1200 },
  'dighi': { lat: 18.6227, lng: 73.8739, radius: 1200 },
  'chakan': { lat: 18.7623, lng: 73.8625, radius: 1200 },
  
  // Student / PG-Heavy Areas
  'fc road': { lat: 18.5150, lng: 73.8422, radius: 1200 },
  'jm road': { lat: 18.5191, lng: 73.8451, radius: 1200 },
  'bund garden': { lat: 18.5406, lng: 73.8834, radius: 1200 },
};

// Empty initial array - will be populated from backend
let mockProperties = [];

const PUNE_BOUNDS = [
  [18.3500, 73.6000], 
  [18.7500, 74.1000]  
];

// --- PUNE METRO LINES (Real Routes with Stations) ---

// Purple Line: Real GeoJSON track coordinates (North → South)
const purpleLinePath = [
  [18.629389233660532, 73.80323966975484],
  [18.624860859578362, 73.80703215581576],
  [18.624083890846137, 73.80751514769457],
  [18.614520672363568, 73.81576429550176],
  [18.607130704599257, 73.82199296609878],
  [18.604093691351338, 73.82455741992399],
  [18.60273649211608, 73.82561095614142],
  [18.599577601291372, 73.82729915835],
  [18.59561328610343, 73.82910070247078],
  [18.588835144195826, 73.832137610898],
  [18.587631692015165, 73.83264419623839],
  [18.586355205806356, 73.8330527496783],
  [18.58200653283346, 73.83419757975585],
  [18.577355454362504, 73.83532352825992],
  [18.575680355621785, 73.83584926882364],
  [18.57187434929125, 73.83723373483579],
  [18.567911582778123, 73.83875988637462],
  [18.56608246945474, 73.83954246405915],
  [18.563572685816396, 73.84116302729888],
  [18.560896586029088, 73.84305849788541],
  [18.560198080504406, 73.84334576175726],
  [18.559442809369074, 73.84395825742968],
  [18.558525111251825, 73.84449374099327],
  [18.55749645113515, 73.84443526276615],
  [18.556364104310447, 73.844248409872],
  [18.55453311002293, 73.84476849931175],
  [18.552005617840578, 73.84539368447807],
  [18.549255940750527, 73.84602778900683],
  [18.546743257019244, 73.84680267675986],
  [18.545136252942797, 73.84737547934009],
  [18.54395500437259, 73.8474649755623],
  [18.540984297781577, 73.84771499074012],
  [18.5388583796381, 73.84782128417052],
  [18.53619283855997, 73.84856317366791],
  [18.53217765594441, 73.84970716184151],
  [18.530961780761388, 73.84998516330072],
  [18.529654145509724, 73.85023270969506],
  [18.52881476381188, 73.85077616975101],
  [18.52832199815124, 73.85152875356172],
  [18.528067751913213, 73.85228397993461],
  [18.527332264446983, 73.85495757004864],
  [18.52670559310532, 73.85725210920776],
  [18.526086941834095, 73.85932982025463],
  [18.525397904811143, 73.86030162030832],
  [18.524488015585547, 73.86063326171316],
  [18.523313942587563, 73.86068199193284],
  [18.52207753647035, 73.86008648379806],
  [18.51974611609809, 73.85868907722389],
  [18.517467893236883, 73.85717383047304],
  [18.516294778534558, 73.85667033093787],
  [18.515541632110384, 73.85654083945604],
  [18.513151269579396, 73.85696402586186],
  [18.510930864463262, 73.85737106313078],
  [18.50983512472105, 73.85758263421806],
  [18.508375127910853, 73.85806710900903],
  [18.506473426602938, 73.85808976351697],
  [18.504355051267524, 73.85815663652221],
  [18.502807636331923, 73.8581483847124],
  [18.502125898701223, 73.85806865343457],
  [18.501727448168822, 73.85791724681502],
  [18.50081691191602, 73.8577172875932],
  [18.499183905033433, 73.85733547907108]
];

// Aqua Line: Real GeoJSON track coordinates (West → East)
const aquaLinePath = [
  [18.559361229590593, 73.91372302597719],
  [18.558564502736544, 73.91112917280032],
  [18.55711375864294, 73.9085249505635],
  [18.555459386295126, 73.90651137666981],
  [18.55495034542288, 73.90610866189112],
  [18.55286326197863, 73.90608181423903],
  [18.55067434217203, 73.90570594711241],
  [18.54853630038562, 73.9058670330237],
  [18.545329187512664, 73.90605496658699],
  [18.54296353600475, 73.90504713458651],
  [18.54336463271622, 73.90021319965558],
  [18.544484629381685, 73.89710052560773],
  [18.54510678215395, 73.89220403309864],
  [18.546175391052785, 73.89055069636245],
  [18.546263605543444, 73.8897992030544],
  [18.546043349518087, 73.88923518403593],
  [18.545031544867015, 73.88531315639676],
  [18.544666549278872, 73.88447478669718],
  [18.543854435303317, 73.8841132046189],
  [18.54285669756058, 73.88421417470943],
  [18.542267126441516, 73.88430066387977],
  [18.540391224186507, 73.88332970082737],
  [18.537287157137754, 73.88122769487072],
  [18.533799891131224, 73.87895754729666],
  [18.532226203371764, 73.87707939146136],
  [18.529858266402428, 73.87450137635207],
  [18.529691785297402, 73.87092312956639],
  [18.5298243923704, 73.86939605545868],
  [18.53013802959694, 73.86831840768644],
  [18.530075146545258, 73.86553075752877],
  [18.530054202856462, 73.86410472064611],
  [18.529803552195673, 73.86282669445049],
  [18.52961637659726, 73.86205264302893],
  [18.52961637659726, 73.86071933297904],
  [18.529512689434142, 73.85998622235743],
  [18.528976933989725, 73.85929968509538],
  [18.528609351288395, 73.85905669665803],
  [18.527106339373105, 73.85798144289399],
  [18.523714503759763, 73.85521084023222],
  [18.523226542301103, 73.85462302138839],
  [18.521995859508223, 73.85154699918942],
  [18.521681202091784, 73.85061377722795],
  [18.521279418141134, 73.84880486426701],
  [18.52039750078768, 73.8476779430091],
  [18.518762256757597, 73.8461160384951],
  [18.515048610120786, 73.84339464514872],
  [18.51426749335465, 73.84285413315368],
  [18.51392650066252, 73.84240326641347],
  [18.509978744454727, 73.83376202969194],
  [18.507090322557644, 73.82833472503063],
  [18.506386477975013, 73.82618895179198],
  [18.506116146155705, 73.82570548013786],
  [18.50610493451066, 73.8251568162431],
  [18.506352696384567, 73.82460165051586],
  [18.50691298153457, 73.823867455852],
  [18.508495225888026, 73.82241887832927],
  [18.509704843633173, 73.82140271809021],
  [18.51012663464502, 73.82083091180533],
  [18.510427067726027, 73.82011439253432],
  [18.510473588419316, 73.81942544544262],
  [18.51040383755671, 73.81856782254476],
  [18.51027642992719, 73.81743847133527],
  [18.51001018601019, 73.81623973262631],
  [18.509573932324543, 73.81418834578008],
  [18.50944558317262, 73.81250171924466],
  [18.509399062199932, 73.8120152507799],
  [18.509213780624748, 73.81148128584942],
  [18.508778817925318, 73.81093676363352],
  [18.508462815248024, 73.81049361419554],
  [18.508283925357617, 73.81003107305378],
  [18.508172733667948, 73.8092232267957],
  [18.508006824764166, 73.80870944484312],
  [18.50770981228183, 73.80824896654161],
  [18.507464246295157, 73.80770808991733],
  [18.50739449420699, 73.80707079579813],
  [18.507128779585727, 73.80423596126178],
  [18.506943742962946, 73.80270334123458],
  [18.507104129651097, 73.80232931175351]
];

// Create custom marker icon SVG for Google Maps
const createMarkerIcon = (prop, isDarkMode) => {
  const bgColor = isDarkMode ? '#121212' : '#ffffff';
  const textColor = isDarkMode ? '#ffffff' : '#111111';
  const borderColor = isDarkMode ? '#333333' : '#e5e7eb';
  const label = `${prop.config} | ${prop.price}${prop.flag ? ` ${prop.flag}` : ''}`;
  const charWidth = 7.1;
  const minWidth = 94;
  const maxWidth = 168;
  const width = Math.min(maxWidth, Math.max(minWidth, Math.round(label.length * charWidth + 28)));
  const height = 40;
  const radius = Math.round((height - 6) / 2);

  const svgString = encodeURIComponent(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.18" flood-color="#000000"/>
        </filter>
      </defs>
      <rect x="3" y="3" width="${width - 6}" height="${height - 6}" rx="${radius}" ry="${radius}" fill="${bgColor}" stroke="${borderColor}" stroke-width="1" filter="url(#shadow)"/>
      <text x="${Math.round(width / 2)}" y="${Math.round(height / 2) + 1}" text-anchor="middle" dominant-baseline="middle" font-family="'Space Grotesk', sans-serif" font-size="13" font-weight="700" fill="${textColor}">${label}</text>
    </svg>
  `);

  return {
    url: `data:image/svg+xml;charset=utf-8,${svgString}`,
    width,
    height
  };
};

// Create cluster marker icon background (text is rendered by clusterer)
const createClusterIcon = (size, isDarkMode = false) => {
  const bgColor = isDarkMode ? '#000000' : '#ffffff';
  const borderColor = isDarkMode ? 'rgba(100, 116, 139, 0.4)' : 'rgba(15, 23, 42, 0.15)';

  const svgString = encodeURIComponent(`
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.2" flood-color="#000000"/>
        </filter>
      </defs>
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 3}" fill="${bgColor}" stroke="${borderColor}" stroke-width="1" filter="url(#shadow)"/>
    </svg>
  `);

  return {
    url: `data:image/svg+xml;charset=utf-8,${svgString}`,
    size
  };
};

const buildClusterStyles = (isDarkMode = false) => {
  const sizes = [44, 54, 64];
  return sizes.map((size) => {
    const icon = createClusterIcon(size, isDarkMode);
    const textSize = size >= 64 ? 16 : size >= 54 ? 15 : 14;
    return {
      url: icon.url,
      height: icon.size,
      width: icon.size,
      textColor: isDarkMode ? '#f1f5f9' : '#111111',
      textSize,
      textLineHeight: icon.size,
      fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: '700'
    };
  });
};

// Geocode building name + area using Google Geocoding API
const geocodeBuilding = async (buildingName, areaName) => {
  if (!buildingName.trim() || !areaName.trim()) {
    return null;
  }
  
  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!googleApiKey) {
    console.warn('Google Maps API key not configured');
    return null;
  }
  
  try {
    // Construct search query: "Building Name, Area, Pune, India"
    const query = `${buildingName}, ${areaName}, Pune, India`;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${googleApiKey}`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();

    // Check if Google returned valid results
    if (data.status === 'OK' && data.results.length > 0) {
      const top = data.results[0];

      // Reject partial matches — Google falls back to the surrounding area
      // when it can't find the exact building, which is exactly the
      // junk-society case we want to block.
      if (top.partial_match) {
        return null;
      }

      // Reject results that resolved only to area-level types (locality /
      // sublocality / political) with no building-level type, since those
      // are the neighborhood pin, not a specific society.
      const types = top.types || [];
      const buildingTypes = ['premise', 'subpremise', 'establishment', 'point_of_interest', 'street_address'];
      const areaOnlyTypes = ['locality', 'sublocality', 'sublocality_level_1', 'sublocality_level_2', 'sublocality_level_3', 'political', 'administrative_area_level_1', 'administrative_area_level_2', 'administrative_area_level_3', 'country', 'route'];
      const hasBuildingType = types.some((t) => buildingTypes.includes(t));
      const isAreaOnly = types.length > 0 && types.every((t) => areaOnlyTypes.includes(t));
      if (!hasBuildingType && isAreaOnly) {
        return null;
      }

      const { lat, lng } = top.geometry.location;
      return [lat, lng];
    }

    // Return null if no results or API returned an error
    if (data.status !== 'OK') {
      console.warn(`Geocoding API returned status: ${data.status}`);
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

// test changes



export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showMetro, setShowMetro] = useState(true);
  const [mapStyle, setMapStyle] = useState('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);
  const [metroStationsSource, setMetroStationsSource] = useState(null);
  const [resolvedMetroStations, setResolvedMetroStations] = useState(null);
  const [hoveredStation, setHoveredStation] = useState(null);

  // Format currency to Cr/Lakh format
  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} L`;
    }
    return `₹${amount.toLocaleString()}`;
  };
  const [error, setError] = useState(null);
  
  // Modal and form state for adding new property
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [formData, setFormData] = useState({
    price: '',
    config: '1 BHK',
    area: '',
    society_name: '',
    owner_name: '',
    owner_phone: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for viewing property details
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  
  // State for auto-geocoding
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingStatus, setGeocodingStatus] = useState('');
  const [isSocietyFound, setIsSocietyFound] = useState(false);

  const ownerName = selectedProperty?.owner_name?.toString().trim();
  const ownerPhone = selectedProperty?.owner_phone?.toString().trim();
  const hasOwnerDetails = Boolean(ownerName || ownerPhone);

  // Fetch properties from backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/properties`);
        if (!response.ok) throw new Error('Failed to fetch properties');
        const data = await response.json();
        setProperties(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError(err.message);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadStationData = async () => {
      try {
        const response = await fetch('/StationNodes.json', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`StationNodes.json fetch failed: ${response.status}`);
        }
        const data = await response.json();
        if (isActive) {
          setMetroStationsSource(data);
        }
      } catch (error) {
        console.error('Failed to load StationNodes.json', error);
        if (isActive) {
          setMetroStationsSource(null);
        }
      }
    };

    loadStationData();

    return () => {
      isActive = false;
    };
  }, []);

  // Auto-geocode when both area and society_name are provided
  useEffect(() => {
    // Reset found-state whenever inputs change; only confirm after a successful lookup
    setIsSocietyFound(false);

    const performGeocoding = async () => {
      if (formData.area && formData.society_name && showAddModal) {
        setIsGeocoding(true);
        setGeocodingStatus('Looking up location...');

        const coords = await geocodeBuilding(formData.society_name, formData.area);

        if (coords) {
          setSelectedCoords(coords);
          setIsSocietyFound(true);
          setGeocodingStatus('✓ Location found and pin placed');
        } else {
          setIsSocietyFound(false);
          setGeocodingStatus('Could not find this society. Please check the name — adding is disabled until a real location is found.');
        }

        setIsGeocoding(false);
      }
    };

    // Debounce the geocoding call
    const timer = setTimeout(performGeocoding, 800);
    return () => clearTimeout(timer);
  }, [formData.area, formData.society_name, showAddModal]);

  const dismissWelcome = () => {
    setShowWelcome(false);
  };

  const handleWelcomeAddRent = () => {
    setSelectedCoords([18.5280, 73.8560]);
    setShowAddModal(true);
    dismissWelcome();
  };

  const handleWelcomeShare = () => {
    const shareText = encodeURIComponent('Check out Pune rents on this community map.');
    const shareUrl = encodeURIComponent(window.location.href);
    window.open(`https://wa.me/?text=${shareText}%20${shareUrl}`, '_blank', 'noopener,noreferrer');
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit new property to backend
  const handleSubmitProperty = async () => {
    if (!formData.price || !formData.area || !formData.society_name) {
      alert('Please fill in Price, Area, and Society Name');
      return;
    }

    if (!isSocietyFound || !selectedCoords) {
      alert('We could not locate this society. Please check the society name and area before adding.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_BASE_URL}/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: selectedCoords[0],
          lng: selectedCoords[1],
          price: formData.price,
          config: formData.config,
          area: formData.area,
          society_name: formData.society_name,
          owner_name: formData.owner_name,
          owner_phone: formData.owner_phone,
          description: formData.description
        })
      });

      if (!response.ok) throw new Error('Failed to add property');
      
      // Refresh properties list
      const allProperties = await fetch(`${API_BASE_URL}/properties`);
      const data = await allProperties.json();
      setProperties(data);
      
      // Reset form and close modal
      setShowAddModal(false);
      setFormData({
        price: '',
        config: '1 BHK',
        area: '',
        society_name: '',
        owner_name: '',
        owner_phone: '',
        description: ''
      });
      setSelectedCoords(null);
      setIsSocietyFound(false);
      setGeocodingStatus('');
    } catch (err) {
      console.error('Error adding property:', err);
      alert('Failed to add property');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get unique areas for autocomplete
  const uniqueAreas = useMemo(
    () => [...new Set(properties.map(p => p.area))],
    [properties]
  );
  const filteredAreas = useMemo(
    () => (searchQuery
      ? uniqueAreas.filter(area => area.toLowerCase().includes(searchQuery.toLowerCase()))
      : []
    ),
    [searchQuery, uniqueAreas]
  );

  const normalizedSearchQuery = searchQuery.trim();

  const filteredProperties = useMemo(() => (
    properties.filter(prop => {
      const matchesFilter = activeFilter === 'All' ? true : prop.config.includes(activeFilter);
      const matchesSearch = normalizedSearchQuery === '' ? true : prop.area.toLowerCase().includes(normalizedSearchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    })
  ), [properties, activeFilter, normalizedSearchQuery]);

  // Calculate stats
  const totalPins = filteredProperties.length;
  const totalAnnualRent = filteredProperties.reduce((sum, prop) => {
    const monthlyRent = parseInt(prop.price) || 0;
    return sum + (monthlyRent * 12);
  }, 0);

  // Calculate bounds for the searched area to highlight it
  const getAreaBounds = () => {
    if (!normalizedSearchQuery) return null;
    
    // First, try to find the area in AREA_COORDINATES (predefined mapping)
    const searchQueryLower = normalizedSearchQuery.toLowerCase();
    const foundArea = Object.entries(AREA_COORDINATES).find(([key]) => 
      key.includes(searchQueryLower) || searchQueryLower.includes(key)
    );
    
    if (foundArea) {
      const [areaName, coords] = foundArea;
      return {
        center: [coords.lat, coords.lng],
        radius: coords.radius,
        bounds: null // Using circle, not rectangle bounds
      };
    }
    
    // Fallback: Calculate bounds from properties in database
    if (filteredProperties.length === 0) return null;
    
    const propertiesInArea = properties.filter(prop => 
      prop.area.toLowerCase().includes(searchQueryLower)
    );
    
    if (propertiesInArea.length === 0) return null;
    
    const lats = propertiesInArea.map(p => p.lat);
    const lngs = propertiesInArea.map(p => p.lng);
    
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    // Calculate center point
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    
    // Calculate radius in meters using Haversine formula
    const R = 6371000; // Earth's radius in meters
    const dLat = (maxLat - minLat) * (Math.PI / 180);
    const dLng = (maxLng - minLng) * (Math.PI / 180);
    const radius = Math.sqrt((R * dLat) ** 2 + (R * dLng * Math.cos((centerLat * Math.PI / 180))) ** 2) / 2 + 500;
    
    return {
      center: [centerLat, centerLng],
      radius: radius,
      bounds: [[minLat, minLng], [maxLat, maxLng]]
    };
  };

  const areaBounds = useMemo(() => getAreaBounds(), [normalizedSearchQuery, filteredProperties, properties]);

  // Get Google Maps API key from environment
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleMapsApiKey,
    libraries: ['marker', 'places']
  });

  const maxZoomLevel = 20;
  const initialCenter = { lat: 18.5280, lng: 73.8560 };
  const initialZoom = 12;

  const darkMapStyles = [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#263c3f' }] },
    { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#6b9080' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] },
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
    { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3751b' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
    { featureType: 'transit.line', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
    { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] }
  ];

  const useDarkMapStyles = mapStyle === 'dark';
  const mapStyles = useDarkMapStyles ? darkMapStyles : null;

  const purpleLineLatLng = useMemo(
    () => purpleLinePath.map(([lat, lng]) => ({ lat, lng })),
    []
  );
  const aquaLineLatLng = useMemo(
    () => aquaLinePath.map(([lat, lng]) => ({ lat, lng })),
    []
  );

  const fallbackMetroStations = useMemo(() => {
    const buildStations = (lineKey, stations) => (stations || []).map((station, index) => ({
      id: `${lineKey}-${index}`,
      name: station.english || 'Metro Station',
      name_hi: station.hindi,
      name_mr: station.marathi,
      position: {
        lat: station.coordinates.latitude,
        lng: station.coordinates.longitude
      },
      line: lineKey
    }));

    return {
      purple: buildStations('purple', metroStationsSource?.pune_metro?.purple_line),
      aqua: buildStations('aqua', metroStationsSource?.pune_metro?.aqua_line)
    };
  }, [metroStationsSource]);

  const metroStations = resolvedMetroStations ?? fallbackMetroStations;

  const stationIcons = useMemo(() => {
    if (!isLoaded || !window.google?.maps) return null;
    const base = {
      path: window.google.maps.SymbolPath.CIRCLE,
      scale: 6.5,
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 1
    };
    return {
      purple: { ...base, fillColor: '#7e22ce' },
      aqua: { ...base, fillColor: '#0891b2' }
    };
  }, [isLoaded]);

  // Map options for Google Maps
  const mapOptions = {
    minZoom: 11,
    maxZoom: maxZoomLevel,
    mapTypeId: mapStyle === 'satellite' ? 'satellite' : mapStyle === 'topo' ? 'terrain' : 'roadmap',
    restriction: {
      latLngBounds: {
        north: 18.75,
        south: 18.35,
        east: 74.1,
        west: 73.6
      }
    },
    disableDefaultUI: true,
    zoomControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    styles: mapStyles
  };

  const mapRef = useRef(null);
  const metroLinesRef = useRef([]);
  const lastSearchQueryRef = useRef('');
  const areaCircleRef = useRef(null);

  // Handle area zoom when search query changes
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    if (normalizedSearchQuery === lastSearchQueryRef.current) return;
    lastSearchQueryRef.current = normalizedSearchQuery;
    if (!areaBounds) return;

    const bounds = new window.google.maps.LatLngBounds();

    if (areaBounds.bounds) {
      bounds.extend(new window.google.maps.LatLng(areaBounds.bounds[0][0], areaBounds.bounds[0][1]));
      bounds.extend(new window.google.maps.LatLng(areaBounds.bounds[1][0], areaBounds.bounds[1][1]));
      mapRef.current.fitBounds(bounds);
      return;
    }

    if (areaBounds.center && areaBounds.radius) {
      const lat = areaBounds.center[0];
      const lng = areaBounds.center[1];
      const radius = areaBounds.radius;

      const latOffset = (radius / 111000);
      const lngOffset = (radius / (111000 * Math.cos(lat * Math.PI / 180)));

      bounds.extend(new window.google.maps.LatLng(lat - latOffset, lng - lngOffset));
      bounds.extend(new window.google.maps.LatLng(lat + latOffset, lng + lngOffset));
      mapRef.current.fitBounds(bounds);
    }
  }, [areaBounds, isLoaded, normalizedSearchQuery]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    if (!areaBounds || !normalizedSearchQuery) {
      if (areaCircleRef.current) {
        areaCircleRef.current.setMap(null);
        areaCircleRef.current = null;
      }
      return;
    }

    const circleCenter = { lat: areaBounds.center[0], lng: areaBounds.center[1] };
    const circleOptions = {
      strokeColor: isDarkMode ? '#991b1b' : '#22c55e',
      strokeOpacity: 0.8,
      strokeWeight: 3,
      fillColor: isDarkMode ? '#991b1b' : '#22c55e',
      fillOpacity: 0.25
    };

    if (!areaCircleRef.current) {
      areaCircleRef.current = new window.google.maps.Circle({
        map: mapRef.current,
        center: circleCenter,
        radius: areaBounds.radius,
        ...circleOptions
      });
      return;
    }

    areaCircleRef.current.setOptions(circleOptions);
    areaCircleRef.current.setCenter(circleCenter);
    areaCircleRef.current.setRadius(areaBounds.radius);
    areaCircleRef.current.setMap(mapRef.current);
  }, [areaBounds, isDarkMode, isLoaded, normalizedSearchQuery]);

  useEffect(() => {
    if (!isLoaded || !isMapReady || !mapRef.current || !metroStationsSource) return;
    if (!window.google?.maps?.places) return;

    let isActive = true;
    const service = new window.google.maps.places.PlacesService(mapRef.current);

    const findStationPlace = (station) => new Promise((resolve) => {
      const coords = station.coordinates;
      const query = `${station.english} Metro Station, Pune`;
      const locationBias = coords ? new window.google.maps.Circle({
        center: { lat: coords.latitude, lng: coords.longitude },
        radius: 1500
      }) : undefined;

      service.findPlaceFromQuery(
        {
          query,
          fields: ['geometry', 'place_id', 'name'],
          locationBias
        },
        (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results?.[0]?.geometry?.location) {
            resolve(results[0]);
            return;
          }
          resolve(null);
        }
      );
    });

    const resolveLineStations = async (lineKey, stations) => {
      const resolved = [];

      for (const [index, station] of (stations || []).entries()) {
        // Small delay prevents Places API throttling.
        // eslint-disable-next-line no-await-in-loop
        const place = await findStationPlace(station);
        const location = place?.geometry?.location;
        const fallbackCoords = station.coordinates;

        resolved.push({
          id: `${lineKey}-${index}`,
          name: station.english || 'Metro Station',
          name_hi: station.hindi,
          name_mr: station.marathi,
          position: {
            lat: location ? location.lat() : fallbackCoords.latitude,
            lng: location ? location.lng() : fallbackCoords.longitude
          },
          line: lineKey,
          placeId: place?.place_id
        });

        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, 140));
      }

      return resolved;
    };

    const resolveStations = async () => {
      const purple = await resolveLineStations('purple', metroStationsSource?.pune_metro?.purple_line);
      const aqua = await resolveLineStations('aqua', metroStationsSource?.pune_metro?.aqua_line);

      if (isActive) {
        setResolvedMetroStations({ purple, aqua });
      }
    };

    resolveStations();

    return () => {
      isActive = false;
    };
  }, [isLoaded, isMapReady, metroStationsSource]);

  useEffect(() => {
    if (!showMetro) {
      setHoveredStation(null);
    }
  }, [showMetro]);

  useEffect(() => {
    if (!isLoaded || !isMapReady || !mapRef.current) return;

    if (metroLinesRef.current.length === 0) {
      const buildLine = (path, options) => new window.google.maps.Polyline({
        path,
        ...options
      });

      metroLinesRef.current = [
        buildLine(purpleLineLatLng, {
          strokeColor: '#c084fc',
          strokeOpacity: 0.3,
          strokeWeight: 14,
          lineCap: 'round',
          lineJoin: 'round'
        }),
        buildLine(purpleLineLatLng, {
          strokeColor: '#7e22ce',
          strokeOpacity: 1.0,
          strokeWeight: 5,
          lineCap: 'round',
          lineJoin: 'round'
        }),
        buildLine(aquaLineLatLng, {
          strokeColor: '#22d3ee',
          strokeOpacity: 0.3,
          strokeWeight: 14,
          lineCap: 'round',
          lineJoin: 'round'
        }),
        buildLine(aquaLineLatLng, {
          strokeColor: '#0891b2',
          strokeOpacity: 1.0,
          strokeWeight: 5,
          lineCap: 'round',
          lineJoin: 'round'
        })
      ];
    }

    metroLinesRef.current.forEach((line) => {
      line.setVisible(showMetro);
      line.setMap(showMetro ? mapRef.current : null);
    });
  }, [aquaLineLatLng, isLoaded, isMapReady, purpleLineLatLng, showMetro]);

  useEffect(() => {
    return () => {
      metroLinesRef.current.forEach((line) => line.setMap(null));
      metroLinesRef.current = [];
    };
  }, []);

  // Handle map click to add property
  const handleMapClick = (e) => {
    const coords = [e.latLng.lat(), e.latLng.lng()];
    setSelectedCoords(coords);
    setShowAddModal(true);
  };

  const handleClusterClick = useCallback((cluster) => {
    if (!mapRef.current) return;
    const center = cluster?.getCenter?.();
    if (!center) return;
    const currentZoom = mapRef.current.getZoom() ?? initialZoom;
    mapRef.current.setCenter(center);
    mapRef.current.setZoom(Math.min(currentZoom + 2, maxZoomLevel));
  }, [initialZoom, maxZoomLevel]);

  const handleMapStyleChange = (nextStyle) => {
    setMapStyle(nextStyle);
    if (nextStyle === 'dark' && !isDarkMode) {
      setIsDarkMode(true);
    }
    if (nextStyle === 'light' && isDarkMode) {
      setIsDarkMode(false);
    }
  };

  const handleThemeToggle = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next && mapStyle === 'light') {
        setMapStyle('dark');
      }
      if (!next && mapStyle === 'dark') {
        setMapStyle('light');
      }
      return next;
    });
  };

  return (
    <div
      className="app-shell"
      style={{
        '--panel-bg': isDarkMode ? '#1a1a1a' : '#ffffff',
        '--panel-text': isDarkMode ? '#ffffff' : '#111111',
        '--panel-border': isDarkMode ? '#333' : '#e5e5e5',
        '--panel-shadow': isDarkMode ? '0 6px 20px rgba(0,0,0,0.8)' : '0 6px 16px rgba(0,0,0,0.15)',
        '--panel-shadow-soft': isDarkMode ? '0 4px 12px rgba(0,0,0,0.8)' : '0 4px 12px rgba(0,0,0,0.1)',
        '--panel-bg-subtle': isDarkMode ? '#222' : '#f9f9f9',
        '--panel-hover-bg': isDarkMode ? '#333' : '#f0f0f0',
        '--panel-muted-text': isDarkMode ? '#ccc' : '#666666',
        '--divider-color': isDarkMode ? '#333' : '#e5e5e5'
      }}
    >
      <div className="top-controls">
        {/* FLOATING HEADER */}
        <div className="floating-header">
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px' }}>
          punerent.in
        </h1>

        <div className="header-divider" />

        {/* Filters */}
        <div className="filter-row">
          {['All', '1 BHK', '2 BHK', '3 BHK'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className="pill-button filter-button"
              style={{
                background: activeFilter === filter ? (isDarkMode ? '#ffffff' : '#111111') : 'transparent',
                color: activeFilter === filter ? (isDarkMode ? '#000000' : '#ffffff') : (isDarkMode ? '#a3a3a3' : '#666666'),
                border: `1px solid ${activeFilter === filter ? 'transparent' : (isDarkMode ? '#444' : '#e5e5e5')}`
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="header-divider" />

        {/* Metro Toggle */}
        <button
          onClick={() => setShowMetro((prev) => !prev)}
          className="pill-button toggle-button"
          style={{
            background: showMetro ? '#e0e7ff' : 'transparent',
            color: showMetro ? '#3730a3' : (isDarkMode ? '#a3a3a3' : '#666666'),
            border: `1px solid ${showMetro ? '#c7d2fe' : (isDarkMode ? '#444' : '#e5e5e5')}`
          }}
        >
          🚇 Metro
        </button>

        <div className="header-divider" />

        {/* Map Style Selector */}
        <select
          value={mapStyle}
          onChange={(e) => handleMapStyleChange(e.target.value)}
          className="map-style-select"
          style={{
            background: isDarkMode ? '#222' : '#f5f5f5',
            color: isDarkMode ? '#ffffff' : '#111111',
            border: `1px solid ${isDarkMode ? '#444' : '#e5e5e5'}`
          }}
        >
          <option value="light">☀️ Light</option>
          <option value="dark">🌑 Dark</option>
          <option value="topo">🏔️ Topo</option>
          <option value="satellite">🛰️ Satellite</option>
        </select>

        <div className="header-divider" />

        {/* Theme Toggle */}
        <button 
          onClick={handleThemeToggle}
          className="theme-toggle"
          style={{
            background: isDarkMode ? '#333' : '#f5f5f5',
            border: 'none',
            fontSize: '16px'
          }}
          title="Toggle Theme"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>

      {/* SEARCH BOX */}
      <div className="search-wrap">
        <div className="search-panel">
          <input
            type="text"
            placeholder="🔍 Search areas... (e.g., Koregaon Park, Pimpri)"
            value={searchQuery}
            onChange={(e) => {
              const nextValue = e.target.value;
              setSearchQuery(nextValue.trim() === '' ? '' : nextValue);
            }}
            className="search-input"
          />
          
          {/* Autocomplete Dropdown */}
          {searchQuery && filteredAreas.length > 0 && (
            <div className="search-dropdown">
              {filteredAreas.map((area, idx) => (
                <div
                  key={idx}
                  onClick={() => setSearchQuery(area)}
                  className="search-item"
                >
                  📍 {area}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* STATS DISPLAY */}
      {filteredProperties.length > 0 && (
        <div className="stats-pill">
          📍 {totalPins} {totalPins === 1 ? 'pin' : 'pins'} · {formatCurrency(totalAnnualRent)} in rent / yr
        </div>
      )}
      </div>

      {showWelcome && (
        <div className="welcome-overlay" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
          <div className="welcome-modal">
            <button className="welcome-close" onClick={dismissWelcome} aria-label="Close welcome message">
              ✕
            </button>
            <div className="welcome-eyebrow">Pune rent signal</div>
            <h2 className="welcome-title" id="welcome-title">
              Find a fair rent before you sign.
            </h2>
            <p className="welcome-body">
              This map is powered by local submissions, not listing hype. Explore the pins to see real rent patterns, and
              add your rent if you want to strengthen the signal.
            </p>
            <div className="welcome-badges">
              <div className="welcome-badge">🧭 Tap a pin to see rent, area, and configuration.</div>
              <div className="welcome-badge">🕶️ Anonymous by default. No login needed.</div>
            </div>
            <div className="welcome-actions">
              <button className="welcome-primary" onClick={handleWelcomeAddRent}>
                Add your rent
              </button>
              <button className="welcome-share" onClick={handleWelcomeShare}>
                Send on WhatsApp
              </button>
              <button className="welcome-secondary" onClick={dismissWelcome}>
                Continue to map
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAP COMPONENT */}
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{ height: '100%', width: '100%' }}
          options={mapOptions}
          onLoad={(map) => {
            mapRef.current = map;
            map.setCenter(initialCenter);
            map.setZoom(initialZoom);
            setIsMapReady(true);
          }}
          onClick={handleMapClick}
        >
          {/* METRO LINES OVERLAY (native polylines controlled in useEffect) */}

          {/* METRO STATION MARKERS */}
          {showMetro && stationIcons && (
            <>
              {metroStations.purple.map((station) => (
                <Marker
                  key={station.id}
                  position={station.position}
                  icon={stationIcons.purple}
                  zIndex={1200}
                  onMouseOver={() => setHoveredStation(station)}
                  onMouseOut={() => setHoveredStation(null)}
                />
              ))}
              {metroStations.aqua.map((station) => (
                <Marker
                  key={station.id}
                  position={station.position}
                  icon={stationIcons.aqua}
                  zIndex={1200}
                  onMouseOver={() => setHoveredStation(station)}
                  onMouseOut={() => setHoveredStation(null)}
                />
              ))}
            </>
          )}

          {showMetro && hoveredStation && (
            <InfoWindow
              position={hoveredStation.position}
              onCloseClick={() => setHoveredStation(null)}
            >
              <div className="metro-station-tooltip">
                <div className="metro-station-tooltip-title">{hoveredStation.name}</div>
                {hoveredStation.name_hi && <div>{hoveredStation.name_hi}</div>}
                {hoveredStation.name_mr && <div>{hoveredStation.name_mr}</div>}
              </div>
            </InfoWindow>
          )}
          {/* PROPERTY MARKERS WITH CLUSTERING */}
          <MarkerClusterer
            styles={buildClusterStyles(isDarkMode)}
            gridSize={60}
            minimumClusterSize={2}
            zoomOnClick={false}
            onClick={handleClusterClick}
          >
            {(clusterer) =>
              filteredProperties.map((prop) => {
                const icon = createMarkerIcon(prop, isDarkMode);
                return (
                  <Marker
                    key={`${prop.id}-${isDarkMode}`}
                    position={{ lat: prop.lat, lng: prop.lng }}
                    icon={{
                      url: icon.url,
                      scaledSize: new window.google.maps.Size(icon.width, icon.height),
                      anchor: new window.google.maps.Point(icon.width / 2, icon.height / 2)
                    }}
                    clusterer={clusterer}
                    onClick={() => {
                      setSelectedProperty(prop);
                      setShowDetailsModal(true);
                    }}
                  />
                );
              })
            }
          </MarkerClusterer>
        </GoogleMap>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: isDarkMode ? '#fff' : '#000'
        }}>
          Loading map...
        </div>
      )}

      {/* FLOATING INFO - Click to Add Property */}
      <div className="floating-actions">
        <button
          onClick={() => {
            // Show a center-of-map add form
            const map = document.querySelector('.leaflet-container');
            if (map) {
              setSelectedCoords([18.5280, 73.8560]); // Center coords
              setShowAddModal(true);
            }
          }}
          title="Add property at center"
          className="fab-button"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
          }}
        >
          ➕
        </button>
        <div className="fab-hint">
          💡 Click anywhere on the map to add a flat listing
        </div>
      </div>

      <a
        className="made-by-pill"
        href="https://www.linkedin.com/in/tejas-redkar21"
        target="_blank"
        rel="noreferrer"
      >
        Built by Tejas Redkar
      </a>

      {/* PROPERTY DETAILS MODAL */}
      {showDetailsModal && selectedProperty && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: isDarkMode ? '0 10px 40px rgba(0,0,0,0.8)' : '0 10px 40px rgba(0,0,0,0.2)',
            border: `1px solid ${isDarkMode ? '#333' : '#e5e5e5'}`,
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '700',
                color: isDarkMode ? '#ffffff' : '#111111'
              }}>
                Property Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: isDarkMode ? '#999' : '#666'
                }}
              >
                ✕
              </button>
            </div>

            {/* Property Information */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Price */}
              <div style={{
                padding: '12px',
                backgroundColor: isDarkMode ? '#222' : '#f5f5f5',
                borderRadius: '8px',
                borderLeft: `4px solid #3b82f6`
              }}>
                <div style={{
                  fontSize: '12px',
                  color: isDarkMode ? '#aaa' : '#666',
                  marginBottom: '4px'
                }}>💰 Monthly Rent</div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: isDarkMode ? '#fff' : '#111'
                }}>{selectedProperty.price}</div>
              </div>

              {/* Configuration */}
              <div style={{
                padding: '12px',
                backgroundColor: isDarkMode ? '#222' : '#f5f5f5',
                borderRadius: '8px',
                borderLeft: `4px solid #8b5cf6`
              }}>
                <div style={{
                  fontSize: '12px',
                  color: isDarkMode ? '#aaa' : '#666',
                  marginBottom: '4px'
                }}>🏠 Configuration</div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: isDarkMode ? '#fff' : '#111'
                }}>{selectedProperty.config}</div>
              </div>

              {/* Area */}
              <div style={{
                padding: '12px',
                backgroundColor: isDarkMode ? '#222' : '#f5f5f5',
                borderRadius: '8px',
                borderLeft: `4px solid #06b6d4`
              }}>
                <div style={{
                  fontSize: '12px',
                  color: isDarkMode ? '#aaa' : '#666',
                  marginBottom: '4px'
                }}>📍 Area</div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: isDarkMode ? '#fff' : '#111'
                }}>{selectedProperty.area}</div>
              </div>

              {/* Society */}
              <div style={{
                padding: '12px',
                backgroundColor: isDarkMode ? '#222' : '#f5f5f5',
                borderRadius: '8px',
                borderLeft: `4px solid #14b8a6`
              }}>
                <div style={{
                  fontSize: '12px',
                  color: isDarkMode ? '#aaa' : '#666',
                  marginBottom: '4px'
                }}>🏢 Society</div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: isDarkMode ? '#fff' : '#111'
                }}>{selectedProperty.society_name || 'Not provided'}</div>
              </div>

              {/* Owner Details */}
              {hasOwnerDetails && (
                <div style={{
                  padding: '12px',
                  backgroundColor: isDarkMode ? '#222' : '#f5f5f5',
                  borderRadius: '8px',
                  borderLeft: `4px solid #10b981`
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: isDarkMode ? '#aaa' : '#666',
                    marginBottom: '8px'
                  }}>👤 Owner Details</div>
                  {ownerName && (
                    <div style={{
                      fontSize: '14px',
                      color: isDarkMode ? '#ddd' : '#333',
                      marginBottom: '4px'
                    }}>Name: <span style={{ fontWeight: '600' }}>{ownerName}</span></div>
                  )}
                  {ownerPhone && (
                    <div style={{
                      fontSize: '14px',
                      color: isDarkMode ? '#ddd' : '#333'
                    }}>Phone: <span style={{ fontWeight: '600' }}>{ownerPhone}</span></div>
                  )}
                </div>
              )}

              {/* Description */}
              {selectedProperty.description && (
                <div style={{
                  padding: '12px',
                  backgroundColor: isDarkMode ? '#222' : '#f5f5f5',
                  borderRadius: '8px',
                  borderLeft: `4px solid #f59e0b`
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: isDarkMode ? '#aaa' : '#666',
                    marginBottom: '8px'
                  }}>📝 Description</div>
                  <div style={{
                    fontSize: '14px',
                    color: isDarkMode ? '#ddd' : '#333',
                    lineHeight: '1.5'
                  }}>{selectedProperty.description}</div>
                </div>
              )}

              {/* Posted Date */}
              {selectedProperty.created_at && (
                <div style={{
                  fontSize: '12px',
                  color: isDarkMode ? '#888' : '#999',
                  textAlign: 'center',
                  paddingTop: '8px',
                  borderTop: `1px solid ${isDarkMode ? '#333' : '#ddd'}`
                }}>
                  Posted on {new Date(selectedProperty.created_at).toLocaleDateString()}
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowDetailsModal(false)}
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '12px',
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ADD PROPERTY MODAL */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: isDarkMode ? '0 10px 40px rgba(0,0,0,0.8)' : '0 10px 40px rgba(0,0,0,0.2)',
            border: `1px solid ${isDarkMode ? '#333' : '#e5e5e5'}`,
            maxHeight: '85vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '700',
                color: isDarkMode ? '#ffffff' : '#111111'
              }}>
                Add New Property
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: isDarkMode ? '#999' : '#666'
                }}
              >
                ✕
              </button>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '6px',
                  color: isDarkMode ? '#ccc' : '#333'
                }}>
                  Rent Price *
                </label>
                <input
                  type="text"
                  name="price"
                  placeholder="e.g., 25K"
                  value={formData.price}
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${isDarkMode ? '#444' : '#ddd'}`,
                    borderRadius: '8px',
                    backgroundColor: isDarkMode ? '#222' : '#f9f9f9',
                    color: isDarkMode ? '#ffffff' : '#111111',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div className="form-grid">
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    marginBottom: '6px',
                    color: isDarkMode ? '#ccc' : '#333'
                  }}>
                    BHK
                  </label>
                  <select
                    name="config"
                    value={formData.config}
                    onChange={handleFormChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `1px solid ${isDarkMode ? '#444' : '#ddd'}`,
                      borderRadius: '8px',
                      backgroundColor: isDarkMode ? '#222' : '#f9f9f9',
                      color: isDarkMode ? '#ffffff' : '#111111',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option>1 BHK</option>
                    <option>2 BHK</option>
                    <option>3 BHK</option>
                    <option>4 BHK</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    marginBottom: '6px',
                    color: isDarkMode ? '#ccc' : '#333'
                  }}>
                    Area *
                  </label>
                  <input
                    type="text"
                    name="area"
                    placeholder="e.g., Koregaon Park"
                    value={formData.area}
                    onChange={handleFormChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `1px solid ${isDarkMode ? '#444' : '#ddd'}`,
                      borderRadius: '8px',
                      backgroundColor: isDarkMode ? '#222' : '#f9f9f9',
                      color: isDarkMode ? '#ffffff' : '#111111',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '6px',
                  color: isDarkMode ? '#ccc' : '#333'
                }}>
                  Society Name *
                </label>
                <input
                  type="text"
                  name="society_name"
                  placeholder="e.g., Blue Ridge"
                  value={formData.society_name}
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${isDarkMode ? '#444' : '#ddd'}`,
                    borderRadius: '8px',
                    backgroundColor: isDarkMode ? '#222' : '#f9f9f9',
                    color: isDarkMode ? '#ffffff' : '#111111',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
                
                {/* Geocoding Status */}
                {geocodingStatus && (
                  <div style={{
                    marginTop: '8px',
                    padding: '8px 12px',
                    backgroundColor: geocodingStatus.startsWith('✓') ? '#d1fae5' : '#fef3c7',
                    color: geocodingStatus.startsWith('✓') ? '#065f46' : '#92400e',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {geocodingStatus}
                  </div>
                )}
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '6px',
                  color: isDarkMode ? '#ccc' : '#333'
                }}>
                  Owner Name
                </label>
                <input
                  type="text"
                  name="owner_name"
                  placeholder="Your name"
                  value={formData.owner_name}
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${isDarkMode ? '#444' : '#ddd'}`,
                    borderRadius: '8px',
                    backgroundColor: isDarkMode ? '#222' : '#f9f9f9',
                    color: isDarkMode ? '#ffffff' : '#111111',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '6px',
                  color: isDarkMode ? '#ccc' : '#333'
                }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="owner_phone"
                  placeholder="9876543210"
                  value={formData.owner_phone}
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${isDarkMode ? '#444' : '#ddd'}`,
                    borderRadius: '8px',
                    backgroundColor: isDarkMode ? '#222' : '#f9f9f9',
                    color: isDarkMode ? '#ffffff' : '#111111',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '6px',
                  color: isDarkMode ? '#ccc' : '#333'
                }}>
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Any additional details..."
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${isDarkMode ? '#444' : '#ddd'}`,
                    borderRadius: '8px',
                    backgroundColor: isDarkMode ? '#222' : '#f9f9f9',
                    color: isDarkMode ? '#ffffff' : '#111111',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="form-actions">
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: '12px 16px',
                    border: `1px solid ${isDarkMode ? '#444' : '#ddd'}`,
                    borderRadius: '8px',
                    backgroundColor: isDarkMode ? '#222' : '#f5f5f5',
                    color: isDarkMode ? '#ccc' : '#666',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitProperty}
                  disabled={isSubmitting || isGeocoding || !isSocietyFound}
                  title={
                    !formData.area || !formData.society_name
                      ? 'Enter Area and Society Name first'
                      : isGeocoding
                        ? 'Looking up society location...'
                        : !isSocietyFound
                          ? 'Society not found — adding is disabled to prevent spam pins'
                          : ''
                  }
                  style={{
                    padding: '12px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: (isSubmitting || isGeocoding || !isSocietyFound) ? '#999' : '#3b82f6',
                    color: '#ffffff',
                    cursor: (isSubmitting || isGeocoding || !isSocietyFound) ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                    opacity: (isSubmitting || isGeocoding || !isSocietyFound) ? 0.7 : 1
                  }}
                >
                  {isSubmitting
                    ? 'Adding...'
                    : isGeocoding
                      ? 'Verifying location...'
                      : '+ Add Property'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}