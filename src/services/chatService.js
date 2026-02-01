import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  serverTimestamp,
  limit
} from 'firebase/firestore';
import { db } from '../config/firebase';

const CHATS_COLLECTION = 'chats';

// Create a new chat session
export const createChat = async (userId, title = 'New Chat') => {
  try {
    const chatData = {
      userId,
      title,
      messages: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, CHATS_COLLECTION), chatData);
    return { id: docRef.id, ...chatData };
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};

// Get all chats for a user
export const getUserChats = async (userId) => {
  try {
    const q = query(
      collection(db, CHATS_COLLECTION),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const chats = [];
    
    querySnapshot.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() });
    });
    
    return chats;
  } catch (error) {
    console.error('Error getting user chats:', error);
    throw error;
  }
};

// Get a specific chat by ID
export const getChat = async (chatId) => {
  try {
    const docRef = doc(db, CHATS_COLLECTION, chatId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Chat not found');
    }
  } catch (error) {
    console.error('Error getting chat:', error);
    throw error;
  }
};

// Update chat messages
export const updateChatMessages = async (chatId, messages) => {
  try {
    const chatRef = doc(db, CHATS_COLLECTION, chatId);
    
    // Generate title from first user message if it's a new chat
    let updateData = {
      messages,
      updatedAt: serverTimestamp(),
    };
    
    // Auto-generate title from first message if still "New Chat"
    const chatDoc = await getDoc(chatRef);
    if (chatDoc.exists()) {
      const chatData = chatDoc.data();
      if (chatData.title === 'New Chat' && messages.length > 0) {
        const firstUserMsg = messages.find(m => m.role === 'user');
        if (firstUserMsg) {
          const title = firstUserMsg.content.slice(0, 50) + (firstUserMsg.content.length > 50 ? '...' : '');
          updateData.title = title;
        }
      }
    }
    
    await updateDoc(chatRef, updateData);
  } catch (error) {
    console.error('Error updating chat messages:', error);
    throw error;
  }
};

// Update chat title
export const updateChatTitle = async (chatId, title) => {
  try {
    const chatRef = doc(db, CHATS_COLLECTION, chatId);
    await updateDoc(chatRef, {
      title,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating chat title:', error);
    throw error;
  }
};

// Delete a chat
export const deleteChat = async (chatId) => {
  try {
    await deleteDoc(doc(db, CHATS_COLLECTION, chatId));
  } catch (error) {
    console.error('Error deleting chat:', error);
    throw error;
  }
};

// Get recent chats (for sidebar)
export const getRecentChats = async (userId, limitCount = 10) => {
  try {
    const q = query(
      collection(db, CHATS_COLLECTION),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const chats = [];
    
    querySnapshot.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() });
    });
    
    return chats;
  } catch (error) {
    console.error('Error getting recent chats:', error);
    throw error;
  }
};
