'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { wheelItems, WheelItem } from '@/data/wheelitems';

export default function FortuneWheel() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isSpinning, setIsSpinning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [winningItem, setWinningItem] = useState<WheelItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const wheelRef = useRef<SVGSVGElement>(null);
  const [mounted, setMounted] = useState(false);
  
  // Fix hydration issues by only rendering the wheel client-side
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handlePlay = async () => {
    // If user is not logged in, redirect to sign-up
    if (!user && !isLoading) {
      router.push('/Sign-up');
      return;
    }

    if (isSpinning) return;
    
    setIsSpinning(true);
    setError(null);
    
    try {
      // Send webhook with user UUID through our API route
      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Wait for the response
      const data = await response.json();
      
      // Get the winning item index from the response (1-based index)
      const winningItemIndex = parseInt(data.itemWon || "1", 10);
      const item = wheelItems[winningItemIndex - 1];
      setWinningItem(item);
      
      // Calculate the rotation angle
      // 3600 degrees (10 full rotations) + the offset to land on the winning segment
      const baseRotation = 3600; // 10 full rotations
      const segmentSize = 360 / wheelItems.length; // Size of each segment in degrees
      
      // Calculate the offset to center the winning segment at the top
      // We subtract from 360 because we want to rotate clockwise to position the segment at the top
      const segmentOffset = 360 - ((winningItemIndex - 1) * segmentSize + segmentSize / 2);
      
      const totalRotation = baseRotation + segmentOffset;
      
      // Apply the rotation to the wheel
      if (wheelRef.current) {
        // Use a slightly longer transition time
        wheelRef.current.style.transition = 'transform 5s cubic-bezier(0.32, 0.94, 0.60, 1)';
        wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;
        
        // Listen for the transition end instead of using setTimeout
        const handleTransitionEnd = () => {
          setShowModal(true);
          setIsSpinning(false);
          wheelRef.current?.removeEventListener('transitionend', handleTransitionEnd);
        };
        
        wheelRef.current.addEventListener('transitionend', handleTransitionEnd);
        
        // Add a fallback timeout in case the transition event doesn't fire
        setTimeout(() => {
          if (!showModal) {
            setShowModal(true);
            setIsSpinning(false);
          }
        }, 5500); // Slightly longer than the animation
      }
      
    } catch (err) {
      console.error('Error playing:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsSpinning(false);
    }
  };
  
  const handlePlayAgain = () => {
    setShowModal(false);
    setWinningItem(null);
    
    // Reset the wheel rotation
    if (wheelRef.current) {
      wheelRef.current.style.transition = 'none';
      wheelRef.current.style.transform = 'rotate(0deg)';
    }
  };

  if (!mounted) {
    // Return a placeholder with the same dimensions to prevent layout shift
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="relative mb-8 mx-auto" style={{ width: "80vmin", height: "80vmin", maxWidth: "500px", maxHeight: "500px" }}></div>
        <div style={{ width: '100px', height: '100px' }}></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Circular award/gift wheel using SVG */}
      <div className="relative mb-8 mx-auto overflow-hidden" style={{ width: "80vmin", height: "80vmin", maxWidth: "500px", maxHeight: "500px" }}>
        {/* Golden triangle marker at the top */}
        <div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={{
            width: '30px',
            height: '30px',
            filter: 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.8))',
            transform: 'rotate(180deg)'
          }}
        >
          <svg viewBox="0 0 30 30" width="100%" height="100%">
            <polygon 
              points="15,0 30,30 0,30" 
              fill="gold" 
              stroke="#FFD700" 
              strokeWidth="1"
            />
          </svg>
        </div>
        
        <svg 
          ref={wheelRef}
          viewBox="0 0 320 320" 
          width="100%" 
          height="100%"
          style={{ transformOrigin: 'center' }}
          suppressHydrationWarning
        >
          {/* Circle border */}
          <circle cx="160" cy="160" r="150" fill="var(--win95-gray)" stroke="var(--win95-dark-border)" strokeWidth="2" />
          
          {/* Pie segments */}
          {wheelItems.map((item, index) => {
            // Calculate angles for pie segments
            const startAngle = index * (360 / wheelItems.length);
            const endAngle = (index + 1) * (360 / wheelItems.length);
            
            // Convert angles to radians for calculations
            const startAngleRad = (startAngle - 90) * (Math.PI / 180);
            const endAngleRad = (endAngle - 90) * (Math.PI / 180);
            
            // Calculate points for the pie segment
            const x1 = 160 + 140 * Math.cos(startAngleRad);
            const y1 = 160 + 140 * Math.sin(startAngleRad);
            const x2 = 160 + 140 * Math.cos(endAngleRad);
            const y2 = 160 + 140 * Math.sin(endAngleRad);
            
            // Determine if this is a large arc (0 for < 180 degrees, 1 for >= 180 degrees)
            const largeArcFlag = endAngle - startAngle >= 180 ? 1 : 0;
            
            // Calculate position for the content - move closer to the edge
            const labelAngleRad = (startAngle + (endAngle - startAngle) / 2 - 90) * (Math.PI / 180);
            const labelX = 160 + 110 * Math.cos(labelAngleRad); // Increased from 80 to 110
            const labelY = 160 + 110 * Math.sin(labelAngleRad); // Increased from 80 to 110
            
            // Calculate rotation angle for the text to face outward
            const textRotationAngle = (startAngle + (endAngle - startAngle) / 2);
            
            return (
              <g key={index}>
                {/* Pie segment */}
                <path
                  d={`M 160 160 L ${x1} ${y1} A 140 140 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={item.backgroundColor}
                  stroke="var(--win95-dark-border)"
                  strokeWidth="1"
                />
                
                {/* Content based on item type */}
                {item.type === 'discount' ? (
                  // Discount text
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="black"
                    fontSize="16" // Increased from 14
                    fontWeight="bold"
                    fontFamily="Impact, sans-serif"
                    transform={`rotate(${textRotationAngle}, ${labelX}, ${labelY})`}
                  >
                    {item.discountPercent}%
                  </text>
                ) : (
                  // Product image (using a foreignObject to embed an image)
                  <foreignObject
                    x={labelX - 30} 
                    y={labelY - 30} 
                    width="60"      
                    height="60"     
                    transform={`rotate(${textRotationAngle}, ${labelX}, ${labelY})`}
                  >
                    <div 
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: `rotate(-${textRotationAngle}deg)`, // Counter-rotate to keep image upright
                        position: 'relative' // Add this to ensure proper positioning
                      }}
                    >
                      <img 
                        src={item.imageUrl} 
                        alt={item.name || 'Prize item'}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          position: 'absolute', // Position absolutely within the container
                          top: '50%',          // Center vertically
                          left: '50%',         // Center horizontally
                          transform: 'translate(-50%, -50%)' // Perfect centering technique
                        }}
                      />
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* Play Button */}
      <button 
        className="win95-button px-6 py-2 mx-auto rounded-full"
        onClick={handlePlay}
        disabled={isSpinning}
        style={{ 
          borderRadius: '50%', 
          width: '100px', 
          height: '100px',
          fontSize: '18px',
          fontWeight: 'bold'
        }}
      >
        {isSpinning ? 'Spinning...' : 'Spin'}
      </button>
      
      {/* Error Display */}
      {error && (
        <div className="win95-window mt-4 p-2 max-w-md">
          <div className="win95-title-bar"></div>
          <div className="p-2 bg-white">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}
      
      {/* Result Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 bg-white p-6 rounded-lg shadow-lg win95-window max-w-md w-full overflow-hidden" style={{ margin: '2rem' }}>
            {/* Add the background GIF with invert filter */}
            <div 
              className="absolute inset-0 z-0 opacity-30" 
              style={{
                backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/6/62/Astro_4D_milkyway_stars_proper_radial_all_mid_anim.gif')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "invert(1)",
                pointerEvents: "none"
              }}
            ></div>
            
            {/* Modal content with higher z-index to appear above the background */}
            <div className="relative z-10 ">
              <div className="win95-window-header flex justify-between items-center mb-6">
                <span className="font-bold">YOUR PRIZE 🏆</span>
                <button 
                  onClick={handlePlayAgain} 
                  className="win95-close-button"
                >
                  HOME
                </button>
              </div>
              
              {winningItem && (
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-6" style={{ position: 'relative' }}>
                    <img 
                      src={winningItem.imageUrl} 
                      alt={winningItem.name || 'Your prize'}
                      className="max-w-full"
                      style={{ 
                        maxHeight: '250px',
                        margin: '0 auto', // Center horizontally
                        display: 'block'  // Remove any inline behavior
                      }}
                    />
                  </div>
                  <h2 className="text-2xl font-bold">YOU WON {winningItem.name}</h2>
                  <h3 className="text-md font-bold">check your email to redeem it thanks</h3>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
              <button 
                className="win95-button px-6 py-2"
                onClick={handlePlayAgain}
              >
                Play Again
              </button>
              <button 
                className="win95-button px-6 py-2"
                onClick={() => window.open('https://www.mismatchtown.com/shop', '_blank')}
              >
                Shop Now
              </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 