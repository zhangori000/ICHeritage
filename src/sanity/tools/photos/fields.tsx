import { useEffect, useRef, useState, type ComponentProps } from "react";
import { TextArea, TextInput } from "@sanity/ui";

const SAVE_DELAY_MS = 600;

/**
 * Keep typing local and save after a short pause, on blur, or when the field
 * goes away (switching photos), so every keystroke is not a separate write
 * and nothing typed is lost. Picks up outside changes whenever the field is
 * not being edited.
 */
function useSavingValue(value: string, onSave: (next: string) => void) {
  const [draft, setDraft] = useState(value);
  const [editing, setEditing] = useState(false);
  const [prevValue, setPrevValue] = useState(value);
  const pending = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const save = useRef(onSave);

  useEffect(() => {
    save.current = onSave;
  }, [onSave]);

  // Show outside changes (another admin, undo) unless the field is being edited.
  if (value !== prevValue) {
    setPrevValue(value);
    if (!editing) setDraft(value);
  }

  const flush = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    if (pending.current !== null) {
      const next = pending.current;
      pending.current = null;
      save.current(next);
    }
  };

  // Save anything still waiting when the field unmounts.
  const flushRef = useRef(flush);
  useEffect(() => {
    flushRef.current = flush;
  });
  useEffect(() => () => flushRef.current(), []);

  return {
    value: draft,
    onChange: (next: string) => {
      setEditing(true);
      setDraft(next);
      pending.current = next;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(flush, SAVE_DELAY_MS);
    },
    onBlur: () => {
      setEditing(false);
      flush();
    },
  };
}

type InputProps = Omit<ComponentProps<typeof TextInput>, "value" | "onChange" | "onBlur"> & {
  value: string;
  onSave: (next: string) => void;
};

export function SavingTextInput({ value, onSave, ...rest }: InputProps) {
  const field = useSavingValue(value, onSave);
  return (
    <TextInput
      {...rest}
      value={field.value}
      onChange={(event) => field.onChange(event.currentTarget.value)}
      onBlur={field.onBlur}
    />
  );
}

type AreaProps = Omit<ComponentProps<typeof TextArea>, "value" | "onChange" | "onBlur"> & {
  value: string;
  onSave: (next: string) => void;
};

export function SavingTextArea({ value, onSave, ...rest }: AreaProps) {
  const field = useSavingValue(value, onSave);
  return (
    <TextArea
      {...rest}
      value={field.value}
      onChange={(event) => field.onChange(event.currentTarget.value)}
      onBlur={field.onBlur}
    />
  );
}
