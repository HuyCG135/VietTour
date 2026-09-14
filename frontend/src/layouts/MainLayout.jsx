import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatWidget from '../features/chat/ChatWidget';

export default function MainLayout() {
     return (
          <>
               <Header />
               <main>
                    <Outlet />
               </main>
               <Footer />
               <ChatWidget />
          </>
     );
}
