import { styled, HTMLStyledProps, textarea } from '@nuko/styled-system';

export const Textarea = styled('textarea', textarea);
export type TextareaProps = HTMLStyledProps<typeof Textarea>;
