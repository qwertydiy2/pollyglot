import React from 'react';

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <label style={{ display: 'block', margin: '1em 0' }}>
    {label}
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{ width: '100%', fontSize: '1em', marginTop: '0.5em' }}
    />
  </label>
);
