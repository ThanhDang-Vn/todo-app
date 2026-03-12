/* eslint-disable @typescript-eslint/no-explicit-any */
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
      onDeleteCard={deleteCardContext}
      onDeleteColumn={deleteColumnContext}
      onUpdateColumn={updateColumnContext}
    />
  );
}

export default function InboxClient() {
  return <InboxBoardContent />;
}
