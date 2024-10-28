import React, { useEffect, useState } from 'react';
import { Img } from '../../assets/image';
import Stars from './Stars';

const FetchLoading = ({ firstLoading, setLoading, vRate }) => {
    const [rocketPos, setRocketPos] = useState(window.innerHeight / 2);
    const vh = window.innerHeight * vRate / 100;

    useEffect(() => {
        if (!firstLoading) {
            const loadingInterval = setInterval(() => {
                setRocketPos((prevPos) => {
                    if (prevPos < 0) {
                        clearInterval(loadingInterval);
                        setLoading(false);
                    }
                    return prevPos - vh;
                });
            }, 1);
        }
    }, [firstLoading])
    return (
        <div className="fixed flex flex-col items-center top-0 right-0 w-full justify-center h-screen bg-layout z-10">
            <img
                src={Img.spaceFog}
                alt="spaceFog"
                width={589}
                height={1081}
                className={`max-w-[589px] h-[1081px] fixed -top-[170px]`}
            />
            <Stars />
            <svg width="53" height="92" viewBox="0 0 53 92" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${firstLoading && "animate-sparkle"} fixed transform -translate-y-1/2`} style={{ top: `${rocketPos}px` }}>
                <g filter="url(#filter0_f_2748_8706)">
                    <path d="M34.5 64.5002C34.5 73.0606 30.9183 90.0002 26.5 90.0002C22.0817 90.0002 18.5 73.0606 18.5 64.5002C18.5 55.9398 22.0817 59.0002 26.5 59.0002C30.9183 59.0002 34.5 55.9398 34.5 64.5002Z" fill="url(#paint0_linear_2748_8706)" />
                </g>
                <g filter="url(#filter1_f_2748_8706)">
                    <path d="M29.5 65.713C29.5 69.9936 28.1569 79 26.5 79C24.8431 79 23.5 69.9936 23.5 65.713C23.5 61.4323 24.8431 63.4985 26.5 63.4985C28.1569 63.4985 29.5 61.4323 29.5 65.713Z" fill="url(#paint1_linear_2748_8706)" />
                </g>
                <g filter="url(#filter2_f_2748_8706)">
                    <path d="M28.5 64.6956C28.5 67.371 27.6046 73 26.5 73C25.3954 73 24.5 67.371 24.5 64.6956C24.5 62.0202 25.3954 63.3115 26.5 63.3115C27.6046 63.3115 28.5 62.0202 28.5 64.6956Z" fill="url(#paint2_linear_2748_8706)" />
                </g>
                <g clipPath="url(#clip0_2748_8706)">
                    <path d="M22.737 55.5201C18.9785 50.6375 16.9167 45.7314 16.0515 39.6125C15.9577 38.949 15.517 38.386 14.8955 38.1358C14.2739 37.8855 13.5662 37.9858 13.0388 38.3989C12.9263 38.4871 10.2485 40.6045 7.38317 44.5754C4.74805 48.2272 1.42868 54.2319 0.580805 62.099C0.513555 62.7235 0.76343 63.3403 1.24655 63.7418C1.7353 64.1482 2.19493 64.3086 3.19493 63.7418C4.19493 63.1751 6.50001 56 13.5 56C20.5 56 22.5 58 23.0359 57.2388C23.5718 56.4777 23.1134 56.009 22.737 55.5201Z" fill="#FC495C" />
                    <path d="M30.263 55.5201C34.0215 50.6375 36.0833 45.7314 36.9485 39.6125C37.0423 38.949 37.483 38.386 38.1045 38.1358C38.7261 37.8855 39.4338 37.9858 39.9612 38.3989C40.0737 38.4871 42.7515 40.6045 45.6168 44.5754C48.252 48.2272 51.5713 54.2319 52.4192 62.099C52.4864 62.7235 52.2366 63.3403 51.7534 63.7418C51.2647 64.1482 50.8051 64.3086 49.8051 63.7418C48.8051 63.1751 46.5 56 39.5 56C32.5 56 30.5 58 29.9641 57.2388C29.4282 56.4777 29.8866 56.009 30.263 55.5201Z" fill="url(#paint3_linear_2748_8706)" />
                    <path d="M40.8749 31.9999C40.8749 39.3674 39.7624 45.2124 37.3724 50.3937C35.0387 55.4536 31.6999 59.3924 28.3749 62.8786C28.1999 63.0624 28.0237 63.2461 27.8487 63.4274C27.4962 63.7936 27.0087 63.9999 26.4999 63.9999C25.9912 63.9999 25.5037 63.7924 25.1512 63.4274C24.9724 63.2424 24.7974 63.0599 24.6249 62.8786C22.7837 60.9436 21.325 59.2636 20.07 57.6324C15.895 52.2074 13.6037 46.7587 12.6437 39.9624C12.295 37.5012 12.125 34.8962 12.125 31.9999C12.125 20.4387 16.7512 9.27748 25.1512 0.572499C25.5037 0.20625 25.9912 0 26.4999 0C27.0087 0 27.4962 0.20625 27.8487 0.572499C36.2487 9.27748 40.8749 20.4387 40.8749 31.9999Z" fill="url(#paint4_linear_2748_8706)" />
                    <path d="M32.9518 24.5453C32.0389 23.171 29.0354 21.8584 26.4999 21.8584C23.9644 21.8584 20.9608 23.171 20.0481 24.5453C19.1856 23.9723 18.9508 22.8085 19.5237 21.9459C21.1199 19.5429 23.7278 18.1084 26.4999 18.1084C29.2721 18.1084 31.88 19.543 33.4762 21.9459C34.049 22.8085 33.8143 23.9723 32.9518 24.5453Z" fill="url(#paint5_linear_2748_8706)" />
                    <path d="M24.574 40.9986C24.5336 39.907 25.4076 39 26.5 39C27.5924 39 28.4664 39.907 28.426 40.9986L27.537 65.0007C27.5164 65.5585 27.0582 66 26.5 66C25.9418 66 25.4836 65.5585 25.463 65.0007L24.574 40.9986Z" fill="url(#paint6_linear_2748_8706)" />
                </g>
                <defs>
                    <filter id="filter0_f_2748_8706" x="16.5" y="56.4683" width="20" height="35.5317" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur_2748_8706" />
                    </filter>
                    <filter id="filter1_f_2748_8706" x="22.5" y="62" width="8" height="18" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur_2748_8706" />
                    </filter>
                    <filter id="filter2_f_2748_8706" x="23.5" y="62" width="6" height="12" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="0.5" result="effect1_foregroundBlur_2748_8706" />
                    </filter>
                    <linearGradient id="paint0_linear_2748_8706" x1="26.5" y1="43.5002" x2="26.5" y2="86.0002" gradientUnits="userSpaceOnUse">
                        <stop stopColor="white" />
                        <stop offset="1" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="paint1_linear_2748_8706" x1="26.5" y1="63" x2="26.5" y2="75.7334" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FAD557" />
                        <stop offset="1" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="paint2_linear_2748_8706" x1="26.5" y1="63" x2="26.5" y2="70.5831" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FC495C" />
                        <stop offset="1" stopColor="#FAD557" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="paint3_linear_2748_8706" x1="32.866" y1="43.5" x2="52.3589" y2="64.1325" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#E2395A" />
                        <stop offset="1" stopColor="#7C1F31" />
                    </linearGradient>
                    <linearGradient id="paint4_linear_2748_8706" x1="12.5" y1="32" x2="40.5" y2="32" gradientUnits="userSpaceOnUse">
                        <stop offset="0.287523" stopColor="#FD6B82" />
                        <stop offset="1" stopColor="#B84150" />
                    </linearGradient>
                    <linearGradient id="paint5_linear_2748_8706" x1="26.5" y1="18.0001" x2="33" y2="24.5001" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FAD557" />
                        <stop offset="1" stopColor="#FF8909" />
                    </linearGradient>
                    <linearGradient id="paint6_linear_2748_8706" x1="24.5" y1="53" x2="28.5" y2="53" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FC495C" />
                        <stop offset="1" stopColor="#842235" />
                    </linearGradient>
                    <clipPath id="clip0_2748_8706">
                        <rect width="52" height="84" fill="white" transform="translate(0.5)" />
                    </clipPath>
                </defs>
            </svg>
            <div className={`fixed ${!firstLoading && "hidden"} ${firstLoading && "animate-sparkle"} font-roboto font-medium text-[9px] text-white`} style={{ top: window.innerHeight / 2 + 40 }}>LOADING...</div>
        </div>
    );
};

export default FetchLoading;