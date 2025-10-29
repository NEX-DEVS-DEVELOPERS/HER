import { Routes, Route } from 'react-router-dom';
 
import Home from './pages/Home.jsx';
import ComfortSpace from './pages/ComfortSpace.jsx';
import Favorites from './pages/Favorites.jsx';
import Layout from './components/Layout.jsx';
import Clipboard from './pages/Clipboard.jsx';
import Admin from './pages/Admin.jsx';
import Calendar from './pages/Calendar.jsx';
import Music from './pages/Music.jsx';
import MeetingInvitation from './components/MeetingInvitation.jsx';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="comfort" element={<ComfortSpace />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="clipboard" element={<Clipboard />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="music" element={<Music />} />
        <Route path="invitations" element={<MeetingInvitation />} />
        <Route path="admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}

export default App;

