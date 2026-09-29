"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { CloseIcon } from "@/features/view/components/Icons/icons";
import { useModalLifecycle } from "@/features/ViewModel/hooks/modals/useModalLifecycle";
import { ModalFrameProps } from "@/lib/types/components/components";

export function ModalFrame({ title, onClose, children }: ModalFrameProps) {
  
  const titleId = useId();
  const cardRef = useRef<HTMLDivElement>(null);
  useModalLifecycle(onClose);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) {
      return;
    }
    const focusable = card.querySelector<HTMLElement>("input, select, textarea, button");
    focusable?.focus();

    function trap(event: KeyboardEvent) {
      if (event.key !== "Tab" || !card) {
        return;
      }
      const nodes = [...card.querySelectorAll<HTMLElement>("input, select, textarea, button")].filter((node) => !node.hasAttribute("disabled"));
      if (nodes.length === 0) {
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    card.addEventListener("keydown", trap);
    return () => card.removeEventListener("keydown", trap);
  }, []);

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        ref={cardRef}
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id={titleId} className="text-lg font-semibold text-black">
            {title}
          </h2>
          <button type="button" className="icon-button" aria-label="Cerrar" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
