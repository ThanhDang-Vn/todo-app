/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Board } from './board';
import { useBoardContext } from '../../context/board.context';

function UpcomingBoardContent() {
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
      title='Upcoming'
      description='Tasks scheduled days for a week, organized by priority'
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

export default function UpcomingClient() {
  return <UpcomingBoardContent />;
}
