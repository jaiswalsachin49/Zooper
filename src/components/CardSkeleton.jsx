import React from "react";

const CardSkeleton = () => {
    return (
        <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 w-full aspect-[2/3] animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
                <div className="h-6 bg-white/10 rounded w-3/4" />
                <div className="h-4 bg-white/10 rounded w-full" />
                <div className="h-4 bg-white/10 rounded w-2/3" />
                <div className="h-10 bg-white/10 rounded-lg w-full mt-2" />
            </div>
        </div>
    );
};

export default CardSkeleton;
