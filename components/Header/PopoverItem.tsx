// components/PopoverItem.tsx
"use client";

import * as Popover from "@radix-ui/react-popover";
import { ReactNode } from "react";

interface Props {
  trigger: ReactNode;
  children: ReactNode;
  isActive: boolean;
  onToggle: () => void;
}

export default function PopoverItem({ trigger, children, isActive, onToggle }: Props) {
  return (
    <Popover.Root open={isActive} onOpenChange={onToggle}>
      <div className="relative z-50">
        <Popover.Trigger asChild>
          {trigger}
        </Popover.Trigger>
      </div>

      {isActive && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 mr-0 transition-opacity" />
      )}

      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={8}
          className="z-50 bg-white border shadow-md rounded-lg p-4 w-[400px]"
        >
          {children}
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
