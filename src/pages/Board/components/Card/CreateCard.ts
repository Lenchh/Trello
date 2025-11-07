import instance from '../../../../api/request';
import { toastrError } from '../../../../common/toastr/error/toastr-options-error';

export async function createCard(
  boardId: string | undefined,
  onRefresh: () => Promise<void>,
  listId: number
): Promise<void> {
  try {
    await instance.post(`/board/${boardId}/card`, { title: '', list_id: listId, position: 1 });
    onRefresh();
  } catch (error) {
    toastrError('Помилка при створенні картки', 'Помилка');
  }
}
