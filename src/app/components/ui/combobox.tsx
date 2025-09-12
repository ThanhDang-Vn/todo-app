'use client';

import * as React from 'react';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/app/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/app/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { Flag } from 'lucide-react';

const frameworks = [
  {
    value: 'pr1',
    label: 'Priority 1',
    icon: Flag,
    classIcon: 'fill-red-500 text-red-500',
  },
  {
    value: 'pr2',
    label: 'Priority 2',
    icon: Flag,
    classIcon: 'fill-orange-500 text-orange-500',
  },
  {
    value: 'pr3',
    label: 'Priority 3',
    icon: Flag,
    classIcon: 'fill-blue-500 text-blue-500',
  },
  {
    value: 'pr4',
    label: 'Priority 4',
    icon: Flag,
    classIcon: 'fill-gray-200 text-gray-500',
  },
];

export function Combobox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button role='combobox' aria-expanded={open} className='justify-between border-1 border-gray-200 w-60'>
          {value ? (
            <>
              {(() => {
                const selected = frameworks.find((framework) => framework.value === value);
                if (!selected) return null;
                const Icon = selected.icon;
                return (
                  <>
                    <Icon className={'mr-2 h-4 w-4 ' + selected.classIcon} />
                    {selected.label}
                  </>
                );
              })()}
            </>
          ) : (
            'Priority'
          )}
          <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  <CheckIcon className={cn('mr-2 h-4 w-4', value === framework.value ? 'opacity-100' : 'opacity-0')} />

                  {framework.icon && (
                    <framework.icon className={'mr-2 h-4 w-4 text-muted-foreground ' + framework.classIcon} />
                  )}
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
