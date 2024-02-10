import React from 'react';

const Error = ({ place }) => {
  return (
    <div className="text-center mt-8">
      <h2 className="text-2xl font-bold text-red-500">City not found</h2>
      <p className="text-gray-600 mt-2">
        Sorry, we couldn't find any information for the city <strong>{place}</strong>.
      </p>
      <p className="text-gray-600 mt-2">
        Please check the spelling or try another city.
      </p>
      {/* You can add additional information or actions here */}
    </div>
  );
};

export default Error;
