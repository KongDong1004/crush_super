"use client";

import { useEffect, useState, useRef } from "react";

export function useSlotMachineSound() {
    const rollingAudioRef = useRef<HTMLAudioElement | null>(null);
    const lockAudioRef = useRef<HTMLAudioElement | null>(null);
    const winAudioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize Audio objects
        rollingAudioRef.current = new Audio("/sounds/rolling.mp3");
        rollingAudioRef.current.loop = true; // Loop the rolling sound

        lockAudioRef.current = new Audio("/sounds/lock.mp3");
        winAudioRef.current = new Audio("/sounds/complete.mp3");

        // Clean up
        return () => {
            if (rollingAudioRef.current) {
                rollingAudioRef.current.pause();
                rollingAudioRef.current.currentTime = 0;
            }
            if (winAudioRef.current) {
                winAudioRef.current.pause();
                winAudioRef.current.currentTime = 0;
            }
        };
    }, []);

    const playRoll = () => {
        if (rollingAudioRef.current) {
            rollingAudioRef.current.currentTime = 0;
            rollingAudioRef.current.play().catch(e => console.error("Roll sound play failed:", e));
        }
    };

    const stopRoll = () => {
        if (rollingAudioRef.current) {
            rollingAudioRef.current.pause();
            rollingAudioRef.current.currentTime = 0;
        }
    };

    const playLock = () => {
        if (lockAudioRef.current) {
            // Clone node to allow overlapping sounds (rapid clicks) if needed, 
            // though for sequential lock single instance usually fine unless very fast.
            // Using standard play for now. Reset time to ensure it hits per lock.
            lockAudioRef.current.currentTime = 0;
            lockAudioRef.current.play().catch(e => console.error("Lock sound play failed:", e));
        }
    };

    const playWin = () => {
        if (winAudioRef.current) {
            winAudioRef.current.currentTime = 0;
            winAudioRef.current.play().catch(e => console.error("Win sound play failed:", e));
        }
    };

    return { playRoll, stopRoll, playLock, playWin };
}
