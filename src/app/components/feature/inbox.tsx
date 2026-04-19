'use client';

import { Board } from './board';
import { useBoardContext } from '../../context/board.context';

function InboxBoardContent() {
  const {
    columns,
    isLoading,
    addColumn,
    duplicateColumnContext,
    updateCardContext,
    reorderCardContext,
    deleteCardContext,
    deleteColumnContext,
    updateColumnContext,
  } = useBoardContext();

  return (
    <Board
      title='Inbox'
      description='Stay updated with important messages and activity'
      columns={columns}
      isLoading={isLoading}
      onAddColumn={addColumn}
      onDuplicateColumn={duplicateColumnContext}
      onUpdateCard={updateCardContext}
      onReorderCard={reorderCardContext}
      onDeleteCard={deleteCardContext}
      onDeleteColumn={deleteColumnContext}
      onUpdateColumn={updateColumnContext}
    />
  );
}

export default function InboxClient() {
  return <InboxBoardContent />;
}
