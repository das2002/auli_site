import React, { useState, useEffect } from 'react';

const PracticeMode = () => {
    // State to store the list of similarity scores
    const [similarityScores, setSimilarityScores] = useState([]);

    // Placeholder text with instructions
    const instructions = "Practice Mode is active. Head movements are being monitored.";

    // Function to simulate detecting a head movement and calculating a similarity score
    const simulateHeadMovement = () => {
        // Simulate detecting a head movement and calculating a similarity score
        const newScore = Math.random().toFixed(2) * 100;

        // Update the list of similarity scores with the new score
        setSimilarityScores([...similarityScores, newScore]);

        // Automatically set up the next simulation
        setTimeout(simulateHeadMovement, 2000); // Adjust time as needed
    };

    // useEffect to start the simulation when the component mounts
    useEffect(() => {
        setTimeout(simulateHeadMovement, 2000); // Start after 2 seconds
        // Cleanup function to clear the timeout if the component unmounts
        return () => clearTimeout(simulateHeadMovement);
    }, []); // Empty dependency array means this effect runs once on mount

    return (
        <div style={{ margin: '20px' }}>
            <h2>Practice Mode</h2>
            <textarea
                readOnly
                style={{ width: '300px', height: '100px', color: 'white', backgroundColor: 'black' }}
                value={instructions}
            />
            <div style={{ marginTop: '10px' }}>
                <strong>Similarity Scores:</strong>
                {/* List each similarity score on a new line */}
                {similarityScores.map((score, index) => (
                    <p key={index}>Attempt {index + 1}: {score}%</p>
                ))}
            </div>
        </div>
    );
};

export default PracticeMode;
