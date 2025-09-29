import React from "react";

export default function page() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden ">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-primary pointer-events-none" />
      <div className="absolute top-1/4 -right-32 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      Hello
    </div>
  );
}
