'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/app/components/ui/button';
import { Calendar } from '@/app/components/ui/calendar';
import { Input } from '@/app/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import clsx from 'clsx';
function formatDate(date: Date | undefined) {
  if (!date) {
    return '';
  }

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

type DatePickerProps = {
  value?: Date;
  onChange?: (date: Date) => void;
  className?: string;
};

export function DatePicker({ value, onChange, className }: DatePickerProps) {
  const today = new Date();

  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date>(value ?? today);
  const [month, setMonth] = React.useState<Date>(date);
  const [inputValue, setInputValue] = React.useState(formatDate(date));

  const handleSelect = (selectedDate?: Date) => {
    const finalDate = selectedDate ?? today;
    setDate(finalDate);
    setInputValue(formatDate(finalDate));
    setOpen(false);
    onChange?.(finalDate);
  };

  return (
    <div className='flex flex-col gap-3'>
      <div className={clsx('flex gap-2 max-w-200 min-w-40 relative round-lg', className)}>
        <Input
          id='date'
          value={inputValue}
          className='pr-10 border-gray-200'
          onChange={(e) => {
            const d = new Date(e.target.value);
            setInputValue(e.target.value);
            if (isValidDate(d)) {
              setDate(d);
              setMonth(d);
              onChange?.(d);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button id='date-picker' variant='ghost' className='absolute top-1/2 right-2 size-6 -translate-y-1/2'>
              <CalendarIcon className='size-3.5' />
              <span className='sr-only'>Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto overflow-hidden p-0 bg-white' align='end' alignOffset={-15} sideOffset={10}>
            <Calendar
              mode='single'
              selected={date}
              captionLayout='dropdown'
              month={month}
              onMonthChange={setMonth}
              onSelect={handleSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
