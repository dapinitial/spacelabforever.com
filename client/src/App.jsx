import { Routes, Route } from 'react-router-dom';
import RequireAuth from './components/RequireAuth/RequireAuth';
import Layout from './components/Layout/Layout';
import Signup from './components/Signup/Signup';
import SignIn from './components/SignIn/SignIn';
import PersistSignIn from './components/PersistSignIn/PersistSignIn';
import NotFound from './pages/NotFound/NotFound';
import ComingSoon from './components/ComingSoon/ComingSoon';
import Error from './pages/Error/Error';
import Unauthorized from './pages/Unauthorized/Unauthorized';
import Homepage from './pages/Homepage/Homepage';
import Editor from './pages/Editor/Editor';
import Admin from './pages/Admin/Admin';
import Lounge from './pages/Lounge/Lounge';
import Contact from './pages/Contact/Contact';
import ContactSuccess from './pages/Contact/ContactSuccess';
import AboutUs from './pages/AboutUs/AboutUs';
import Guestbook from './pages/Guestbook/Guestbook';
import Training from './pages/Training/Training';
import Blog from './pages/Blog/Blog';
import BlogPost from './pages/Blog/BlogPost';
import CreateBlogPost from './pages/Blog/CreateBlogPost';

const ROLES = {
    'User': 2001,
    'Editor': 1984,
    'Admin': 5150
};

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* public routes */}
                <Route path="" element={<Homepage />} />
                <Route path="training" element={<Training />} />
                <Route path="sign-in" element={<SignIn />} />
                <Route path="sign-up" element={<Signup />} />
                <Route path="about-us" element={<AboutUs />} />
                <Route path="guestbook" element={<Guestbook />} />
                <Route path="contact" element={<Contact />} />
                <Route path="contact/success" element={<ContactSuccess />} />
                <Route path="blog" element={<Blog />} />
                <Route path="unauthorized" element={<Unauthorized />} />
                <Route path="error" element={<Error />} />

                {/* we want to protect these routes */}
                <Route element={<PersistSignIn />}>
                    <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
                        <Route path="blog/:id" element={<BlogPost />} />
                    </Route>

                    <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />}>
                        <Route path="editor" element={<Editor />} />
                    </Route>

                    <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                        <Route path="admin" element={<Admin />} />
                    </Route>

                    <Route element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
                        <Route path="blog/create" element={<CreateBlogPost />} />
                        <Route path="lounge" element={<Lounge />} />
                    </Route>
                </Route>

                {/* catch all */}
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default App;