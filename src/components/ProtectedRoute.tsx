import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext'

export type ProtectedRouteProps = {
  mustBeLoggedIn: boolean;
  redirectPath: string;
  outlet: JSX.Element;
};

export default function ProtectedRoute({ mustBeLoggedIn, redirectPath, outlet }: ProtectedRouteProps) {
  const { isUserLoggedIn } = useContext(UserContext);
  const isLogged = isUserLoggedIn;
  if ((mustBeLoggedIn && isLogged) || (!mustBeLoggedIn && !isLogged)) {
    return outlet;
  }
  else {
    return <Navigate to={{ pathname: redirectPath }} />;
  }
};
