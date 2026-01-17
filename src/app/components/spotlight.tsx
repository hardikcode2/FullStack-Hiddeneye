"use client";

import { useEffect, useState, useRef } from "react";

export default function Spotlight() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Detect touch devices
    const checkTouchDevice = () => {
      return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore
        navigator.msMaxTouchPoints > 0
      );
    };

    if (checkTouchDevice()) {
      setIsTouchDevice(true);
      return; // Exit early on touch devices
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Use requestAnimationFrame for smooth updates
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }

      rafId.current = requestAnimationFrame(() => {
        // Always update mouse position
        setMousePosition({ x: e.clientX, y: e.clientY });
        
        // Check if the element under cursor contains text
        const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
        
        if (elementUnderCursor) {
          // Get text content from the element and its children
          const textContent = elementUnderCursor.textContent?.trim() || '';
          
          // Check if it's an interactive element (buttons, links, inputs, etc.)
          const tagName = elementUnderCursor.tagName.toLowerCase();
          const isInteractive = 
            tagName === 'button' ||
            tagName === 'input' ||
            tagName === 'select' ||
            tagName === 'textarea' ||
            tagName === 'a' ||
            tagName === 'img' ||
            tagName === 'svg' ||
            elementUnderCursor.closest('button') !== null ||
            elementUnderCursor.closest('a') !== null ||
            elementUnderCursor.closest('input') !== null ||
            elementUnderCursor.getAttribute('role') === 'button';
          
          // Check if it's a background/container element (body, html, empty containers)
          const isBackgroundElement = 
            tagName === 'body' ||
            tagName === 'html';
          
          // Check if element has direct visible text (not just nested elements)
          const hasDirectText = Array.from(elementUnderCursor.childNodes).some(
            node => node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim().length > 0
          );
          
          // Check if it's a text-containing element (p, span, h1-h6, label, li, etc.)
          const isTextElement = ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'label', 'li', 'td', 'th', 'strong', 'em', 'b', 'i', 'small', 'code', 'pre', 'blockquote'].includes(tagName);
          
          // Check if it's just a container div/section without direct text
          const isContainerOnly = ['div', 'section', 'main', 'header', 'footer', 'article', 'aside', 'nav'].includes(tagName) && !hasDirectText && !isTextElement;
          
          // Get computed style to check if it's just a background color element
          const computedStyle = window.getComputedStyle(elementUnderCursor);
          const backgroundColor = computedStyle?.backgroundColor || '';
          const hasOnlyBackground = 
            !hasDirectText && 
            !isTextElement &&
            backgroundColor !== 'rgba(0, 0, 0, 0)' &&
            backgroundColor !== 'transparent' &&
            backgroundColor !== '' &&
            !textContent;
          
          // Only show spotlight effect if:
          // 1. Text content exists
          // 2. Not an interactive element
          // 3. Not a background element (body/html)
          // 4. Not just a container without direct text
          // 5. Not just a background color element
          if (textContent.length > 0 && !isInteractive && !isBackgroundElement && !isContainerOnly && !hasOnlyBackground) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        } else {
          setIsVisible(false);
        }
      });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [isVisible]);

  // Don't render on touch devices
  if (isTouchDevice) {
    return null;
  }

  return (
    <div
      className="spotlight-cursor"
      style={{
        position: "fixed",
        left: `${mousePosition.x}px`,
        top: `${mousePosition.y}px`,
        width: "65px",
        height: "65px",
        borderRadius: "50%",
        background: "white",
        mixBlendMode: "difference",
        pointerEvents: "none",
        transform: "translate(-50%, -50%)",
        transition: "opacity 0.3s ease",
        opacity: isVisible ? 1 : 0,
        zIndex: 9999,
        willChange: "transform",
      }}
    />
  );
}

