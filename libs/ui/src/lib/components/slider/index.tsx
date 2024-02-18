'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cx, slider, styled } from '@nuko/styled-system';

const BaseSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const styles = slider();

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cx(styles.root, className)}
      {...props}
    >
      <SliderPrimitive.Track className={styles.track}>
        <SliderPrimitive.Range className={styles.range} />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className={styles.thumb} />
    </SliderPrimitive.Root>
  );
});
BaseSlider.displayName = SliderPrimitive.Root.displayName;

export const Slider = styled(BaseSlider);
