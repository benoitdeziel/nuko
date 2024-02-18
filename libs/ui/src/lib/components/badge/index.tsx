import { styled, type HTMLStyledProps, badge } from '@nuko/styled-system';

export const Badge = styled('div', badge);

export type BadgeProps = HTMLStyledProps<typeof Badge>;
