import instance from '../../../../api/request';

export async function createList(
  boardId: string | undefined,
  onCardCreated: () => Promise<void>,
  setErrorText: React.Dispatch<React.SetStateAction<string>>
): Promise<void> {
  try {
    await instance.post(`/board/${boardId}/list`, { title: '', cards: [], position: 1 });
    onCardCreated();
  } catch (error) {
    setErrorText('Помилка при створенні списку.');
  }
}
