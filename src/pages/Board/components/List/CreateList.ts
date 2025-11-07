import instance from '../../../../api/request';
import { toastrError } from '../../../../common/toastr/error/toastr-options-error';

export async function createList(boardId: string | undefined, onRefresh: () => Promise<void>): Promise<void> {
  try {
    await instance.post(`/board/${boardId}/list`, { title: '', cards: [], position: 1 });
    onRefresh();
  } catch (error) {
    toastrError('Помилка при створенні списку', 'Помилка');
  }
}
