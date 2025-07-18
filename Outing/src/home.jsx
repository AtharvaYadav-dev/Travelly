import React from 'react';

const Home = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const user = JSON.parse(localStorage.getItem('travellyUser'));

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Welcome to Travelly</h1>
      {isLoggedIn && user ? (
        <p className="text-xl text-green-700">Welcome back, {user.fullName} 👋</p>
      ) : (
        <p className="text-gray-600">Plan your dream trip with personalized itineraries. </p>
      )}
    </main>
  );
};

export default Home;

