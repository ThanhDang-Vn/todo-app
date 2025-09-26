import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu';
import { Checkbox } from '@/app/components/ui/checkbox';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

import { Pencil, Copy, Archive, Trash2, Ellipsis } from 'lucide-react';

const menuItems = [
  { label: 'Edit', icon: Pencil },
  { label: 'Duplicate', icon: Copy },
];

const mockData = [
  {
    id: 1,
    title: 'Learning English',
    cards: [
      {
        id: 1,
        name: 'Reading',
        description: 'Practice reading articles and books',
        priorty: '1',
        status: 'in progress',
        dueDate: '2025-09-15',
        tags: ['reading', 'vocabulary'],
        assignedTo: 'Thành',
      },
      {
        id: 2,
        name: 'Listening',
        description: 'Listen to podcasts and conversations',
        priorty: '2',
        status: 'not started',
        dueDate: '2025-09-20',
        tags: ['listening', 'speaking'],
        assignedTo: 'Thành',
      },
      {
        id: 3,
        name: 'Writing',
        description: 'Practice writing essays and emails',
        priorty: '3',
        status: 'not started',
        dueDate: '2025-09-25',
        tags: ['writing', 'grammar'],
        assignedTo: 'Thành',
      },
    ],
  },
  {
    id: 2,
    title: 'Software Engineering',
    cards: [
      {
        id: 1,
        name: 'Frontend Development',
        description: 'Learn React, TailwindCSS, Next.js',
        priorty: '1',
        status: 'in progress',
        dueDate: '2025-10-01',
        tags: ['frontend', 'react'],
        assignedTo: 'Team A',
      },
      {
        id: 2,
        name: 'Backend Development',
        description: 'Learn Node.js, Databases, APIs',
        priorty: '2',
        status: 'not started',
        dueDate: '2025-10-05',
        tags: ['backend', 'nodejs'],
        assignedTo: 'Team B',
      },
    ],
  },
  {
    id: 3,
    title: 'Computer Science',
    cards: [
      {
        id: 1,
        name: 'Data Structures',
        description: 'Study arrays, linked lists, trees',
        priorty: '1',
        status: 'in progress',
        dueDate: '2025-09-30',
        tags: ['ds', 'algorithms'],
        assignedTo: 'Thành',
      },
      {
        id: 2,
        name: 'Algorithms',
        description:
          'Sorting, searching, graph algorithms sssssssssssssssssknm nkdnnd nsdkjfbksdbfjb jbs n nguyen thanh dang',
        priorty: '2',
        status: 'not started',
        dueDate: '2025-10-05',
        tags: ['algorithms', 'graphs'],
        assignedTo: 'Thành',
      },
      {
        id: 3,
        name: 'Operating Systems',
        description: 'Learn processes, memory, threads',
        priorty: '3',
        status: 'not started',
        dueDate: '2025-10-10',
        tags: ['os', 'threads'],
        assignedTo: 'Thành',
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

export default async function Inbox() {
  // const session = await getSession();
  // if (!session || !session.user) redirect('/auth/login');
  return (
    <div className='flex flex-col pt-2 h-16 px-10'>
      <h5 className='text-2xl font-semibold'>Inbox</h5>
      <div className='w-full mt-5'>
        <div className='px-1 flex justify-start gap-5'>
          {mockData.map((board) => (
            <div key={board.id} className='flex flex-col gap-4 w-[18rem]'>
              <div className='flex items-center justify-between '>
                <h1 className='text-base font-normal'>{board.title}</h1>
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

              <div className='grid auto-rows-max grid-flow-row gap-2'>
                {board.cards.map((card) => (
                  <div key={card.id} className='border-gray-300 border-1 px-4 py-1 rounded-lg h-18 space-y-0.5'>
                    <div className='flex justify-start gap-3'>
                      <div className='py-0.5'>
                        <Checkbox className={checkboxColor(card.priorty)} />
                      </div>
                      <div>
                        <h1 className='text-base'>{card.name}</h1>
                        <h1 className='text-xs line-clamp-1 wrap-break-word'>{card.description}</h1>
                        <h1 className='text-xs pt-1'>{card.dueDate}</h1>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
