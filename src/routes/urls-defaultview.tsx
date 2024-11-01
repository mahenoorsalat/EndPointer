// src/components/URLsDefaultView.tsx

import React, { useState, useRef } from 'react';
import { URLProps } from '../components/URLProps';
import { LocationItem, WebpageItem } from '../components/Locationitem';
import { useURLData } from '../hooks/useURLData';
import { clearURLs } from '../utils/defaultview_utils';
import { VISIBLE_URL_SIZE, CSS_CLASSES } from '../constants/defaultview_contants';
import { NavBar } from '../components/navbar';

export function URLsDefaultView() {
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedWebpage, setSelectedWebpage] = useState<string>('All');
  const [isOpenLocation, setIsOpenLocation] = useState<boolean>(false);
  const [isOpenWebpage, setIsOpenWebpage] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [startIndex, setStartIndex] = useState(0);
  const tableRef = useRef<HTMLDivElement>(null);

  const { 
    urls, 
    jsFiles, 
    filteredURLs, 
    visibleUrls, 
    setVisibleUrls,
    webpages
  } = useURLData(selectedLocation, selectedWebpage, searchQuery, startIndex, VISIBLE_URL_SIZE);

  const handleSelectLocation = (url: string) => {
    setSelectedLocation(url);
    setIsOpenLocation(false);
    setStartIndex(0);
  };

  const handleSelectWebpage = (url: string) => {
    setSelectedWebpage(url);
    setIsOpenWebpage(false);
    setStartIndex(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setStartIndex(0);
  };

  const handleScroll = () => {
    if (tableRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = tableRef.current;
      const bottomThreshold = 200;
      const topThreshold = 200;

      if (scrollHeight - scrollTop - clientHeight < bottomThreshold) {
        setStartIndex(prev => Math.min(prev + 20, Math.max(0, filteredURLs.length - VISIBLE_URL_SIZE)));
      } else if (scrollTop < topThreshold && startIndex > 0) {
        setStartIndex(prev => Math.max(prev - 20, 0));
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-4 md:px-8">
      {(document.location.pathname.toLowerCase().includes("devtool") && <NavBar />)}
      
      <div className="w-full max-w-7xl mt-5">
        <div className="flex flex-col gap-8">
          <div className="w-full max-h-[760px] overflow-auto rounded-lg" ref={tableRef} onScroll={handleScroll}>
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr className="text-xl md:text-3xl text-white">
                      <th className="border-b-2 pb-6 md:pb-10 px-2 md:px-4">
                        ENDPOINT <span className="text-customFont">({filteredURLs.length})</span>
                      </th>
                      <th className="border-b-2 pb-6 md:pb-10 px-2 md:px-4">
                        SOURCE <span className="text-customFont">({jsFiles.length})</span>
                      </th>
                      <th className="border-b-2 pb-6 md:pb-10 px-2 md:px-4">
                        WEBPAGE <span className="text-customFont">({webpages.length})</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    <tr>
                      <td className="px-2 md:px-4">
                        <div className="mt-5 w-full">
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className={`${CSS_CLASSES.INPUT} w-full`}
                            placeholder="Search endpoints..."
                          />
                        </div>
                      </td>
                      <td className="px-2 md:px-4">
                        <div className="relative mt-5 w-full">
                          <button
                            onClick={() => setIsOpenLocation(!isOpenLocation)}
                            className="w-full px-2 border-2 border-customFont text-white bg-transparent text-sm md:text-lg rounded-md overflow-hidden whitespace-nowrap py-2 mb-2 hover:border-gray-300 hover:border-2"
                          >
                            {selectedLocation}
                          </button>
                          {isOpenLocation && (
                            <div className="absolute mt-1 w-full bg-white border-2 border-gray-500 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
                              {jsFiles.map((url, index) => (
                                <LocationItem key={index} url={url} onClick={() => handleSelectLocation(url)} />
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-2 md:px-4">
                        <div className="relative mt-5 w-full">
                          <button
                            onClick={() => setIsOpenWebpage(!isOpenWebpage)}
                            className="w-full px-2 border-2 border-customFont text-white bg-transparent text-sm md:text-lg rounded-md overflow-hidden whitespace-nowrap py-2 mb-2 hover:border-gray-300 hover:border-2"
                          >
                            {selectedWebpage}
                          </button>
                          {isOpenWebpage && (
                            <div className="absolute mt-1 w-full bg-white border-2 border-gray-500 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
                              {webpages.map((url, index) => (
                                <WebpageItem key={index} url={url} onClick={() => handleSelectWebpage(url)} />
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                    {visibleUrls.map((endpoint, index) => (
                      <URLProps key={startIndex + index} endpoint={endpoint} searchQuery={searchQuery} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="text-lg flex items-start space-x-8 px-4 w-full">
            <a href={document.location.origin + "/PopUp/popup.html#urls"} target="_blank" className="text-sm flex flex-col items-center space-x-2 px-5 rounded-md py-3 bg-customFont text-white border-2 border-customFont">WEBPAGE PANEL</a>
            <button className="text-center border-customFont bg-gradient-to-r from-customFont to-customBg text-white text-sm flex items-center px-5 rounded-md py-3" onClick={clearURLs}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="none" stroke="red" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>
              </svg>
            </button>
            <a href={document.location.origin + "/PopUp/popup.html#urls/output"} target="_blank" className="text-sm flex flex-col items-center px-5 rounded-md py-3 bg-customBg border-2 border-customFont text-white">OUTPUT</a>
          </div>
        </div>
      </div>
    </div>
  );
}
