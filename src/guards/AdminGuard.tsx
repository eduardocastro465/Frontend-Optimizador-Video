// // import { useAuthStore } from '../store/authStore';
// import { Navigate }    from 'react-router-dom';

// export function AdminGuard({ children }: { children: React.ReactNode }) {
//   const { user } = useAuthStore();
//   if (!user) return <Navigate to='/login' />;
//   if (user.role !== 'admin') return <Navigate to='/unauthorized' />;
//   return <>{children}</>;
// }
