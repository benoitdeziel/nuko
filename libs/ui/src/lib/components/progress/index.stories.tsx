import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './index';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof Progress> = {
  component: Progress,
  title: 'Progress',
};
export default meta;
type Story = StoryObj<typeof Progress>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to Progress!/gi)).toBeTruthy();
  },
};
