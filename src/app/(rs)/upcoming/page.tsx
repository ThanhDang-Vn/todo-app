'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu';

import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from '@/app/components/ui/dialog';

import { Checkbox } from '@/app/components/ui/checkbox';
import { DatePicker } from '@/app/components/ui/date-picker';
import { Textarea } from '@/app/components/ui/textarea';
import { Combobox } from '@/app/components/ui/combobox';

import { useState } from 'react';

import { Pencil, Copy, Archive, Trash2, Ellipsis, AlignVerticalSpaceAround, Inbox, ChevronDown } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
const menuItems = [
  { label: 'Edit', icon: Pencil },
  { label: 'Duplicate', icon: Copy },
];

const getWeekRange = (date: Date) => {
  const dayOfWeek = date.getDay();

  const startDate = new Date(date);
  const endDate = new Date(date);

  if (dayOfWeek === 0) {
    startDate.setDate(date.getDate() - 6);
    endDate.setDate(date.getDate());
  }

  startDate.setDate(date.getDate() - dayOfWeek + 1);

  endDate.setDate(date.getDate() + 7 - dayOfWeek);
  return { startDate, endDate };
};

const dateInRange = (date: string, selectedDate: Date) => {
  const dateConver = new Date(date);
  const { startDate, endDate } = getWeekRange(selectedDate);
  return dateConver.getDate() >= startDate.getDate() && dateConver.getDate() <= endDate.getDate();
};

const getDayOfWeek = (dateInput: string | Date): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return days[date.getDay()];
};

const dataTask = [
  {
    id: 1,
    dateAssigned: '2025-09-08',
    cards: [
      {
        id: 1,
        name: 'Listening Practice',
        description: 'Listen to English podcasts for 30 minutes',
        priority: '2',
        tags: ['listening', 'ielts'],
      },
      {
        id: 2,
        name: 'Vocabulary Review',
        description: 'Revise 20 IELTS vocabulary words',
        priority: '1',
        tags: ['vocabulary', 'revision'],
      },
      {
        id: 10,
        name: 'Writing Task 1',
        description: 'Write a report about a given chart',
        priority: '3',
        tags: ['writing', 'ielts'],
      },
      {
        id: 11,
        name: 'Grammar Practice',
        description: 'Do exercises on verb tenses',
        priority: '2',
        tags: ['grammar', 'practice'],
      },
    ],
  },
  {
    id: 2,
    dateAssigned: '2025-09-09',
    cards: [
      {
        id: 3,
        name: 'Reading IELTS',
        description: 'Practice reading articles and books',
        priority: '1',
        tags: ['reading', 'vocabulary'],
      },
    ],
  },
  {
    id: 3,
    dateAssigned: '2025-09-10',
    cards: [
      {
        id: 4,
        name: 'Writing Task 1',
        description: 'Write a report about a given chart',
        priority: '3',
        tags: ['writing', 'ielts'],
      },
      {
        id: 5,
        name: 'Grammar Practice',
        description: 'Do exercises on verb tenses',
        priority: '2',
        tags: ['grammar', 'practice'],
      },
    ],
  },
  {
    id: 4,
    dateAssigned: '2025-09-11',
    cards: [
      {
        id: 6,
        name: 'Speaking Practice',
        description: 'Practice part 2 with a friend',
        priority: '1',
        tags: ['speaking', 'ielts'],
      },
    ],
  },
  {
    id: 5,
    dateAssigned: '2025-09-12',
    cards: [
      {
        id: 13,
        name: 'Writing Task 1',
        description: 'Write a report about a given chart',
        priority: '3',
        tags: ['writing', 'ielts'],
      },
      {
        id: 14,
        name: 'Grammar Practice',
        description: 'Do exercises on verb tenses',
        priority: '2',
        tags: ['grammar', 'practice'],
      },
    ],
  },
  {
    id: 6,
    dateAssigned: '2025-09-13',
    cards: [
      {
        id: 7,
        name: 'Mock Test',
        description: 'Full IELTS mock test under timed conditions',
        priority: '1',
        tags: ['test', 'ielts'],
      },
    ],
  },
  {
    id: 7,
    dateAssigned: '2025-09-14',
    cards: [
      {
        id: 8,
        name: 'Relax and Review',
        description: 'Light review and relaxation activities',
        priority: '3',
        tags: ['relax', 'review'],
      },
    ],
  },
];

const checkboxColor = (priority: string) => {
  switch (priority) {
    case '1':
      return 'outline-red-400 bg-red-100';
    case '2':
      return 'outline-orange-400 bg-orange-100';
    case '3':
      return 'outline-blue-400 bg-blue-100';
    default:
      return 'outline-gray-400 bg-gray-100';
  }
};

const hoverTaskColor = (priority: string) => {
  switch (priority) {
    case '1':
      return 'hover:bg-red-200';
    case '2':
      return 'hover:bg-orange-200';
    case '3':
      return 'hover:bg-blue-200';
    default:
      return 'hover:bg-gray-200';
  }
};

