import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "input", 
  error, 
  className, 
  children,
  required = false,
  ...props 
}) => {
  const renderField = () => {
    switch (type) {
      case "select":
        return <Select {...props}>{children}</Select>;
      case "textarea":
        return <Textarea {...props} />;
      default:
        return <Input type={type} {...props} />;
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={props.id}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {renderField()}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FormField;