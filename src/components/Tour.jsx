import React, { useState, useEffect } from "react";

const steps = [
    { selector: ".new-assignments", text: "add your assignment here!" },
    { selector: ".main", text: "main!" },
    { selector: ".collab", text: "collab!" },
    { selector: ".category", text: "category!"},
];

export default function Tour() {
    const [stepIndex, setStepIndex] = useState(0);
    const [isTourActive, setIsTourActive] = useState(true);
    const step = steps[stepIndex];
    const [rect, setRect] = useState(null);
    
    // useEffect(() => {
    //   const el = document.querySelector(step.selector);
    //   if (el) setRect(el.getBoundingClientRect());
    // }, [step]);

    useEffect(() => {
    const el = document.querySelector(step.selector);
    const sidebar = document.querySelector(".sidebar-scroll");

    if (!el) return;

    if (!sidebar || !sidebar.contains(el)) {
        setRect(el.getBoundingClientRect());
        return;
    }

    const sidebarRect = sidebar.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();

      const isVisible =
          elRect.top >= sidebarRect.top &&
          elRect.bottom <= sidebarRect.bottom;

      if (!isVisible) {
          sidebar.scrollTo({
              top: el.offsetTop - sidebar.offsetTop - 20,
              behavior: "smooth",
          });

          setTimeout(() => {
              setRect(el.getBoundingClientRect());
          }, 250);
      } else {
          setRect(elRect);
      }
    }, [step]);

    if (!isTourActive || !rect) return null;

    return (
    <>
    <div className="fixed inset-0 z-[999]" style={{ backgroundColor: 'rgba(0,0,0,0.4)', }} />
    <div className="fixed border-2 border-blue-500 rounded-md pointer-events-none z-[1001]" style={{
            top: rect.top + window.scrollY - 6,
            left: rect.left + window.scrollX - 6,
            width: rect.width + 12,
            height: rect.height + 12,
        }}/>

      <div
        className="
          fixed 
          bg-white 
          text-gray-900 
          p-4 
          rounded-lg 
          shadow-lg 
          w-56 
          z-[1000]
        "
        style={{
        top: rect.top + window.scrollY,            
        left: rect.right + window.scrollX + 10 
        }}
      >
        <p className="mb-3">{step.text}</p>

        {stepIndex < steps.length - 1 ? (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded transition"
            onClick={() => setStepIndex((i) => i + 1)}
          >
            Next
          </button>
        ) : (
          <button
            className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded transition"
            onClick={() => setIsTourActive(false)}
          >
            Finish
          </button>
        )}
      </div>
    </>
  );
}