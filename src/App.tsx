import Register from './components/Register'
import Login from './components/Login'
import Home from './components/Home'
import ProtectedRoute from './components/ProtectedRoute'
import { Routes, Route } from 'react-router-dom';
import { UserContextProvider } from './contexts/UserContext'
import UploadPage from './components/UploadPage'
import View from './components/View';

function App() {
  return (
    <main className="text-gray-900">
      <UserContextProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/view/:id' element={<View />} />
          <Route path='/upload' element={
            <ProtectedRoute mustBeLoggedIn={true} redirectPath="/login" outlet={<UploadPage />} />
          } />
          <Route path='/register' element={
            <ProtectedRoute mustBeLoggedIn={false} redirectPath="/" outlet={<Register />} />
          } />
          <Route path='/login' element={
            <ProtectedRoute mustBeLoggedIn={false} redirectPath="/" outlet={<Login />} />
          } />
        </Routes>
      </UserContextProvider>
    </main>
  );
}

export default App;
