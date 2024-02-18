import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from '.';
import { css } from '@nuko/styled-system';

const meta = {
  title: 'Example/Alert',
  component: Alert,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className={css({ m: 10 })}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Hello 🐼!',
  },
};
