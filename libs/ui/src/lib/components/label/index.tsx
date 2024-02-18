import { styled, type HTMLStyledProps, label } from '@nuko/styled-system';

export const Label = styled('label', label);
export type LabelProps = HTMLStyledProps<typeof Label>;
