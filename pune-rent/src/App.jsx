import * as React from 'react';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, Circle, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

// Individual Property Marker
const createCustomIcon = (prop, isDarkMode) => {
  const themeClass = isDarkMode ? 'theme-dark' : 'theme-light';
  const flagHtml = prop.flag 
    ? `<span class="flag-badge">${prop.flag}</span>` 
    : '';

  return L.divIcon({
    className: '', 
    html: `
      <div class="${themeClass}">
        <div class="custom-price-tag">
          ${prop.config} <span class="price-divider">|</span> ${prop.price} ${flagHtml}
        </div>
      </div>
    `,
    iconSize: null, 
    iconAnchor: [45, 20] 
  });
};

// Custom Cluster Bubble
const createClusterCustomIcon = (cluster, isDarkMode) => {
  const count = cluster.getChildCount();
  const themeClass = isDarkMode ? 'theme-dark' : 'theme-light';
  
  let size = 45; 
  if (count > 5) size = 55;
  if (count > 20) size = 65;

  return L.divIcon({
    className: '', 
    html: `
      <div class="${themeClass}" style="width: ${size}px; height: ${size}px;">
        <div class="custom-price-tag" style="
          width: 100%; 
          height: 100%; 
          border-radius: 50%; 
          padding: 0; 
          font-size: ${size > 45 ? '16px' : '14px'};
        ">
          ${count}
        </div>
      </div>
    `,
    iconSize: L.point(size, size, true), 
    iconAnchor: [size / 2, size / 2] 
  });
};

// Component to handle zooming to searched area
function AreaZoomHandler({ areaBounds }) {
  const map = useMap();
  
  useEffect(() => {
    if (areaBounds && map) {
      if (areaBounds.bounds) {
        // Use bounds if available (property-based calculation)
        map.fitBounds(areaBounds.bounds, { padding: [50, 50], maxZoom: 15 });
      } else if (areaBounds.center && areaBounds.radius) {
        // Calculate bounds from circle center and radius
        const R = 6371000; // Earth's radius in meters
        const lat = areaBounds.center[0];
        const lng = areaBounds.center[1];
        const radius = areaBounds.radius;
        
        // Calculate approximate bounds (1 degree ~ 111km)
        const latOffset = (radius / 111000);
        const lngOffset = (radius / (111000 * Math.cos(lat * Math.PI / 180)));
        
        const bounds = [
          [lat - latOffset, lng - lngOffset],
          [lat + latOffset, lng + lngOffset]
        ];
        
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      }
    }
  }, [areaBounds, map]);
  
  return null;
}

// Component to handle map click events
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e);
    },
  });
  return null;
}

