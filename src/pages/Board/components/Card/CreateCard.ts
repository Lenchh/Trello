import instance from '../../../../api/request';
import { toastrError } from '../../../../common/toastr/error/toastr-options-error';
import { toastrSuccess } from '../../../../common/toastr/success/toastr-options-success';

export async function createCard(
  boardId: string | undefined,
  onRefresh: () => Promise<void>,
  listId: number,
  newPosition: number
): Promise<void> {
  try {
    await instance.post(`/board/${boardId}/card`, { title: '', list_id: listId, position: newPosition });
    onRefresh();
  } catch (error) {
    toastrError('Помилка при створенні картки', 'Помилка');
  }
}
