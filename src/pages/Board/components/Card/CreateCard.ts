import instance from '../../../../api/request';

export async function createCard(
  boardId: string | undefined,
  onRefresh: () => Promise<void>,
  listId: number
): Promise<void> {
  try {
    await instance.post(`/board/${boardId}/card`, { title: '', list_id: listId, position: 1 });
    onRefresh();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Помилка при створенні картки.');
  }
}
