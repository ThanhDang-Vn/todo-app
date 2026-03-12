/* eslint-disable @typescript-eslint/no-explicit-any */
import { Archive, Copy, Ellipsis, PackagePlus, Trash2, Loader2, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { CardItem } from '../card/cardDetail';
import { useMemo, useState } from 'react';
import { Card, Column } from '@/lib/types';
import { CreateColumn } from '../column/createColumn';
import { CreateCard } from '../card/createCard';
import ConfirmModal from '../modal/confirm';
import { usePathname } from 'next/navigation';

interface BoardProps {
  title: string;
  description: string;
  columns: Column[];
  isLoading: boolean;
  onAddColumn: (title: string) => Promise<void>;
  onDuplicateColumn: (column: Column, columnId: string, order: number) => Promise<void>;
  onUpdateCard: (cardId: string, data: Partial<Card>) => Promise<void>;
  onDeleteCard: (cardId: string) => Promise<void>;
  onDeleteColumn: (columnId: string) => Promise<void>;
  onUpdateColumn: (columnId: string, data: { title?: string; order?: number }) => Promise<void>;
}

export function Board({
  title,
  description,
  columns,
  isLoading,
  onAddColumn,
  onDuplicateColumn,
  onUpdateColumn,
  onUpdateCard,
  onDeleteCard,
  onDeleteColumn,
}: BoardProps) {
  const [modalDeleteColumn, setModalDeleteColumn] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState<string | null>(null);
  const [creatingCardColId, setCreatingCardColId] = useState<string | null>(null);

  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const path = usePathname();

  const handleDuplicateColumn = async (column: Column, columnId: string, order: number) => {
    await onDuplicateColumn(column, columnId, order);
  };

  const handleCreateColumn = async (columnTitle: string) => {
    await onAddColumn(columnTitle);
  };

  const handleUpdateCard = async (cardId: string, data: Partial<Card>) => {
    await onUpdateCard(cardId, data);
  };

  const handleDeleteCard = async (cardId: string) => {
    await onDeleteCard(cardId);
  };

  const handleDeleteColumn = async () => {
    if (!columnToDelete) {
      return;
    }

    setModalDeleteColumn(false);
    await onDeleteColumn(columnToDelete);
  };

  const OpenModalDelete = (columnId: string) => {
    setColumnToDelete(columnId);
    setModalDeleteColumn(true);
  };

  const startEditingTitle = (colId: string, currentTitle: string) => {
    setEditingColumnId(colId);
    setEditTitle(currentTitle);
  };

  const saveColumnTitle = async (colId: string, originalTitle: string) => {
    const trimmedTitle = editTitle.trim();
    if (trimmedTitle && trimmedTitle !== originalTitle) {
      await onUpdateColumn(colId, { title: trimmedTitle });
    }
    setEditingColumnId(null);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent, colId: string, originalTitle: string) => {
    if (e.key === 'Enter') {
      saveColumnTitle(colId, originalTitle);
    } else if (e.key === 'Escape') {
      setEditingColumnId(null);
    }
  };

  const columnOptions = useMemo(
    () =>
      columns.map((col) => ({
        id: col.id.toString(),
        title: col.title,
      })),
    [columns],
  );

  return (
    <div className='flex flex-col pt-2 pl-10 h-full overflow-y-hidden'>
      <div className='flex items-center justify-between w-full gap-10 border-b border-gray-300 pb-4 mb-4'>
        <div>
          <h5 className='text-2xl font-semibold'>{title}</h5>
          <p className='text-sm text-gray-600'>{description}</p>
        </div>
      </div>

      {isLoading && (
        <div className='flex flex-1 min-h-full w-full items-center justify-center bg-white/80 z-50'>
          <Loader2 className='h-12 w-12 animate-spin text-red-400' />
        </div>
      )}

      <div className='overflow-x-auto h-full custom-scrollbar'>
        <div className='flex gap-5 px-1 py-4'>
          <div className='px-1 flex justify-start gap-5'>
            {columns.map((col: Column) => (
              <div
                key={`col-${col.id}-${Date.now()}`}
                className='flex flex-col flex-shrink-0 gap-4 w-[18rem] max-h-full'
              >
                <div className='flex items-center justify-between '>
                  {editingColumnId === String(col.id) ? (
                    <input
                      autoFocus
                      className='text-sm font-semibold text-gray-700 bg-white border border-blue-400 rounded px-2 py-0.5 outline-none w-[70%]'
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={() => saveColumnTitle(String(col.id), col.title)}
                      onKeyDown={(e) => handleTitleKeyDown(e, String(col.id), col.title)}
                    />
                  ) : (
                    <h1
                      className='text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 px-2 py-0.5 rounded transition-colors truncate w-[70%]'
                      onClick={() => startEditingTitle(String(col.id), col.title)}
                      title='Click to edit'
                    >
                      {col.title}
                    </h1>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger className='focus:outline-0'>
                      <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='w-40 border-0 bg-white' align='center'>
                      <DropdownMenuLabel></DropdownMenuLabel>
                      <DropdownMenuGroup className=''>
                        <DropdownMenuItem onSelect={() => setCreatingCardColId(String(col.id))}>
                          <div className='px-2 py-1 flex items-center gap-3 mb-1 rounded-md text-gray-600 cursor-pointer transition-all duration-200 ease-out hover:bg-blue-50 hover:text-blue-600 active:scale-[0.98] pr-10'>
                            <PackagePlus size={17} />
                            <div className='text-sm font-sans'>Add Card</div>
                          </div>
                        </DropdownMenuItem>

                        <DropdownMenuItem onSelect={() => handleDuplicateColumn(col, col.id, col.order!)}>
                          <div className='px-2 py-1 flex items-center gap-3 mb-1 rounded-md text-gray-600 cursor-pointer transition-all duration-200 ease-out hover:bg-blue-50 hover:text-blue-600 active:scale-[0.98] pr-10'>
                            <Copy size={17} />
                            <div className='text-sm font-sans'>Duplicate</div>
                          </div>
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          <div className='px-2 py-1 flex items-center gap-3 mb-1 rounded-md text-gray-600 cursor-pointer transition-all duration-200 ease-out hover:bg-blue-50 hover:text-blue-600 active:scale-[0.98] pr-10'>
                            <Archive size={17} />
                            <div className='text-sm font-sans'>Archive</div>
                          </div>
                        </DropdownMenuItem>

                        <DropdownMenuItem onSelect={() => OpenModalDelete(col.id)}>
                          <div className='px-2 py-1 flex items-center gap-3 mb-1 rounded-md text-gray-600 cursor-pointer transition-all duration-200 ease-out hover:bg-red-50 hover:text-red-600 active:scale-[0.98] pr-10'>
                            <Trash2 size={17} />
                            <div className='text-sm font-sans '>Delete</div>
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className='flex-1 overflow-y-auto max-h-142 pr-3 space-y-3 pb-2 custom-scrollbar'>
                  {col?.cards && col.cards.length > 0 ? (
                    col.cards.map((c: Card) => (
                      <CardItem
                        key={c.id}
                        card={c}
                        column={col}
                        allColumns={columnOptions}
                        onUpdate={handleUpdateCard}
                        onDelete={handleDeleteCard}
                      />
                    ))
                  ) : (
                    <button
                      onClick={() => setCreatingCardColId(String(col.id))}
                      className='w-full h-12 border-1 border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 ease-in-out group shadow-sm'
                    >
                      <div className='flex items-center justify-center gap-2'>
                        <div className='p-1 bg-white rounded-full border border-gray-100 shadow-sm group-hover:shadow transition-all'>
                          <Plus size={15} />
                        </div>
                        <span className='text-sm font-medium'>Add new card</span>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {path === '/inbox' && (
              <div className='w-[15rem] flex-shrink-0 pr-10'>
                <CreateColumn onCreate={handleCreateColumn} />
              </div>
            )}

            <div className='flex flex-col gap-4 w-[18rem]' />
          </div>
        </div>
      </div>

      {creatingCardColId && (
        <CreateCard
          open={true}
          onClose={() => setCreatingCardColId(null)}
          currentColumnId={creatingCardColId}
          allColumns={columnOptions}
        />
      )}

      <ConfirmModal
        isOpen={modalDeleteColumn}
        onClose={() => setModalDeleteColumn(false)}
        onConfirm={handleDeleteColumn}
        title='Delete column?'
        confirmText='Delete'
        variant='danger'
      >
        <div className='space-y-3'>
          <p className='text-gray-700 font-medium'>Are you sure you want to delete this column?</p>
          <p className='text-sm text-gray-500'>
            This action cannot be undone. All tasks inside this column will be{' '}
            <span className='font-semibold text-gray-700'>permanently deleted</span>.
          </p>
        </div>
      </ConfirmModal>
    </div>
  );
}
