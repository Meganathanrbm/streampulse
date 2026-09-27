import { SEARCH_SX } from "@/utils/constants";
import TextField from "@mui/material/TextField";

interface BreakdownSearchProps {
  value: string;
  label: string;
  onChange: (value: string) => void;
}

function BreakdownSearch({ value, label, onChange }: BreakdownSearchProps) {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      size="small"
      placeholder={`🔍 Search ${label.toLowerCase()}...`}
      sx={SEARCH_SX}
    />
  );
}

export default BreakdownSearch;
