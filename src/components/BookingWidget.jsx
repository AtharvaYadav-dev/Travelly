import React from 'react';
import { motion } from 'framer-motion';
import Magnetic from '../Magnetic';

const BookingWidget = ({ itinerary }) => {
  if (!itinerary) return null;

  const { location, startDate, endDate } = itinerary;
  
  // Format dates for various platforms
  const startObj = startDate ? new Date(startDate) : new Date();
  const endObj = endDate ? new Date(endDate) : new Date(new Date().setDate(new Date().getDate() + 5));

  const formatMMTDate = (date) => {
    return date.toISOString().split('T')[0].split('-').reverse().join('');
  };

  const bookingLinks = {
    makemytrip: `https://www.makemytrip.com/hotels/hotel-listing?checkin=${formatMMTDate(startObj)}&checkout=${formatMMTDate(endObj)}&city=${encodeURIComponent(location)}&country=India&roomStayQualifier=2e0e&locusId=CTBOM&locusType=city&searchText=${encodeURIComponent(location)}`,
    booking: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(location)}&checkin=${startObj.toISOString().split('T')[0]}&checkout=${endObj.toISOString().split('T')[0]}`,
    viator: `https://www.viator.com/search/${encodeURIComponent(location)}?mcid=56757`,
    skyscanner: `https://www.skyscanner.co.in/transport/flights/anywhere/${encodeURIComponent(location)}/${startObj.toISOString().split('T')[0]}/`
  };

  const services = [
    {
      name: 'Flights Book Karo',
      icon: '✈️',
      provider: 'Skyscanner / MMT',
      color: 'from-blue-600 to-indigo-600',
      link: bookingLinks.skyscanner,
      desc: 'Saste flights dhoondo instantly'
    },
    {
      name: 'Hotels Check Karo',
      icon: '🏨',
      provider: 'Booking.com',
      color: 'from-emerald-600 to-teal-600',
      link: bookingLinks.booking,
      desc: 'Top-rated stays in your budget'
    },
    {
      name: 'Activities Book Karo',
      icon: '🎟️',
      provider: 'Viator / Klook',
      color: 'from-amber-600 to-orange-600',
      link: bookingLinks.viator,
      desc: 'Local adventures and tickets'
    }
  ];

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-left mb-12"
      >
        <span className="text-primary font-black uppercase tracking-[0.5em] text-[10px] mb-4 block">Ab Planning Complete</span>
        <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white">
          Chalo <span className="primary-gradient-text">Ticket</span> <br /> Book Karein?
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            viewport={{ once: true }}
            className="group relative"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`} />
            
            <div className="premium-glass p-10 rounded-[2.5rem] border-white/5 group-hover:border-primary/30 transition-all relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="text-5xl mb-8 transform group-hover:scale-110 transition-transform duration-500 origin-left">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tight mb-3">
                  {service.name}
                </h3>
                <p className="text-white/40 text-sm font-medium leading-relaxed mb-10">
                  {service.desc}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black uppercase tracking-widest text-primary border border-primary/20">
                    {service.provider}
                  </span>
                </div>

                <Magnetic>
                  <a
                    href={service.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full px-8 py-5 bg-white text-black rounded-full font-black uppercase tracking-widest text-[10px] transition-all hover:bg-primary hover:text-white"
                  >
                    Check Now 
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-1 transition-transform">
                      <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor"/>
                    </svg>
                  </a>
                </Magnetic>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-16 p-8 bg-primary/5 border border-primary/10 rounded-3xl flex items-center gap-6">
        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-xl">💡</div>
        <p className="text-white/40 text-xs italic leading-relaxed">
          <b>Pro Tip:</b> AI has already picked the best locations. Booking these now guarantees your spot on this epic journey. Prices change fasters than Indian weather, toh jaldi karo!
        </p>
      </div>
    </div>
  );
};

export default BookingWidget;
