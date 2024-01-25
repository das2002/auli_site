import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import ReactDOM from 'react-dom'
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import './Updates.css';

// sanitises markdown 
const createMarkup = (markdown) => {
  const rawMarkup = marked.parse(markdown);
  return { __html: DOMPurify.sanitize(rawMarkup) };
};

const FormattedUpdate = ({ release, index, id }) => {
  const isLatest = index === 0; // Check if it's the first release
  const tagName = isLatest ? `${release.tag_name} (latest)` : release.tag_name;

  return (
    <div id={id} className={'mt-2 mb-12'}>

      <div key={index} id={id} className={'mt-2 mb-12'}>
        <div className='text-2xl font-bold mb-2.5'>Firmware Version {release.tag_name}</div>
        <div className="text-lg font-bold">What's New:</div>
        <div className='markdown' dangerouslySetInnerHTML={createMarkup(release.body)} />
        <div style={{ marginTop: '.7rem' }}>
          <a href={release.zipball_url}
            target="_blank"
            className="decision-button px-3 py-2 rounded-lg cursor-pointer text-lg"
            style={{ border: 'none' }}>
            Download Update
          </a>
        </div>
      </div>
    </div>

  );
};

const Updates = () => {
  // download releases from github 
  const [releases, setReleases] = useState([]);
  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/aulitech/Cato/releases');
        const data = await response.json();
  
        // don't fetch files older than 0.0.5
        const filteredReleases = data.filter(release => {
          const releaseVersion = release.tag_name.startsWith('v') ? release.tag_name.substring(1) : release.tag_name;
          return compareVersions(releaseVersion, '0.0.5') > 0;
        });
  
        setReleases(filteredReleases);
      } catch (error) {
        console.error('Error fetching releases:', error);
      }
    };
  
    fetchReleases();
  }, []);

  const compareVersions = (v1, v2) => {
    const v1parts = v1.split('.').map(Number);
    const v2parts = v2.split('.').map(Number);
  
    for (let i = 0; i < v1parts.length; ++i) {
      if (v2parts.length === i) {
        return 1;
      }
  
      if (v1parts[i] === v2parts[i]) {
        continue;
      } else if (v1parts[i] > v2parts[i]) {
        return 1;
      } else {
        return -1;
      }
    }
  
    if (v1parts.length !== v2parts.length) {
      return -1;
    }
  
    return 0;
  };

  const containerRef = useRef(null);
  const [measuredHeights, setMeasuredHeights] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);

  // measure items in a hidden div
  useLayoutEffect(() => {
    const heights = releases.map((item, index) => {
      const el = document.getElementById(`hidden-item-${index}`);
      return el ? el.clientHeight : 0;
    });
    setMeasuredHeights(heights);
  }, [releases]);

  // calculate which items to show
  useEffect(() => {
    if (!containerRef.current) return;

    let availableHeight = containerRef.current.clientHeight;
    let currentHeight = 0;
    let itemsToShow = [];

    for (let i = 0; i < measuredHeights.length; i++) {
      if (currentHeight + measuredHeights[i] > availableHeight) break;
      currentHeight += measuredHeights[i];
      itemsToShow.push(releases[i]);
    }

    // add 'latest' to most recent
    if (itemsToShow && itemsToShow.length > 0) {
      itemsToShow[0].tag_name += ' (latest)'
    }
    setVisibleItems(itemsToShow);
  }, [measuredHeights]);

  // fixes load more button to the bottom until we load more releases 
  const [buttonState, setButtonState] = useState('fixed');
  const [displayedReleaseCount, setDisplayedReleaseCount] = useState(3);
  const loadMoreReleases = () => {
    // Calculate the new count, ensuring it doesn't exceed the total number of releases
    const newCount = Math.min(displayedReleaseCount + 3, releases.length);
    setDisplayedReleaseCount(newCount);
    setButtonState('float');
    if (newCount === releases.length) {
      setButtonState('hidden'); // Hide the button if all releases are displayed
    }
  };

  useEffect(() => {
    const visible = releases.slice(0, displayedReleaseCount);
    setVisibleItems(visible);
  }, [displayedReleaseCount, releases]);

  const buttonStyle = (buttonState) => {
    switch (buttonState) {
      case 'fixed':
        return ({ position: 'sticky', bottom: '10px', left: '50%', transform: 'translateX(-50%)', border: 'none' })
        break;
      case 'float':
        return ({ position: 'sticky', bottom: '10px', left: '50%', transform: 'translateX(-50%)', border: 'none' })
        break;
      case 'hidden':
        return ({ visibility: 'hidden' })
        break;
    }
  }

  return (
    <div id='basecontainer' className='base-container'>
      <div className="ml-90">
        <header className="shrink-0 bg-transparent border-b border-gray-200">
          <div className="ml-0 flex h-16 max-w-7xl items-center justify-between ">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Updates
            </h2>
          </div>
        </header>
      </div>

      {/* Hidden div for measuring */}
      <div style={{
        position: 'fixed',
        left: '-9999px',
        width: '1000px', // or an appropriate width that matches your items
        overflow: 'hidden'
      }}
        className='release-container'
      >
        {releases.map((release, index) => (
          <FormattedUpdate key={index} release={release} index={index} id={`hidden-item-${index}`} />
        ))}
      </div>

      {/* Actual container */}
      <div ref={containerRef} className='release-container'>
        {visibleItems.map((item, index) => (
          <FormattedUpdate key={item.id || index} release={item} index={index} />
        ))}
      </div>

      {buttonState !== 'hidden' && (
        <div className="text-center my-4" style={{ width: '100%', position: 'relative' }}>
          <button
            onClick={loadMoreReleases}
            className="decision-button px-4 py-2 rounded-lg cursor-pointer text-lg"
            style={buttonStyle(buttonState)}>
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default Updates;