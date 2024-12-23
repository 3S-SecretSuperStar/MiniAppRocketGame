import React, { useCallback, useState } from "react";
import { cn } from "../../utils";

const FixModal = ({ children, icon, title, isOpen, setIsOpen, height, className }) => {

    const [isExiting, setIsExiting] = useState(false);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsExiting(false);
        }, 500); // Match this duration with your animation duration
    };
    // Handle clicks on the backdrop
    const handleBackdropClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            handleClose()
        }
    }, [setIsOpen]);

    // Return null if the modal is not open
    if (!isOpen && !isExiting) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-30 animate-fade-out z-10"
        >
            <div
                className={
                    cn(`info-modal flex flex-col ${height} rounded-2xl w-[calc(100vw-32px)] p-4 gap-6 bg-white duration-300
                    ${isExiting ? 'animate-zoom-out' : 'animate-zoom-in'}`, className)
                }
            >

                <div className="flex">
                    <div className="text-[17px] leading-5 w-full text-[#0D1421] text-center tracking-[-0.23px] font-extrabold ">
                        {title}
                    </div>
                    <div className="absolute top-4 right-4 transform " onClick={handleClose}>
                        <img
                            src="/image/icon/close-dark.svg"
                            alt="Close Button"
                            className="w-[20px] h-[20px]"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {children}
                </div>

            </div>
        </div>
    );
};

export default FixModal;