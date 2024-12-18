import { useState, useEffect } from 'react';

function generateUserColor(userId: string) {
  // Create a consistent color based on the user ID
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 80%)`;
}

export function useUserColor(userId: string) {
  const [userColor, setUserColor] = useState(() => generateUserColor(userId));

  useEffect(() => {
    // Regenerate color if userId changes
    setUserColor(generateUserColor(userId));
  }, [userId]);

  return userColor;
}