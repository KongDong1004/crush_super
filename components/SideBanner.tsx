"use client";

import { motion } from "framer-motion";

export default function SideBanner({ side = 'right' }: { side?: 'left' | 'right' }) {
    const xOffset = side === 'left' ? -20 : 20;

    return (
        <motion.div
            initial={{ opacity: 0, x: xOffset }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="hidden 2xl:flex flex-col w-[300px] xl:w-[350px] shrink-0 h-fit sticky top-8"
        >
            <div className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/50 shadow-[0_0_30px_rgba(255,215,0,0.3)] bg-gradient-to-b from-[#FFF8DC]/20 to-[#D4AF37]/10 backdrop-blur-md group">
                {/* Gold Frame Effect */}
                <div className="absolute inset-0 border-2 border-[#D4AF37]/60 rounded-3xl z-20 pointer-events-none mix-blend-overlay" />

                {/* Video Container */}
                <div className="relative aspect-[9/16] w-full">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover opacity-100 transition-opacity duration-700"
                    >
                        <source src="/1228 (1).mov" type="video/mp4" />
                    </video>

                    {/* Overlay Gradient - Brighter/Golden */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/60 via-transparent to-[#FFF8DC]/30 pointer-events-none mix-blend-screen" />

                    {/* Text Content */}
                    <div className="absolute bottom-0 inset-x-0 p-6 text-center z-10">
                        <h3 className="text-white font-serif text-2xl font-bold mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            Divinity
                        </h3>
                        <p className="text-yellow-100/90 text-sm font-light tracking-wide drop-shadow-md">
                            Fortune smiles upon the bold.
                        </p>
                    </div>
                </div>
            </div>

            {/* Decorative bottom element */}
            <div className="mt-4 flex justify-center">
                <div className="w-1 h-12 bg-gradient-to-b from-[#D4AF37] to-transparent opacity-50 rounded-full" />
            </div>
        </motion.div>
    );
}
