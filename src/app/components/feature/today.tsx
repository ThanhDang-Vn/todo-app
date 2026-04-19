'use client';

import { Board } from './board';
import { useBoardContext } from '../../context/board.context';

function TodayBoardContent() {
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
      title='Today'
      description='Tasks scheduled for today, organized by priority'
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

export default function TodayClient() {
  return <TodayBoardContent />;
}
