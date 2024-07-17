// table cell action

export interface ShTableCellActionProps {
  onUpdate?: () => void;
  onDetail?: () => void;
  onRemove?: () => void;

  isLoading?: boolean;
}

export interface ShTableCellCoppyNameProps {
  name: string;
}
