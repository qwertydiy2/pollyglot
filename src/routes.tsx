import { Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Grader from './components/Grader';
import Chat from './components/Chat';
import HistoryView from './components/HistoryView';
import Settings from './components/Settings';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/grader" element={<Grader />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/history" element={<HistoryView />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}
