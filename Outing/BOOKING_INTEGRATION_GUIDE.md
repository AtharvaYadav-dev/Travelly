# 🎯 BOOKING INTEGRATION - Complete Implementation Guide

## ⚠️ Important Note

Booking integration requires **business partnerships** and **API access** from travel service providers. This guide provides complete implementation details, but you'll need to:

1. Apply for API access from each provider
2. Get approved (may take days/weeks)
3. Sign partnership agreements
4. Obtain API keys and credentials

---

## 🏢 Recommended Booking Partners

### 1. **Flights** ✈️

#### **Skyscanner API**
- **Commission:** 1-3% per booking
- **API:** https://partners.skyscanner.net/
- **Requirements:** Business registration, website review
- **Approval Time:** 2-4 weeks

#### **Amadeus API**
- **Commission:** Varies
- **API:** https://developers.amadeus.com/
- **Requirements:** Developer account
- **Approval Time:** Immediate (test), 1-2 weeks (production)

### 2. **Hotels** 🏨

#### **Booking.com Affiliate Partner Program**
- **Commission:** 25-40% of Booking.com's commission (effectively 4-7%)
- **API:** https://www.booking.com/affiliate-program/
- **Requirements:** Website with traffic
- **Approval Time:** 1-2 weeks

#### **Expedia Affiliate Network**
- **Commission:** 3-6%
- **API:** https://www.expediapartnersolutions.com/
- **Requirements:** Business registration
- **Approval Time:** 1-3 weeks

### 3. **Activities** 🎯

#### **GetYourGuide Affiliate Program**
- **Commission:** 8-10%
- **API:** https://partner.getyourguide.com/
- **Requirements:** Website, content
- **Approval Time:** 1-2 weeks

#### **Viator API**
- **Commission:** 8-12%
- **API:** https://www.viator.com/partners
- **Requirements:** Business account
- **Approval Time:** 2-4 weeks

---

## 💻 Implementation Code

### Component Structure

```javascript
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const BookingHub = ({ itinerary }) => {
  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('flights');

  useEffect(() => {
    loadBookingOptions();
  }, [itinerary]);

  const loadBookingOptions = async () => {
    setLoading(true);
    await Promise.all([
      searchFlights(),
      searchHotels(),
      searchActivities()
    ]);
    setLoading(false);
  };

  // Flight Search
  const searchFlights = async () => {
    try {
      const API_KEY = import.meta.env.VITE_SKYSCANNER_API_KEY;
      
      const response = await axios.get(
        `https://partners.api.skyscanner.net/apiservices/browseroutes/v1.0/US/USD/en-US/${origin}/${itinerary.location}/${itinerary.startDate}`,
        {
          headers: {
            'x-api-key': API_KEY
          }
        }
      );
      
      setFlights(response.data.Quotes || []);
    } catch (error) {
      console.error('Flight search error:', error);
      setFlights(getMockFlights());
    }
  };

  // Hotel Search
  const searchHotels = async () => {
    try {
      const API_KEY = import.meta.env.VITE_BOOKING_API_KEY;
      
      const response = await axios.post(
        'https://distribution-xml.booking.com/2.5/json/hotelAvailability',
        {
          city: itinerary.location,
          checkin: itinerary.startDate,
          checkout: itinerary.endDate,
          guests: itinerary.participants
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`
          }
        }
      );
      
      setHotels(response.data.hotels || []);
    } catch (error) {
      console.error('Hotel search error:', error);
      setHotels(getMockHotels());
    }
  };

  // Activity Search
  const searchActivities = async () => {
    try {
      const API_KEY = import.meta.env.VITE_GETYOURGUIDE_API_KEY;
      
      const response = await axios.get(
        `https://api.getyourguide.com/1/activities`,
        {
          params: {
            q: itinerary.location,
            start_date: itinerary.startDate,
            end_date: itinerary.endDate
          },
          headers: {
            'X-ACCESS-TOKEN': API_KEY
          }
        }
      );
      
      setActivities(response.data.activities || []);
    } catch (error) {
      console.error('Activity search error:', error);
      setActivities(getMockActivities());
    }
  };

  return (
    <div className="booking-hub">
      {/* Tabs */}
      <div className="tabs">
        <button onClick={() => setActiveTab('flights')}>✈️ Flights</button>
        <button onClick={() => setActiveTab('hotels')}>🏨 Hotels</button>
        <button onClick={() => setActiveTab('activities')}>🎯 Activities</button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState />
      ) : (
        <>
          {activeTab === 'flights' && <FlightResults flights={flights} />}
          {activeTab === 'hotels' && <HotelResults hotels={hotels} />}
          {activeTab === 'activities' && <ActivityResults activities={activities} />}
        </>
      )}
    </div>
  );
};

