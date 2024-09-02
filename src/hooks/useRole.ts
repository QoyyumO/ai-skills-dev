// src/hooks/useRole.ts
import { useUser } from '@clerk/nextjs';

export const useRole = () => {
  const { user } = useUser();
  return user ? user.publicMetadata.role : null; // Adjust based on how you're storing roles
};