function PropertyClusterLayer({ properties, isDarkMode, onSelectProperty }) {
  const map = useMap();

  const handleClusterClick = (event) => {
    const bounds = event?.layer?.getBounds?.();
    if (!bounds || !bounds.isValid()) return;
    map.flyToBounds(bounds, { padding: [40, 40], maxZoom: 17, duration: 0.6 });
  };

  return (
    <MarkerClusterGroup 
      key={`cluster-group-${isDarkMode}`} 
      chunkedLoading 
      maxClusterRadius={60}
      iconCreateFunction={(cluster) => createClusterCustomIcon(cluster, isDarkMode)}
      eventHandlers={{ clusterclick: handleClusterClick }}
    >
      {properties.map((prop) => (
        <Marker 
          key={`${prop.id}-${isDarkMode}`} 
          position={[prop.lat, prop.lng]} 
          icon={createCustomIcon(prop, isDarkMode)}
          eventHandlers={{
            click: () => {
              onSelectProperty(prop);
            }
          }}
        />
      ))}
    </MarkerClusterGroup>
  );
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showMetro, setShowMetro] = useState(true);
  const [mapStyle, setMapStyle] = useState('streets');
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Handle map click to add new property
  const handleMapClick = (e) => {
    const coords = [e.latlng.lat, e.latlng.lng];
    setSelectedCoords(coords);
    setShowAddModal(true);
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
    } catch (err) {
      console.error('Error adding property:', err);
      alert('Failed to add property');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get unique areas for autocomplete
  const uniqueAreas = [...new Set(properties.map(p => p.area))];
  const filteredAreas = searchQuery 
    ? uniqueAreas.filter(area => area.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const filteredProperties = properties.filter(prop => {
    const matchesFilter = activeFilter === 'All' ? true : prop.config.includes(activeFilter);
    const matchesSearch = searchQuery === '' ? true : prop.area.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate stats
  const totalPins = filteredProperties.length;
  const totalAnnualRent = filteredProperties.reduce((sum, prop) => {
    const monthlyRent = parseInt(prop.price) || 0;
    return sum + (monthlyRent * 12);
  }, 0);

  // Calculate bounds for the searched area to highlight it
  const getAreaBounds = () => {
    if (!searchQuery) return null;
    
    // First, try to find the area in AREA_COORDINATES (predefined mapping)
    const searchQueryLower = searchQuery.toLowerCase();
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

  const areaBounds = getAreaBounds();

  // Get Stadia Maps API key from environment
  const stadiaApiKey = import.meta.env.VITE_STADIA_MAPS_API_KEY || '';

  // Map provider URLs - Stadia Maps requires API key for authentication
  const mapProviders = {
    streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    dark: stadiaApiKey 
      ? `https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png?api_key=${stadiaApiKey}`
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', // Fallback to OSM if no API key
    light: stadiaApiKey
      ? `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png?api_key=${stadiaApiKey}`
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', // Fallback to OSM if no API key
    topo: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  };

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      
      {/* FLOATING HEADER */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000, 
        backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#111111',
        padding: '12px 24px',
        borderRadius: '30px',
        boxShadow: isDarkMode ? '0 6px 20px rgba(0,0,0,0.8)' : '0 6px 16px rgba(0,0,0,0.15)',
        border: `1px solid ${isDarkMode ? '#333' : '#eee'}`,
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        fontFamily: 'system-ui, sans-serif',
        transition: 'all 0.3s ease'
      }}>
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px' }}>
          punerent.in
        </h1>

        <div style={{ width: '1px', height: '24px', background: isDarkMode ? '#333' : '#e5e5e5' }} />

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', '1 BHK', '2 BHK', '3 BHK'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                background: activeFilter === filter ? (isDarkMode ? '#ffffff' : '#111111') : 'transparent',
                color: activeFilter === filter ? (isDarkMode ? '#000000' : '#ffffff') : (isDarkMode ? '#a3a3a3' : '#666666'),
                border: `1px solid ${activeFilter === filter ? 'transparent' : (isDarkMode ? '#444' : '#e5e5e5')}`,
                padding: '6px 14px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                transition: 'all 0.2s ease'
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        <div style={{ width: '1px', height: '24px', background: isDarkMode ? '#333' : '#e5e5e5' }} />

        {/* Metro Toggle */}
        <button
          onClick={() => setShowMetro(!showMetro)}
          style={{
            background: showMetro ? '#e0e7ff' : 'transparent',
            color: showMetro ? '#3730a3' : (isDarkMode ? '#a3a3a3' : '#666666'),
            border: `1px solid ${showMetro ? '#c7d2fe' : (isDarkMode ? '#444' : '#e5e5e5')}`,
            padding: '6px 14px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
        >
          🚇 Metro
        </button>

        <div style={{ width: '1px', height: '24px', background: isDarkMode ? '#333' : '#e5e5e5' }} />

        {/* Map Style Selector */}
        <select
          value={mapStyle}
          onChange={(e) => setMapStyle(e.target.value)}
          style={{
            background: isDarkMode ? '#222' : '#f5f5f5',
            color: isDarkMode ? '#ffffff' : '#111111',
            border: `1px solid ${isDarkMode ? '#444' : '#e5e5e5'}`,
            padding: '6px 12px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
            transition: 'all 0.2s ease'
          }}
        >
          <option value="streets">🗺️ Streets</option>
          <option value="dark">🌑 Dark</option>
          <option value="light">☀️ Light</option>
          <option value="topo">🏔️ Topo</option>
          <option value="satellite">🛰️ Satellite</option>
        </select>

        <div style={{ width: '1px', height: '24px', background: isDarkMode ? '#333' : '#e5e5e5' }} />

        {/* Theme Toggle */}
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{
            background: isDarkMode ? '#333' : '#f5f5f5',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s ease'
          }}
          title="Toggle Theme"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>

      {/* SEARCH BOX */}
      <div style={{
        position: 'absolute',
        top: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 999,
        width: '90%',
        maxWidth: '500px'
      }}>
        <div style={{
          position: 'relative',
          backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
          borderRadius: '12px',
          boxShadow: isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.8)' : '0 4px 12px rgba(0,0,0,0.1)',
          border: `1px solid ${isDarkMode ? '#333' : '#e5e5e5'}`,
          overflow: 'hidden'
        }}>
          <input
            type="text"
            placeholder="🔍 Search areas... (e.g., Koregaon Park, Pimpri)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: 'none',
              backgroundColor: 'transparent',
              color: isDarkMode ? '#ffffff' : '#111111',
              fontSize: '14px',
              fontFamily: 'system-ui, sans-serif',
              outline: 'none'
            }}
          />
          
          {/* Autocomplete Dropdown */}
          {searchQuery && filteredAreas.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: isDarkMode ? '#222' : '#f9f9f9',
              borderTop: `1px solid ${isDarkMode ? '#333' : '#e5e5e5'}`,
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {filteredAreas.map((area, idx) => (
                <div
                  key={idx}
                  onClick={() => setSearchQuery(area)}
                  style={{
                    padding: '10px 16px',
                    cursor: 'pointer',
                    borderBottom: `1px solid ${isDarkMode ? '#333' : '#e5e5e5'}`,
                    color: isDarkMode ? '#ffffff' : '#111111',
                    backgroundColor: isDarkMode ? '#222' : '#f9f9f9',
                    transition: 'background-color 0.2s ease',
                    fontSize: '13px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDarkMode ? '#333' : '#f0f0f0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isDarkMode ? '#222' : '#f9f9f9';
                  }}
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
        <div style={{
          position: 'absolute',
          top: '142px',
          left: '720px',
          backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
          borderRadius: '12px',
          boxShadow: isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.8)' : '0 4px 12px rgba(0,0,0,0.1)',
          border: `1px solid ${isDarkMode ? '#333' : '#e5e5e5'}`,
          padding: '9px 16px',
          fontSize: '14px',
          fontWeight: '500',
          color: isDarkMode ? '#ffffff' : '#111111',
          zIndex: 1000,
          fontFamily: 'system-ui, sans-serif',
          whiteSpace: 'nowrap'
        }}>
          📍 {totalPins} {totalPins === 1 ? 'pin' : 'pins'} · {formatCurrency(totalAnnualRent)} in rent / yr
        </div>
      )}

      {/* MAP COMPONENT */}
      <MapContainer 
        center={[18.5280, 73.8560]} 
        zoom={12} 
        minZoom={11} 
        maxBounds={PUNE_BOUNDS} 
        maxBoundsViscosity={1.0} 
        style={{ height: '100%', width: '100%', backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0f0' }}
        zoomControl={false} 
      >
        <TileLayer
          key={mapStyle}
          attribution={
            mapStyle === 'streets' ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' :
            mapStyle === 'satellite' ? '&copy; Esri' :
            mapStyle === 'topo' ? '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>' :
            (mapStyle === 'dark' || mapStyle === 'light') && stadiaApiKey 
              ? '&copy; <a href="https://stadiamaps.com">Stadia Maps</a> &copy; <a href="https://openmaptiles.org">OpenMapTiles</a>'
              : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          }
          url={mapProviders[mapStyle]}
        />

        {/* METRO LINES OVERLAY */}
        {showMetro && (
          <>
            {/* Purple Line Overlay */}
            <Polyline positions={purpleLinePath} color="#c084fc" weight={14} opacity={0.3} lineCap="round" lineJoin="round" />
            <Polyline positions={purpleLinePath} color="#7e22ce" weight={5} opacity={1.0} lineCap="round" lineJoin="round" />

            {/* Aqua Line Overlay */}
            <Polyline positions={aquaLinePath} color="#22d3ee" weight={14} opacity={0.3} lineCap="round" lineJoin="round" />
            <Polyline positions={aquaLinePath} color="#0891b2" weight={5} opacity={1.0} lineCap="round" lineJoin="round" />
          </>
        )}

        {/* AREA HIGHLIGHT OVERLAY */}
        {areaBounds && (
          <Circle
            center={areaBounds.center}
            radius={areaBounds.radius}
            pathOptions={{
              color: isDarkMode ? '#991b1b' : '#22c55e',
              weight: 3,
              opacity: 0.8,
              fill: true,
              fillColor: isDarkMode ? '#991b1b' : '#22c55e',
              fillOpacity: 0.25
            }}
          />
        )}

        <PropertyClusterLayer
          properties={filteredProperties}
          isDarkMode={isDarkMode}
          onSelectProperty={(prop) => {
            setSelectedProperty(prop);
            setShowDetailsModal(true);
          }}
        />

        {/* Map Click Handler */}
        <MapClickHandler onMapClick={handleMapClick} />
        
        {/* Area Zoom Handler */}
        <AreaZoomHandler areaBounds={areaBounds} />
      </MapContainer>

      {/* FLOATING INFO - Click to Add Property */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        right: '30px',
        zIndex: 1001,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '12px'
      }}>
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
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            fontSize: '28px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
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
        <div style={{
          backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
          color: isDarkMode ? '#ccc' : '#666',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          border: `1px solid ${isDarkMode ? '#333' : '#ddd'}`,
          boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.1)',
          maxWidth: '200px',
          textAlign: 'center'
        }}>
          💡 Click anywhere on the map to add a flat listing
        </div>
      </div>

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
                {selectedProperty.owner_name && (
                  <div style={{
                    fontSize: '14px',
                    color: isDarkMode ? '#ddd' : '#333',
                    marginBottom: '4px'
                  }}>Name: <span style={{ fontWeight: '600' }}>{selectedProperty.owner_name}</span></div>
                )}
                {selectedProperty.owner_phone && (
                  <div style={{
                    fontSize: '14px',
                    color: isDarkMode ? '#ddd' : '#333'
                  }}>Phone: <span style={{ fontWeight: '600' }}>{selectedProperty.owner_phone}</span></div>
                )}
              </div>

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
            border: `1px solid ${isDarkMode ? '#333' : '#e5e5e5'}`
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
                    fontFamily: 'system-ui, sans-serif',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginTop: '20px'
              }}>
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
                  disabled={isSubmitting}
                  style={{
                    padding: '12px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: isSubmitting ? '#999' : '#3b82f6',
                    color: '#ffffff',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isSubmitting ? 'Adding...' : '+ Add Property'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}