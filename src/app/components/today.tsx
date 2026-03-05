/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Board } from './board';
import { useBoardContext } from '../context/board.context';

function TodayBoardContent() {
  const {
    columns,
    isLoading,
    addColumn,
    duplicateColumnContext,
    updateCardContext,
    deleteCardContext,
    deleteColumnContext,
  } = useBoardContext();

  return (
    <Board
      title='Today'
      description='Tasks scheduled for today, organized by priority'
      columns={columns}
      isLoading={isLoading}
      onAddColumn={addColumn}
      onDuplicateColumn={duplicateColumnContext}
      onUpdateCard={updateCardContext}
      onDeleteCard={deleteCardContext}
      onDeleteColumn={deleteColumnContext}
    />
  );
}

export default function TodayClient() {
  return <TodayBoardContent />;
}
