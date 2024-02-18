import type { Meta, StoryObj } from '@storybook/react';
import { Table } from './index';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof Table> = {
  component: Table,
  title: 'Table',
};
export default meta;
type Story = StoryObj<typeof Table>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to Table!/gi)).toBeTruthy();
  },
};
