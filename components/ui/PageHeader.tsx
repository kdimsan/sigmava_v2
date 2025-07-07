import React from "react";

export default function PageHeader({title, subtitle, className}: {title: string; subtitle: string; className?: string;}) {
  return (
    <div className={`mt-12 mb-8 ${className}`}>
      <h1 className="text-xl font-bold text-blue-600">{title}</h1>
      <p className="text-gray-500 text-xl font-normal">{subtitle}</p>
    </div>
  );
}
