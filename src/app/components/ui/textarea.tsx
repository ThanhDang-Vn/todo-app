import * as React from 'react';
import { Button } from '@/app/components/ui/button';
import { AlignLeft } from 'lucide-react';

interface TextareaProps {
  value: string;
  label: string;
  onChange: (value: string) => void;
}

function Textarea({ value, label, onChange }: TextareaProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [showActionButton, setShowActionButton] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowActionButton(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleSave = () => {
    setShowActionButton(false);
  };

  const handleCancel = () => {
    setShowActionButton(false);
  };

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  const inputClasses = `
    w-full px-4 pt-10 pb-2 rounded-lg outline-none transition-all duration-̉200 resize-none font-sans text-sm overflow-hidden
    ${isFocused ? 'border-gray-300 border-1' : 'border-gray-200'}
  `;

  const labelClasses = `
    left-4 transition-all duration-200 pointer-events-none top-2 text-sm transform -translate-y-0
  `;

  return (
    <div className='w-full max-w-4xl mx-auto py-3 pr-3'>
      <div className='relative'>
        <div className='flex items-start gap-2 text-gray-500 absolute pl-4 pt-2'>
          <AlignLeft size={20} />
          <label className={labelClasses}>{label}</label>
        </div>
        <textarea
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={inputClasses}
          ref={textareaRef}
          rows={2}
          spellCheck='false'
        />
      </div>

      {showActionButton && (
        <div className='flex justify-end gap-3 mt-2 slide-down'>
          <Button
            onClick={handleCancel}
            size={'icon'}
            className='px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 font-medium w-15'
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            size={'icon'}
            className='px-6 py-2 text-white bg-slate-700 hover:bg-slate-800 transition-colors duration-200 font-medium'
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
}

export { Textarea };
