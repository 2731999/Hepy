import Home from "./Pages/Home";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Verification from "./Pages/Verification";
import ProfileDetail from "./Pages/ProfileDetail";
import Notification from "./Pages/Notification";
import AboutMePage from './Pages/AboutMePage';
import Passion from './Pages/Passion';
import InviteFriends from "./Pages/InviteFriends";
import MorePhotos from "./Pages/MorePhotos";
import QuestionsPage from "./Pages/QuestionsPage";
import Messages from "./Pages/Messages";
import Self from "./Pages/Self";
import FriendPage from "./Pages/FriendPage";
import LikesAndSuperLikes from "./Pages/LikesAndSuperLikes";
import Discover from "./Pages/Discover";
import { useCookies } from "react-cookie"


const App = ({ user }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['user'])

  const authToken = cookies.AuthToken

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/Verification" element={<Verification />}/>
        {/* {authToken && <Route path="/Verification" element={<Verification />} />} */}
        {authToken &&<Route path="/ProfileDetail" element={<ProfileDetail />} />}
        {authToken && <Route path="/Notification" element={<Notification />} />}
        {authToken && <Route path="/AboutMePage" element={<AboutMePage />} />}
        {authToken && <Route path="/Passion" element={<Passion />} />}
        {authToken && <Route path="/MorePhotos" element={<MorePhotos />} />}
        {authToken && <Route path="/InviteFriends" element={<InviteFriends />} />}
        {authToken && <Route path="/QuestionsPage" element={<QuestionsPage />} />}
        {authToken && <Route path="/Messages" element={<Messages />} />}
        {authToken && <Route path="/Self" element={<Self />} />}
        {authToken && <Route path="/FriendPage" element={<FriendPage />} />}
        {authToken && <Route path="/LikesAndSuperLikes" element={<LikesAndSuperLikes />} />}
        {authToken && <Route path="/Discover" element={<Discover />} />}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
