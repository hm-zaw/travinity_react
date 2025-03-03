import React from 'react'

import { useChatStore } from './store/useChatStore';

import NoChatSelected from './NoChatSelected';
import ChatContainer from './ChatContainer';
import Sidebar from './SideBar';
import Navbar from './NavBar';
import { Toaster } from "react-hot-toast";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <>
        <Navbar />
        <div className="h-screen bg-base-200">
        <div className="flex items-center justify-center pt-20 ">
            <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
            <div className="flex h-full rounded-lg overflow-hidden">
                <Sidebar />

                {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>
            </div>
        </div>
        </div>
        <Toaster />
    </>
  );
};
export default HomePage;