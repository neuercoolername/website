import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DomElementInfo {
  tagName: string;
  id?: string;
  className?: string;
  selector: string;
  position?: { x: number; y: number };
  attributes?: Record<string, string>;
}

export interface InteractionDetails {
  eventType?: string;
  coordinates?: { clientX: number; clientY: number };
  key?: string;
  code?: string;
  domElement?: DomElementInfo;
  currentTarget?: DomElementInfo;
  userAgent?: string;
  viewport?: { width: number; height: number };
}

interface ConsoleMessage {
  id: string;
  content: string;
  type: 'system' | 'personal' | 'interaction';
  timestamp: number;
  details?: InteractionDetails;
}

interface ConsoleState {
  messages: ConsoleMessage[];
  isExpanded: boolean;
  isVisible: boolean;
  personalFragments: string[];
  lastFragmentTime: number;
}

const personalFragments = [
  'Poisoning this log with a few personal fragments to test the console functionality.',
  'Poisining this log with boring personal fragments',
  'Poisoning this log with contextual fragments to enhance user experience.',
  'Poisoning this log with data to test performance',
  'Poisoning this log with everything I can think of',
  'Poisoning this log with boring messages is a crime against humanity.',
  'Poisoning this log with xssential messages',
  'Poisoning this log with garbage data is a crime against humanity.',
  'Poisoning this log with overly personal fragments is not a good idea.',
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
    addMessage: (
      state,
      action: PayloadAction<Omit<ConsoleMessage, 'id' | 'timestamp'>>
    ) => {
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
      if (now - state.lastFragmentTime > 60000) {
        const fragment =
          state.personalFragments[
            Math.floor(Math.random() * state.personalFragments.length)
          ];
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
  clearMessages,
} = consoleSlice.actions;

export default consoleSlice.reducer;
