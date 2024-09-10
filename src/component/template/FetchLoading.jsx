import React from 'react';

const FetchLoading = () => {
    return (
        <div className="absolute flex flex-col items-center top-0 right-0 w-full justify-center h-screen bg-gray-100 bg-opacity-20">
            <div className="loader"></div>
            {/* <p className="mt-4 text-lg text-blue-600">Loading...</p>   */}

            <style jsx="true">{`
                .loader {
                    border: 5px solid #FFFFFF; /* Light gray */
                    border-top: 5px solid transparent; /* Teal color */
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                    z-index: 9999;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default FetchLoading;