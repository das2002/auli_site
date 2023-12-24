import React, { useState, useEffect } from 'react';
import { db } from "../../firebase";
import { collection, getDocs } from 'firebase/firestore';
import LoadingIndicator from './LoadingIndicator';

const Updates = () => {
  // gets latest release from firestore 
  const [latestRelease, setLatestRelease] = useState(null);

  useEffect(() => {
    const fetchReleases = async () => {
      const releasesRef = collection(db, 'software');

      try {
        setTimeout(async () => {
          const querySnapshot = await getDocs(releasesRef);
          let mostRecentRelease = null;
          let mostRecentDate = new Date(0);  
  
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const releasesData = data.releases;

            // assumes timestamp is a firestore Timestamp object 
            const releaseDate = releasesData.timestamp.toDate(); 
  
            if (releaseDate > mostRecentDate) {
              mostRecentDate = releaseDate;
              mostRecentRelease = releasesData; // entire release JSON 
              mostRecentRelease.id = doc.id; // firebase ID 
            }
          });
  
          setLatestRelease(mostRecentRelease);
        }, 500); // 3000 milliseconds delay (3 seconds)  
      } catch (error) {
        console.error('Error fetching releases:', error);
      }
    };

    fetchReleases();
  }, []);


  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    maxHeight: '100vh', // Max height is the full viewport height
    overflow: 'auto', // Adds scrolling inside the container if content overflows
    margin: '0 auto',
    marginTop: '23vh', // 243/1029 = 23% down from top 
    padding: '0px', // 481 - 419px from left 
    boxSizing: 'border-box', 
    maxWidth: '1100px', 
    fontFamily: 'Arial, sans-serif', 
  };

  const headerStyle = {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '0px',
    marginTop: '0px',
  };

  const subHeaderStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  };

  const listStyle = {
    marginBottom: '20px',
    marginLeft: '18px',
    listStyleType: 'disc'
  };

  const buttonStyle = {
    backgroundColor: '#AA9358', 
    color: 'black',
    padding: '10px 20px',
    marginTop: '5vh',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  };

  // while query is running on db 
  // if (!latestRelease) {
  //   return <LoadingIndicator style={headerStyle} />;
  // }

  return (
    <div style={containerStyle}>
      {!latestRelease ? (
        <LoadingIndicator style={headerStyle} />
      ) : (
        <>
          <div style={headerStyle}>Updates</div>
          <div style={subHeaderStyle}>Firmware Version {latestRelease.tag}</div>
          <div>
            <p>What's new in this version:</p>
            <ul style={listStyle}>
              <li>This version includes a new gesture collection interface, with improved data pipeline and an improved interface for accessibility.</li>
              <li>Device settings page now includes an advanced setting page to allow more finer grain control over settings.</li>
            </ul>
          </div>
      <a href={latestRelease.zip} style={buttonStyle} target="_blank" rel="noopener noreferrer">Download Update</a>
        </>
      )}
    </div>
  );

};

export default Updates;
