import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import TopNavbar from '../components/TopNavbar';
import SmallMovie from '../components/SmallMovie';
import CustomPagination from '../components/CustomPagination';
import { useGetPersonDetailsQuery, useGetPersonCombinedCreditsQuery } from '../services/personApi';

const Person = () => {
  const { personId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [hoveredValue, setHoveredValue] = useState(null);
  const [showFullBio, setShowFullBio] = useState(false);
  const [activeTab, setActiveTab] = useState('cast');
  const moviesPerPage = 10;
  const previousPersonIdRef = useRef(null);
  
  const currentPage = parseInt(searchParams.get('page')) || 1;
  
  const { data: personDetails, isLoading, error } = useGetPersonDetailsQuery(personId);
  const { data: combinedCredits, isLoading: creditsLoading } = useGetPersonCombinedCreditsQuery(personId);
  
  // Set default tab based on which has more credits
  const defaultTab = useMemo(() => {
    if (!combinedCredits) return 'cast';
    const castCount = combinedCredits?.cast?.length || 0;
    const crewCount = combinedCredits?.crew?.length || 0;
    return castCount >= crewCount ? 'cast' : 'crew';
  }, [combinedCredits]);
  
  // Update active tab when data loads or person changes
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [personId]);
  
  // Reset to page 1 when person changes
  useEffect(() => {
    if (previousPersonIdRef.current !== null && previousPersonIdRef.current !== personId) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('page');
      setSearchParams(newSearchParams);
    }
    previousPersonIdRef.current = personId;
  }, [personId, searchParams, setSearchParams]);
  
  // Calculate pagination for combined credits (movies and TV shows)
  // Process cast credits
  const uniqueCastCredits = combinedCredits?.cast ? 
    [...combinedCredits.cast].filter((credit, index, array) => 
      array.findIndex(c => c.id === credit.id) === index
    ) : [];
  const sortedCastCredits = uniqueCastCredits.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
  
  // Process crew credits
  const uniqueCrewCredits = combinedCredits?.crew ? 
    [...combinedCredits.crew].filter((credit, index, array) => 
      array.findIndex(c => c.id === credit.id) === index
    ) : [];
  const sortedCrewCredits = uniqueCrewCredits.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
  
  // Get current tab's data
  const currentTabCredits = activeTab === 'cast' ? sortedCastCredits : sortedCrewCredits;
  const totalCredits = currentTabCredits.length;
  const totalPages = Math.ceil(totalCredits / moviesPerPage);
  const startIndex = (currentPage - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  const currentCredits = currentTabCredits.slice(startIndex, endIndex);
  
  const displayPerson = personDetails;
  const loading = isLoading || creditsLoading;

  if (error) {
    return (
      <div className="bg-black navbarMargin pb-3">
        <TopNavbar />
        <div className="container mx-auto px-3 px-sm-0 py-5 text-center">
          <div className="fs-2 text-white mb-2">Person not found</div>
          <div className="text-muted">The person you're looking for doesn't exist or has been removed.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black navbarMargin pb-3">
      <TopNavbar />

      {loading ? (
        <div className="spinnerContainer">
          <Spinner animation="border" variant="danger" />
        </div>
      ) : (
        <div className="container mx-auto px-3 px-sm-0 py-4">
          <div className="d-flex flex-column flex-md-row gap-4 mb-4">
            <div className="flex-shrink-0 text-center text-md-start">
              {displayPerson?.profile_path ? (
                <img 
                  src={`https://image.tmdb.org/t/p/w300${displayPerson.profile_path}`} 
                  alt={displayPerson.name} 
                  className="rounded" 
                  style={{ 
                    width: '150px', 
                    height: '225px', 
                    objectFit: 'cover' 
                  }}
                  media="(max-width: 767px)"
                />
              ) : (
                <div 
                  className="d-flex align-items-center justify-content-center text-center p-3 rounded mx-auto mx-md-0" 
                  style={{ 
                    width: '150px', 
                    height: '225px', 
                    backgroundColor: '#555' 
                  }}
                >
                  <div>
                    <div className="fw-bold mb-2">{displayPerson?.name}</div>
                    <div className="text-muted small">No Photo Available</div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex-grow-1">
              <h1 className="fs-1 fs-sm-2 mb-3 text-center text-md-start">{displayPerson?.name}</h1>
              
              <div className="text-center text-md-start">
                {displayPerson?.known_for_department && (
                  <div className="mb-2">
                    <span className="text-lightgray me-2">Known for:</span>
                    <span>{displayPerson.known_for_department}</span>
                  </div>
                )}
                
                {displayPerson?.birthday && (
                  <div className="mb-2">
                    <span className="text-lightgray me-2">Born:</span>
                    <span>{new Date(displayPerson.birthday).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                    {displayPerson?.place_of_birth && (
                      <span className="text-muted"> in {displayPerson.place_of_birth}</span>
                    )}
                  </div>
                )}
              </div>
              
              {displayPerson?.biography && (
                <div className="mb-3">
                  <h3 className="fs-3 fs-sm-4 mb-2 text-center text-md-start">Biography</h3>
                  <p className="text-muted mb-1" style={{ fontSize: '0.9rem', lineHeight: '1.5', textAlign: 'justify' }}>
                    {showFullBio 
                      ? displayPerson.biography
                      : `${displayPerson.biography.substring(0, 300)}${displayPerson.biography.length > 300 ? '...' : ''}`
                    }
                  </p>
                  {displayPerson.biography.length > 300 && (
                    <div className="text-center text-md-start">
                      <button 
                        className="btn btn-link text-primary p-0 text-decoration-none fw-bold"
                        onClick={() => setShowFullBio(!showFullBio)}
                        style={{ fontSize: '0.9rem' }}
                      >
                        {showFullBio ? 'Read Less' : 'Read More'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {(combinedCredits?.cast?.length > 0 || combinedCredits?.crew?.length > 0) && (
            <div id="movies-tv-section">
              <h2 className="fs-2 mb-3">Movies & TV Shows</h2>
              
              {/* Tabs */}
              <div className="mb-4">
                <nav className="nav nav-tabs">
                  <button 
                    className={`nav-link ${activeTab === 'cast' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('cast');
                      // Reset to page 1 when switching tabs
                      const newSearchParams = new URLSearchParams(searchParams);
                      newSearchParams.delete('page');
                      setSearchParams(newSearchParams);
                    }}
                    style={{ 
                      backgroundColor: activeTab === 'cast' ? '#E50914' : 'transparent',
                      borderColor: activeTab === 'cast' ? '#E50914' : '#6c757d',
                      color: activeTab === 'cast' ? 'white' : '#6c757d'
                    }}
                  >
                    As Cast ({sortedCastCredits.length})
                  </button>
                  <button 
                    className={`nav-link ${activeTab === 'crew' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('crew');
                      // Reset to page 1 when switching tabs
                      const newSearchParams = new URLSearchParams(searchParams);
                      newSearchParams.delete('page');
                      setSearchParams(newSearchParams);
                    }}
                    style={{ 
                      backgroundColor: activeTab === 'crew' ? '#E50914' : 'transparent',
                      borderColor: activeTab === 'crew' ? '#E50914' : '#6c757d',
                      color: activeTab === 'crew' ? 'white' : '#6c757d'
                    }}
                  >
                    As Crew ({sortedCrewCredits.length})
                  </button>
                </nav>
              </div>

              {totalCredits > 0 ? (
                <>
                  <div className="smallMoviesGrid">
                    {currentCredits.map((credit) => {
                      const roleInfo = activeTab === 'cast' 
                        ? credit.character 
                        : credit.job;
                      
                      return (
                        <SmallMovie 
                          key={`${credit.id}-${credit.media_type}-${activeTab}`} 
                          movie={credit} 
                          hoveredValue={hoveredValue} 
                          setHoveredValue={setHoveredValue}
                          roleInfo={roleInfo}
                        />
                      );
                    })}
                  </div>
                  
                  {totalPages > 1 && (
                    <CustomPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalResults={totalCredits}
                      resultsPerPage={moviesPerPage}
                      onPageChange={(newPage) => {
                        const newSearchParams = new URLSearchParams(searchParams);
                        if (newPage === 1) {
                          newSearchParams.delete('page');
                        } else {
                          newSearchParams.set('page', newPage.toString());
                        }
                        setSearchParams(newSearchParams);
                        
                        // Scroll to Movies & TV Shows section
                        const moviesSection = document.querySelector('#movies-tv-section h2');
                        if (moviesSection) {
                          const offsetPosition = moviesSection.offsetTop - 70;
                          window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                          });
                        }
                      }}
                      className="mt-3"
                    />
                  )}
                </>
              ) : (
                <div className="text-center py-5">
                  <div className="text-muted">
                    No {activeTab === 'cast' ? 'acting' : 'crew'} credits found
                  </div>
                </div>
              )}
            </div>
          )}
          
          {creditsLoading && (
            <div className="text-center p-4">
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading credits...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Person;