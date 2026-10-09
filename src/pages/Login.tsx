import { Link } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-white p-4">
      <AuthForm />
      <div className="mt-4 text-center text-sm text-muted-foreground">
        New business?{' '}
        <Link to="/register" className="font-medium text-primary hover:underline">
          Create your DDreamHR workspace
        </Link>
      </div>
    </div>
  );
};

export default Login;
