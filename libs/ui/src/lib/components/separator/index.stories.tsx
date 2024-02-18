import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './index';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof Separator> = {
  component: Separator,
  title: 'Separator',
};
export default meta;
type Story = StoryObj<typeof Separator>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to Separator!/gi)).toBeTruthy();
  },
};
