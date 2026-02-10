import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ToolsPage from './pages/ToolsPage'
import ToolDetail from './pages/ToolDetail'
import ReviewsPage from './pages/ReviewsPage'
import ReviewDetail from './pages/ReviewDetail'
import BlogPage from './pages/BlogPage'
import BlogPost from './pages/BlogPost'
import CategoryPage from './pages/CategoryPage'
import About from './pages/About'
import Contact from './pages/Contact'
import SearchPage from './pages/SearchPage'
import GuidesPage from './pages/GuidesPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/tools/:slug" element={<ToolDetail />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/reviews/:slug" element={<ReviewDetail />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/guides" element={<GuidesPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<SearchPage />} />
      </Route>
    </Routes>
  )
}
