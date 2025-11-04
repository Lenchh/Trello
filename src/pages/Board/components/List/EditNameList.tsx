import { ChangeEvent, JSX, useState } from 'react';
import instance from '../../../../api/request';
import listStyle from './list.module.scss';

interface props {
  boardId: string | undefined;
  listId: number;
  onRefresh: () => Promise<void>;
  setIsNameList: React.Dispatch<React.SetStateAction<boolean>>;
  nameList: string;
  setNameList: React.Dispatch<React.SetStateAction<string>>;
  oldValue: string;
}

export function EditNameList({
  boardId,
  listId,
  onRefresh,
  setIsNameList,
  nameList,
  setNameList,
  oldValue,
}: props): JSX.Element {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (/^[a-zA-Zа-щА-ЩіІїЇєЄґҐ0-9 `,._-]*$/.test(event.target.value)) {
      // setInputValue(event.target.value);
      setNameList(event.target.value);
    }
  };

  const editName = async (): Promise<void> => {
    if (nameList.trim() === '') {
      return;
    }
    try {
      await instance.put(`/board/${boardId}/list/${listId}`, { title: nameList });
      onRefresh();
      setIsNameList(true);
    } catch (error) {
      setIsNameList(true);
      setNameList(oldValue);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      editName();
    }
  };

  return (
    <input
      type="text"
      value={nameList}
      className={listStyle.list__input}
      onChange={handleChange}
      onBlur={editName}
      onKeyDown={handleKeyDown}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus
    />
  );
}
