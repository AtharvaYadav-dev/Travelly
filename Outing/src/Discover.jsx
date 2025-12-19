import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Magnetic from './Magnetic';

const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    x.set(mouseXPos / width - 0.5);
    y.set(mouseYPos / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Discover = () => {
  const navigate = useNavigate();

  const destinations = [
    { title: "Zermatt", location: "Valais", price: "$4,500", type: "Climbing", img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200", tag: "Popular" },
    { title: "Saint-Moritz", location: "Graubünden", price: "$6,200", type: "Skiing", img: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?q=80&w=1200", tag: "Premium" },
    { title: "Interlaken", location: "Bernese Oberland", price: "$2,800", type: "Air Sports", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200", tag: "Adventure" },
    { title: "Lucerne", location: "Central Swiss", price: "$3,100", type: "Boat Tour", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1200", tag: "Scenic" },
    { title: "Verbier", location: "Val de Bagnes", price: "$5,100", type: "Photography", img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200", tag: "Pro" },
    { title: "Davos", location: "Graubünden", price: "$3,400", type: "Historic", img: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=1200", tag: "Heritage" },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white pb-32">
      {/* 🎭 FLOATING BACKGROUND ELLS */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden z-0">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-[20%] right-[-10%] text-[20rem] font-black italic text-primary/10 select-none"
        >
          DISCOVER
        </motion.div>
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, -50, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-[20%] left-[-10%] text-[20rem] font-black italic text-primary/10 select-none"
        >
          EXPLORE
        </motion.div>
      </div>

      {/* Header */}
      <section className="relative pt-48 pb-32 px-6 z-10">
        <div className="max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2 }}
            className="text-center"
          >
            <span className="text-primary font-black uppercase tracking-[0.8em] text-[10px] mb-10 block">Featured Tours</span>
            <h1 className="text-8xl md:text-[10rem] font-black uppercase tracking-tighter italic leading-none mb-12">
              Our <br /> <span className="primary-gradient-text">Tours</span>
            </h1>
            <p className="max-w-2xl mx-auto text-white/40 text-lg font-medium italic leading-relaxed">
              Explore our collection of Swiss tours. Each trip is carefully planned to give you the best experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-[1600px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-16">
          {destinations.map((dest, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="perspective-1000"
            >
              <TiltCard className="premium-glass rounded-3xl overflow-hidden group">
                <div className="relative h-96 overflow-hidden">
                  <motion.img
                    initial={{ scale: 1.2, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    src={dest.img}
                    alt={dest.title}
                    className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-[1500ms]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />

                  <div className="absolute top-10 left-10">
                    <span className="px-6 py-2 bg-primary/20 backdrop-blur-md border border-primary/30 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                      {dest.tag}
                    </span>
                  </div>

                  <div className="absolute bottom-10 left-10 right-10">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-primary text-[10px] font-black uppercase tracking-widest mb-1 block">{dest.location}</span>
                        <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white">{dest.title}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-white/40 text-[9px] font-black uppercase block mb-1">From</span>
                        <span className="text-2xl font-black text-white italic">{dest.price}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-10 space-y-10">
                  <div className="flex gap-1.5 opacity-30">
                    {[1, 2, 3, 4, 5].map(s => <span key={s} className="text-primary text-[10px]">★</span>)}
                  </div>
                  <p className="text-white/40 text-sm italic font-medium leading-relaxed">
                    Explore the best of the Swiss Alps with a personalized itinerary designed for your comfort and enjoyment.
                  </p>
                  <div className="flex justify-center pt-4">
                    <Magnetic>
                      <button
                        onClick={() => navigate('/planner')}
                        className="btn-expensive bg-white/5 w-full md:w-auto"
                      >
                        Book Now
                      </button>
                    </Magnetic>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-48 mt-32 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white">
              Join Our <span className="text-primary">Newsletter</span>
            </h2>
            <p className="text-white/30 text-lg italic max-w-xl mx-auto">
              Get travel tips and updates from Switzerland, delivered to your inbox twice a month.
            </p>
            <div className="flex flex-col md:flex-row gap-6 p-2 rounded-full border border-white/5 bg-slate-900/50 backdrop-blur-xl">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-transparent border-none px-10 py-5 text-white placeholder:text-white/20 focus:outline-none italic"
              />
              <Magnetic>
                <button className="px-12 py-5 bg-primary text-white font-black uppercase tracking-widest text-[11px] rounded-full shadow-2xl">
                  Subscribe
                </button>
              </Magnetic>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Discover;
