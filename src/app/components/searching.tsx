'use client';
import { useRouter } from 'next/navigation';
import { Calendar, Inbox, CalendarDays, SquareKanban, Columns3, Search, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState, useRef } from 'react';
import { searching } from '../api/searching';

interface Searching {
  cards: Array<{ id: string; title: string; columnId?: string }>;
  columns: Array<{ id: string; title: string }>;
}

interface SearchCommandProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function SearchCommand({ open, setOpen }: SearchCommandProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Searching>({ cards: [], columns: [] });
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. Lắng nghe phím tắt Ctrl+K để mở
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

  // Lắng nghe phím Esc để đóng
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, setOpen]);

  // Focus vào input mỗi khi modal mở
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50); // Đợi render xong mới focus
    } else if (!open) {
      // Reset state khi đóng modal
      setSearch('');
      setResults({ cards: [], columns: [] });
    }
  }, [open]);

  // 2. Logic gọi API (Debounce + Ignore Race condition)
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

  // 3. Hàm thực thi khi click vào một item
  const runCommand = useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    [setOpen],
  );

  // Nếu modal không mở, không render gì cả
  if (!open) return null;

  return (
    // Backdrop mờ (Overlay)
    <div
      className='fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[15vh] bg-black/50 backdrop-blur-sm transition-opacity'
      onClick={() => setOpen(false)} // Click ra ngoài để đóng
    >
      {/* Modal Container */}
      <div
        className='relative w-full max-w-[700px] overflow-hidden rounded-xl bg-white shadow-2xl border border-gray-200'
        onClick={(e) => e.stopPropagation()} // Ngăn chặn sự kiện click lan ra overlay
      >
        {/* Header: Input Search */}
        <div className='flex items-center border-b px-3'>
          <Search className='mr-2 h-5 w-5 shrink-0 opacity-50' />
          <input
            ref={inputRef}
            className='flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50'
            placeholder='Search or type a command...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* Nút Esc nhỏ góc phải */}
          <div className='hidden sm:flex items-center justify-center rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 ml-2'>
            ESC
          </div>
        </div>

        {/* Body: Danh sách kết quả */}
        <div className='max-h-[300px] sm:max-h-[400px] overflow-y-auto p-2'>
          {/* Trạng thái Loading */}
          {isLoading && (
            <div className='flex items-center justify-center p-4 text-sm text-gray-500'>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Đang tìm kiếm...
            </div>
          )}

          {/* Trạng thái Không tìm thấy (Empty State) */}
          {!isLoading && search && results.cards.length === 0 && results.columns.length === 0 && (
            <div className='py-6 text-center text-sm text-gray-500'>Không tìm thấy kết quả nào cho {search}.</div>
          )}

          {/* Mặc định: Recently Viewed (Khi chưa search) */}
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

          {/* Kết quả: Sections / Columns */}
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

          {/* Kết quả: Cards */}
          {!isLoading && search && results.cards.length > 0 && (
            <div className='mb-2'>
              <div className='px-2 py-1.5 text-xs font-semibold text-gray-500'>Cards</div>
              {results.cards.map((card) => (
                <button
                  key={`card-${card.id}`}
                  onClick={() => runCommand(() => console.log('Navigate to Card details:', card.id))}
                  className='flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors'
                >
                  <SquareKanban className='mr-2 h-4 w-4 text-green-500' />
                  <span>{card.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
