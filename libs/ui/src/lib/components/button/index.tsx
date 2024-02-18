import { ReactNode } from 'react';
import { css } from '@nuko/styled-system';

export interface IButtonProps {
  children: ReactNode;
}

export const Button = ({ children }: IButtonProps) => {
  return (
    <button
      className={css({
        bg: 'red',
        fontFamily: 'Inter',
        px: '4',
        py: '3',
        borderRadius: 'md',
        _hover: { bg: 'blue' },
      })}
    >
      {children}
    </button>
  );
};
