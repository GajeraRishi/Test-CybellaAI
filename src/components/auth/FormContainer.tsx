import React, { ReactNode } from "react";

interface FormContainerProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const FormContainer = ({ title, subtitle, children }: FormContainerProps) => {
  return (
    <div className="max-w-md mx-auto bg-white/20 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/30">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        <p className="text-white/80">{subtitle}</p>
      </div>
      {children}
    </div>
  );
};

export default FormContainer;