export default function UpcomingPage() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [text, setText] = useState('');

  return (
    <div className='flex flex-col pt-2 px-1 h-full'>
      <div className='flex flex-col h-28 gap-4 px-10'>
        <h5 className='text-2xl font-semibold'>Upcoming {}</h5>
        <DatePicker value={selectedDate} onChange={setSelectedDate} className='w-56' />
      </div>

      <div className='pt-2 border-t border-gray-300' />

      <div className='h-full pl-10'>
        <div className='flex gap-5 px-1 py-4'>
          <div className='px-1 flex justify-start gap-5'>
            {dataTask
              .filter((item) => dateInRange(item.dateAssigned, selectedDate ? selectedDate : today))
              .map((board) => (
                <div key={board.id} className='flex flex-col gap-4 w-[18rem] flex-shrink-0'>
                  <div className='flex items-center justify-between '>
                    <h1 className='text-base font-medium'>
                      {board.dateAssigned} ⦁ {getDayOfWeek(board.dateAssigned)}
                    </h1>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Ellipsis />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className='w-56 border-0 bg-white' align='center'>
                        <DropdownMenuLabel></DropdownMenuLabel>
                        <DropdownMenuGroup className=''>
                          {menuItems.map((item) => (
                            <DropdownMenuItem key={item.label}>
                              <div className='px-1 flex items-center gap-3 mb-1'>
                                <item.icon size={17} />
                                <div className='text-sm font-sans'>{item.label}</div>
                              </div>
                            </DropdownMenuItem>
                          ))}

                          <DropdownMenuSeparator />

                          <DropdownMenuItem>
                            <div className='px-1 flex items-center gap-3 mb-1'>
                              <Archive size={17} />
                              <div className='text-sm font-sans'>Archive</div>
                            </div>
                          </DropdownMenuItem>

                          <DropdownMenuItem>
                            <div className='px-1 flex items-center gap-3 mb-1'>
                              <Trash2 size={17} color='red' />
                              <div className='text-sm font-sans text-red-500'>Delete</div>
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className='grid grid-flow-row gap-4'>
                    {board.cards.map((card) => (
                      <Dialog key={card.id}>
                        <form>
                          <DialogTrigger asChild>
                            <div
                              className={
                                'border-gray-300 border-1 px-4 py-1 rounded-lg h-18 space-y-0.5 transition delay-150 duration-300 ease-in-out focus-within::-translate-y-1 focus-within::scale-105 hover:-translate-y-1 hover:scale-105 ' +
                                hoverTaskColor(card.priority)
                              }
                            >
                              <div className='flex justify-start gap-3'>
                                <div className='py-0.5'>
                                  <Checkbox className={checkboxColor(card.priority)} />
                                </div>
                                <div>
                                  <h1 className='text-base'>{card.name}</h1>
                                  <h1 className='text-xs line-clamp-1 wrap-break-word'>{card.description}</h1>
                                </div>
                              </div>
                            </div>
                          </DialogTrigger>
                          <DialogContent className='min-w-200'>
                            <DialogHeader>
                              <DialogTitle>
                                <div className='px-6'>Inbox</div>
                              </DialogTitle>
                            </DialogHeader>
                            <div className='flex flex-row items-start border-t border-gray-300 min-h-120'>
                              <div className='flex flex-col min-w-130 pl-6 pt-4'>
                                <div className='flex items-center gap-3'>
                                  <Checkbox className={checkboxColor(card.priority)} />
                                  <h2 className='text-xl font-semibold'>{card.name}</h2>
                                </div>

                                <div className='flex flex-col'>
                                  <Textarea value={text} label='Description' onChange={setText} />
                                </div>
                              </div>

                              <div className='flex flex-col min-w-80 bg-gray-100 pl-5 pt-4 h-full'>
                                <div className='space-y-2'>
                                  <div className='text-sm font-sans font-semibold text-gray-500 '>Project</div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button className='min-w-60 border-1 border-gray-200 hover:bg-gray-200'>
                                        <div className=' flex flex-1 items-center justify-between '>
                                          <div className='flex flex-1 items-center font-sans text-gray-600 gap-3'>
                                            <Inbox />
                                            <div className='text-base '>Inbox</div>
                                          </div>

                                          <ChevronDown />
                                        </div>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className='w-60 bg-white border-gray-300' align='center'>
                                      <DropdownMenuGroup>
                                        <DropdownMenuItem className='gap-4'>
                                          <AlignVerticalSpaceAround />
                                          Section 1
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className='gap-4'>
                                          <AlignVerticalSpaceAround />
                                          Section 2
                                        </DropdownMenuItem>

                                        <DropdownMenuItem className='gap-4'>
                                          <AlignVerticalSpaceAround />
                                          Section 3
                                        </DropdownMenuItem>
                                      </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>

                                <div className='space-y-2 pt-2'>
                                  <div className='text-sm font-sans font-semibold text-gray-500 '>Date</div>
                                  <DatePicker className='w-60 bg-gray-100' />
                                </div>

                                <div className='space-y-2 pt-2'>
                                  <div className='text-sm font-sans font-semibold text-gray-500 '>Priority</div>
                                  <Combobox />
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </form>
                      </Dialog>
                    ))}
                  </div>
                </div>
              ))}

            <div className='flex flex-col gap-4 w-[18rem]' />
          </div>
        </div>
      </div>
    </div>
  );
}
