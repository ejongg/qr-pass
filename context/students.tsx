import React, { Dispatch, FC, ReactNode, SetStateAction, useState } from 'react';
import { Student } from '../api-interface';

export const studentContext = React.createContext<{
  students: Student[];
  setStudents: Dispatch<SetStateAction<Student[]>>;
}>({ students: [], setStudents: () => {} });

export const Students: FC<{ children?: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);

  return <studentContext.Provider value={{ students, setStudents }}>{children}</studentContext.Provider>;
};
