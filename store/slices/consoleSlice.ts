import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConsoleMessage {
  id: string;
  content: string;
  type: 'system' | 'personal' | 'interaction';
  timestamp: number;
}

interface ConsoleState {
  messages: ConsoleMessage[];
  isExpanded: boolean;
  isVisible: boolean;
  personalFragments: string[];
  lastFragmentTime: number;
}

const personalFragments = [
  'placeholder fragment 1',
  'placeholder fragment 2', 
  'placeholder fragment 3',
  'placeholder fragment 4',
  'placeholder fragment 5'
];

const initialState: ConsoleState = {
  messages: [],
  isExpanded: false,
  isVisible: true,
  personalFragments,
  lastFragmentTime: 0,
};

const consoleSlice = createSlice({
  name: 'console',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Omit<ConsoleMessage, 'id' | 'timestamp'>>) => {
      const message: ConsoleMessage = {
        ...action.payload,
        id: `msg-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
      };
      state.messages.push(message);
      
      // Keep only last 50 messages for performance
      if (state.messages.length > 50) {
        state.messages = state.messages.slice(-50);
      }
    },
    addPersonalFragment: (state) => {
      const now = Date.now();
      // Only add if enough time has passed (prevent spam)
      if (now - state.lastFragmentTime > 30000) {
        const fragment = state.personalFragments[Math.floor(Math.random() * state.personalFragments.length)];
        const message: ConsoleMessage = {
          id: `fragment-${now}`,
          content: fragment,
          type: 'personal',
          timestamp: now,
        };
        state.messages.push(message);
        state.lastFragmentTime = now;
      }
    },
    toggleExpanded: (state) => {
      state.isExpanded = !state.isExpanded;
    },
    setVisible: (state, action: PayloadAction<boolean>) => {
      state.isVisible = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { 
  addMessage, 
  addPersonalFragment, 
  toggleExpanded, 
  setVisible, 
  clearMessages 
} = consoleSlice.actions;

export default consoleSlice.reducer;