import React, { useEffect, useState } from "react";

import "./Timer.css";

function Timer({ end }) {
    const [t, setT] = useState("");

    useEffect(() => {

        const updateTimer = () => {

            const seconds = Math.max(
                0,
                Math.floor(
                    (new Date(end) - new Date()) / 1000
                )
            );

            if (seconds <= 0) {
                setT("Auction ended");
                return;
            }

            const days = Math.floor(
                seconds / 86400
            );

            const hours = Math.floor(
                (seconds / 3600) % 24
            );

            const minutes = Math.floor(
                (seconds / 60) % 60
            );

            const secs = seconds % 60;

            setT(
                `${String(days).padStart(2, "0")}d ` +
                `${String(hours).padStart(2, "0")}h ` +
                `${String(minutes).padStart(2, "0")}m ` +
                `${String(secs).padStart(2, "0")}s`
            );
        };

        updateTimer();

        const timer =
            setInterval(updateTimer, 1000);

        return () =>
            clearInterval(timer);

    }, [end]);

    return t;
}

export default Timer;