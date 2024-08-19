import { Dispatch, SetStateAction, useState } from "react";

const useInput = (
  init: string | undefined
): [
  string | undefined,
  Dispatch<SetStateAction<string | undefined>>,
  (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void
] => {
  const [value, setValue] = useState(init);
  const onChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    setValue(e.target.value);
  };

  return [value, setValue, onChange];
};

export default useInput;
