"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { CloseIcon } from "@/features/view/components/Icons/icons";
import { useModalLifecycle } from "@/features/ViewModel/hooks/modals/useModalLifecycle";
import { ModalFrameProps } from "@/lib/types/components/components";

export function ModalFrame({ title, onClose, children, wide = false, roomy = false, headerExtra }: ModalFrameProps) {
  
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
        className={wide ? "modal-card modal-card-wide" : roomy ? "modal-card modal-card-roomy" : "modal-card"}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 id={titleId} className="text-xl font-semibold text-[var(--color-text-primary)]">
            {title}
          </h2>
          <div className="flex items-center gap-2">
            {headerExtra}
            <button type="button" className="icon-button bg-[var(--color-surface-muted)]" aria-label="Cerrar" onClick={onClose}>
              <CloseIcon />
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
