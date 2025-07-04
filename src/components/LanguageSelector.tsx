import React from 'react';
import styles from './LanguageSelector.module.scss';

export type Language = 'English' | 'French' | 'Chinese (Simplified)' | 'Chinese (Traditional)';

interface LanguageSelectorProps {
  label: string;
  value: Language;
  onChange: (lang: Language) => void;
}

const languages: Language[] = ['English', 'French', 'Chinese (Simplified)', 'Chinese (Traditional)'];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ label, value, onChange }) => {
  return (
    <div className="w-100 mb-2" style={{ minWidth: 0 }}>
      <label className={styles['language-selector-label']} htmlFor={`lang-select-${label}`}>{label}</label>
      <select
        id={`lang-select-${label}`}
        className={styles['language-selector-select'] + ' form-select w-100 techno-select'}
        value={value}
        onChange={e => onChange(e.target.value as Language)}
        aria-label={label}
        style={{ minWidth: 0 }}
      >
        {languages.map(lang => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>
    </div>
  );
};
