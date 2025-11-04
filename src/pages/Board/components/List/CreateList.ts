import instance from '../../../../api/request';

export async function createList(
  boardId: string | undefined,
  onRefresh: () => Promise<void>,
  setErrorText: React.Dispatch<React.SetStateAction<string>>
): Promise<void> {
  try {
    await instance.post(`/board/${boardId}/list`, { title: '', cards: [], position: 1 });
    onRefresh();
  } catch (error) {
    setErrorText('Помилка при створенні списку.');
  }
}
