import '../src/index.css';
import type { Preview } from '@storybook/react-vite'

const preview: Preview = {
  parameters: {
    actions: {
      argTypesRegex: '^on[A-Z].*',
    },

    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    backgrounds: {
      default: 'surface',
      values: [
        { name: 'surface', value: '#F3F3F2' },
        { name: 'white', value: '#FFFFFF' },
        { name: 'dark', value: '#171717' },
      ],
    },

    viewport: {
      defaultViewport: 'responsive',
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;