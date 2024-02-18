import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './index';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof Switch> = {
  component: Switch,
  title: 'Switch',
};
export default meta;
type Story = StoryObj<typeof Switch>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to Switch!/gi)).toBeTruthy();
  },
};
