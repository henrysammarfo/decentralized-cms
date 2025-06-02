import { SuiProviders } from '@/services/sui';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from '@/pages/DashboardPage'; // Default import
import EditorPage from '@/pages/EditorPage';       // Default import
import HomePage from '@/pages/HomePage';           // Default import
import SitePage from '@/pages/SitePage';           // Default import

function App() {
  return (
    <SuiProviders>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/site/:siteId" element={<SitePage />} />
          <Route path="/site/:siteId/:pageSlug" element={<SitePage />} />
        </Routes>
      </Router>
    </SuiProviders>
  );
}

export default App;