// Flight Results Component
const FlightResults = ({ flights }) => {
  return (
    <div className="flight-results">
      {flights.map((flight, i) => (
        <div key={i} className="flight-card">
          <div className="flight-info">
            <p className="airline">{flight.airline}</p>
            <p className="route">{flight.origin} → {flight.destination}</p>
            <p className="time">{flight.departure} - {flight.arrival}</p>
          </div>
          <div className="flight-price">
            <p className="price">${flight.price}</p>
            <a 
              href={flight.bookingUrl} 
              target="_blank"
              className="btn-book"
            >
              Book Now
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

// Hotel Results Component
const HotelResults = ({ hotels }) => {
  return (
    <div className="hotel-results">
      {hotels.map((hotel, i) => (
        <div key={i} className="hotel-card">
          <img src={hotel.image} alt={hotel.name} />
          <div className="hotel-info">
            <h3>{hotel.name}</h3>
            <p className="rating">⭐ {hotel.rating}/5</p>
            <p className="location">{hotel.location}</p>
            <p className="amenities">{hotel.amenities.join(', ')}</p>
          </div>
          <div className="hotel-price">
            <p className="price">${hotel.pricePerNight}/night</p>
            <p className="total">Total: ${hotel.totalPrice}</p>
            <a 
              href={hotel.bookingUrl} 
              target="_blank"
              className="btn-book"
            >
              Book Now
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

// Activity Results Component
const ActivityResults = ({ activities }) => {
  return (
    <div className="activity-results">
      {activities.map((activity, i) => (
        <div key={i} className="activity-card">
          <img src={activity.image} alt={activity.title} />
          <div className="activity-info">
            <h3>{activity.title}</h3>
            <p className="duration">⏱️ {activity.duration}</p>
            <p className="rating">⭐ {activity.rating}/5 ({activity.reviews} reviews)</p>
            <p className="description">{activity.description}</p>
          </div>
          <div className="activity-price">
            <p className="price">From ${activity.price}</p>
            <a 
              href={activity.bookingUrl} 
              target="_blank"
              className="btn-book"
            >
              Book Now
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingHub;
```

---

## 🔑 Environment Variables

Add to `.env`:

```env
# Flights
VITE_SKYSCANNER_API_KEY=your_skyscanner_key
VITE_AMADEUS_API_KEY=your_amadeus_key
VITE_AMADEUS_API_SECRET=your_amadeus_secret

# Hotels
VITE_BOOKING_API_KEY=your_booking_key
VITE_EXPEDIA_API_KEY=your_expedia_key

# Activities
VITE_GETYOURGUIDE_API_KEY=your_getyourguide_key
VITE_VIATOR_API_KEY=your_viator_key
```

---

## 📝 Step-by-Step Setup

### Step 1: Apply for API Access

1. **Skyscanner:**
   - Go to https://partners.skyscanner.net/
   - Click "Become a Partner"
   - Fill application form
   - Wait for approval (2-4 weeks)

2. **Booking.com:**
   - Go to https://www.booking.com/affiliate-program/
   - Sign up as affiliate
   - Get approved
   - Access API documentation

3. **GetYourGuide:**
   - Go to https://partner.getyourguide.com/
   - Apply for partnership
   - Get API credentials

### Step 2: Get API Keys

Once approved:
1. Log into partner dashboard
2. Navigate to API section
3. Generate API keys
4. Copy keys to `.env` file

### Step 3: Test Integration

```javascript
// Test API connection
const testAPI = async () => {
  try {
    const response = await fetch(API_ENDPOINT, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    console.log('API Connected:', response.ok);
  } catch (error) {
    console.error('API Error:', error);
  }
};
```

### Step 4: Implement Tracking

```javascript
// Track affiliate clicks
const trackClick = async (bookingUrl, provider) => {
  await analytics.track('booking_click', {
    provider: provider,
    destination: itinerary.location,
    price: price,
    timestamp: new Date()
  });
  
  // Open booking page
  window.open(bookingUrl, '_blank');
};
```

---

## 💰 Revenue Tracking

### Commission Rates

| Provider | Commission | Example Earning |
|----------|-----------|-----------------|
| Skyscanner | 1-3% | $500 flight = $5-15 |
| Booking.com | 4-7% | $1000 hotel = $40-70 |
| GetYourGuide | 8-10% | $100 tour = $8-10 |
| Viator | 8-12% | $150 activity = $12-18 |

### Monthly Revenue Potential

With 1,000 users/month:
- 10% book flights: 100 x $10 = $1,000
- 15% book hotels: 150 x $50 = $7,500
- 20% book activities: 200 x $10 = $2,000

**Total Potential: $10,500/month**

---

## 🎨 UI Components

### Booking Card Styling

```css
.booking-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s;
}

.booking-card:hover {
  border-color: #FF7A2D;
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(255, 122, 45, 0.2);
}

.btn-book {
  background: linear-gradient(135deg, #FF7A2D 0%, #FF9D6E 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: bold;
  text-transform: uppercase;
  transition: all 0.3s;
}

.btn-book:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(255, 122, 45, 0.4);
}
```

---

## ⚠️ Legal Requirements

### Terms & Conditions

You must include:
1. Affiliate disclosure
2. Privacy policy
3. Cookie consent
4. Terms of service

### Example Disclosure:

```
"Travelly is a participant in various affiliate programs. 
We may earn a commission when you book through our links, 
at no additional cost to you. This helps us keep the service free."
```

---

## 🧪 Testing

### Mock Data for Development

```javascript
const getMockFlights = () => [
  {
    airline: 'Swiss Air',
    origin: 'NYC',
    destination: 'ZRH',
    departure: '10:00 AM',
    arrival: '11:30 PM',
    price: 850,
    bookingUrl: '#'
  }
];

const getMockHotels = () => [
  {
    name: 'Grand Hotel',
    rating: 4.5,
    location: 'City Center',
    pricePerNight: 150,
    totalPrice: 750,
    amenities: ['WiFi', 'Breakfast', 'Pool'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    bookingUrl: '#'
  }
];

const getMockActivities = () => [
  {
    title: 'City Walking Tour',
    duration: '3 hours',
    rating: 4.8,
    reviews: 1250,
    price: 45,
    description: 'Explore the historic city center',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
    bookingUrl: '#'
  }
];
```

---

## 📊 Analytics Integration

```javascript
// Track booking conversions
const trackBooking = async (type, details) => {
  // Google Analytics
  gtag('event', 'booking_click', {
    'event_category': type,
    'event_label': details.destination,
    'value': details.price
  });
  
  // Your analytics
  await fetch('/api/analytics/booking', {
    method: 'POST',
    body: JSON.stringify({
      type,
      destination: details.destination,
      price: details.price,
      timestamp: new Date()
    })
  });
};
```

---

## 🚀 Implementation Timeline

### Week 1-2: Applications
- Apply to all affiliate programs
- Prepare required documentation
- Set up business accounts

### Week 3-4: Approval & Setup
- Receive API credentials
- Set up development environment
- Test API connections

### Week 5-6: Development
- Build booking components
- Implement search functionality
- Add tracking

### Week 7-8: Testing & Launch
- Test with real APIs
- Add error handling
- Deploy to production

---

## 💡 Pro Tips

1. **Start with Affiliates:** Easier to get approved than direct API access
2. **Use Mock Data:** Develop UI before getting API access
3. **Track Everything:** Analytics are crucial for optimization
4. **A/B Test:** Test different layouts and CTAs
5. **Mobile First:** Most bookings happen on mobile
6. **Trust Signals:** Show reviews, ratings, secure badges
7. **Price Comparison:** Show multiple options
8. **Urgency:** "Only 2 rooms left!" increases conversions

---

## 📚 Resources

- **Skyscanner API Docs:** https://skyscanner.github.io/slate/
- **Amadeus API Docs:** https://developers.amadeus.com/self-service
- **Booking.com Affiliate:** https://www.booking.com/content/affiliates.html
- **GetYourGuide Partner:** https://partner.getyourguide.com/en/

---

## ✅ Checklist

- [ ] Apply for affiliate programs
- [ ] Get API credentials
- [ ] Add environment variables
- [ ] Build booking components
- [ ] Implement search functionality
- [ ] Add tracking
- [ ] Test with mock data
- [ ] Test with real APIs
- [ ] Add legal disclosures
- [ ] Deploy to production

---

**Note:** This is a complex feature requiring business partnerships. Start with mock data and apply for API access in parallel. The complete implementation will take 4-8 weeks including approval time.

---

**Revenue Potential:** $5,000-20,000/month with decent traffic! 💰
