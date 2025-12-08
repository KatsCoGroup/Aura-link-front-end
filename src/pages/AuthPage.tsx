import Auth from '@/components/Auth';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate('/');
  };

  return <Auth initialStep="login" onAuthSuccess={handleAuthSuccess} />;
};

export default AuthPage;
