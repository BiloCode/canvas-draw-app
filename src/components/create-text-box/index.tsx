import { FC, FormEventHandler, useRef } from "react";

import styles from "./styles.module.scss";

import useKeyboard from "../../hooks/use-keyboard";

type Props = {
  defaultValue?: string;
  onCancel(): void;
  onValueChange(newValue: string): void;
};

const CreateTextBox: FC<Props> = ({ defaultValue, onCancel, onValueChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit: FormEventHandler = (ev) => {
    ev.preventDefault();
    onValueChange(inputRef.current?.value || "");
  };

  useKeyboard((key) => {
    if (key === "Escape") onCancel();
  });

  return (
    <div className={styles["overlay-container"]}>
      <form className={styles.form} onSubmit={onSubmit}>
        <input ref={inputRef} defaultValue={defaultValue} type="text" autoFocus />
        <input type="button" value="Cancelar" onClick={onCancel} />
        <input type="submit" hidden />
      </form>
    </div>
  );
};

export default CreateTextBox;
