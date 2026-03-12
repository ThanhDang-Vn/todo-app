'use client';
import { useRouter } from 'next/navigation';
import { Calendar, Inbox, CalendarDays, SquareKanban, Columns3, Search, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState, useRef } from 'react';
import { searching } from '../api/searching';
import { Checkbox } from './ui/checkbox';

interface Searching {
  cards: Array<{ id: string; title: string; columnId?: string; priority: string; description: string }>;
  columns: Array<{ id: string; title: string }>;
}

interface SearchCommandProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

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

export function SearchCommand({ open, setOpen }: SearchCommandProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Searching>({ cards: [], columns: [] });
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setOpen]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, setOpen]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else if (!open) {
      setSearch('');
      setResults({ cards: [], columns: [] });
    }
  }, [open]);

  useEffect(() => {
    let ignore = false;
    if (!search.trim()) {
      setResults({ cards: [], columns: [] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const timeout = setTimeout(async () => {
      try {
        const data = await searching(search);
        if (!ignore) {
          setResults(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.log(err);
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      ignore = true;
    };
  }, [search]);

  const runCommand = useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    [setOpen],
  );

  if (!open) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[15vh] bg-black/50 backdrop-blur-sm transition-opacity'
      onClick={() => setOpen(false)}
    >
      <div
        className='relative w-full max-w-[700px] overflow-hidden rounded-xl bg-white shadow-2xl border border-gray-200'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center border-b border-gray-200 px-3'>
          <Search className='mr-2 h-5 w-5 shrink-0 opacity-50' />
          <input
            ref={inputRef}
            className='flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50'
            placeholder='Search or type a command...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className='hidden sm:flex items-center justify-center rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 ml-2'>
            ESC
          </div>
        </div>

        <div className='max-h-[300px] sm:max-h-[400px] overflow-y-auto p-2'>
          {!isLoading && search && results.cards.length === 0 && results.columns.length === 0 && (
            <div className='py-6 text-center text-sm text-gray-500'>Not found</div>
          )}

          {!search && !isLoading && (
            <div className='mb-2'>
              <div className='px-2 py-1.5 text-xs font-semibold text-gray-500'>Recently viewed</div>

              <button
                onClick={() => runCommand(() => router.push('/today'))}
                className='flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors'
              >
                <Calendar className='mr-2 h-4 w-4 text-gray-500' />
                <span>Today</span>
              </button>

              <button
                onClick={() => runCommand(() => router.push('/upcoming'))}
                className='flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors'
              >
                <CalendarDays className='mr-2 h-4 w-4 text-gray-500' />
                <span>Upcoming</span>
              </button>

              <button
                onClick={() => runCommand(() => router.push('/inbox'))}
                className='flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors'
              >
                <Inbox className='mr-2 h-4 w-4 text-gray-500' />
                <span>Inbox</span>
              </button>
            </div>
          )}

          {!isLoading && search && results.columns.length > 0 && (
            <div className='mb-2'>
              <div className='px-2 py-1.5 text-xs font-semibold text-gray-500'>Sections / Columns</div>
              {results.columns.map((col) => (
                <button
                  key={`col-${col.id}`}
                  onClick={() => runCommand(() => console.log('Navigate to Column:', col.id))}
                  className='flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors'
                >
                  <Columns3 className='mr-2 h-4 w-4 text-blue-500' />
                  <span>{col.title}</span>
                </button>
              ))}
            </div>
          )}

          {isLoading && search && (
            <div className='mb-2'>
              {[1, 2, 3].map((item) => (
                <div key={`skeleton-${item}`} className='flex w-full items-center rounded-md px-2 py-2'>
                  <div className='w-5 h-5 rounded bg-gray-200 animate-pulse ml-2 shrink-0' />
                  <div className='ml-3 flex flex-col flex-1 gap-1.5'>
                    <div className='h-4 w-1/3 rounded bg-gray-200 animate-pulse' />
                    <div className='h-3 w-2/3 rounded bg-gray-100 animate-pulse' />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && search && results.cards.length > 0 && (
            <div className='mb-2'>
              <div className='px-2 py-1.5 text-xs font-semibold text-gray-500'>Cards</div>
              {results.cards.map((card) => (
                <button
                  key={`card-${card.id}`}
                  onClick={() => runCommand(() => console.log('Navigate to Card details:', card.id))}
                  className='flex w-full items-center rounded-md px-2 py-2 text-left hover:bg-gray-100 transition-colors group'
                >
                  <div className='relative flex items-center justify-center w-4 h-4 group/checkbox cursor-pointer ml-2 shrink-0'>
                    <Checkbox
                      className={`peer w-full h-full transition-all duration-300 ease-out data-[state=checked]:scale-115 
      ${checkboxColor(card.priority)}`}
                    />
                  </div>

                  <div className='ml-3 flex flex-col flex-1 overflow-hidden'>
                    <span className='text-sm font-medium text-gray-700 truncate'>{card.title}</span>
                    {card.description && <span className='text-xs text-gray-400 truncate'>{card.description}</span>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
