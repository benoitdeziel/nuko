'use client';

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { createStyleContext } from '@shadow-panda/style-context';
import { styled, collapsible } from '@nuko/styled-system';

const { withProvider, withContext } = createStyleContext(collapsible);

export const Collapsible = withProvider(
  styled(CollapsiblePrimitive.Root),
  'root',
);
export const CollapsibleTrigger = withContext(
  styled(CollapsiblePrimitive.CollapsibleTrigger),
  'trigger',
);
export const CollapsibleContent = withContext(
  styled(CollapsiblePrimitive.CollapsibleContent),
  'content',
);
