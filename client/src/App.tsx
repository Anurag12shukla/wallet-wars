import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RobinhoodProvider } from './context/RobinhoodProvider';
import { GameProvider } from './context/GameContext';
import ErrorBoundary from './components/shared/ErrorBoundary';
import Layout from './layouts/Layout';
import LoadingScreen from './components/shared/LoadingScreen';

// Core pages directly loaded for 100% resilient rendering on production CDN
import HomePage from './pages/HomePage';
import ArenaPage from './pages/ArenaPage';
import WarriorPage from './pages/WarriorPage';
import BattlePage from './pages/BattlePage';
import LeaderboardPage from './pages/LeaderboardPage';
import AchievementsPage from './pages/AchievementsPage';
import ShareBattlePage from './pages/ShareBattlePage';
import HowItWorksPage from './pages/HowItWorksPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ErrorBoundary>
      <RobinhoodProvider>
        <GameProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingScreen message="LOADING ARENA..." />}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/arena" element={<ArenaPage />} />
                  <Route path="/warrior/:wallet" element={<WarriorPage />} />
                  <Route path="/battles/:battleId" element={<BattlePage />} />
                  <Route path="/share/battle/:battleId" element={<ShareBattlePage />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                  <Route path="/achievements" element={<AchievementsPage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </GameProvider>
      </RobinhoodProvider>
    </ErrorBoundary>
  );
}

export default App;
