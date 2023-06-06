import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Paper,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { FC, useRef } from 'react';
import { ShopFilters } from 'types/global';

export interface FiltersProps {
  filters: ShopFilters;
  saveFilters: (filters: ShopFilters) => void;
}
export const Filters: FC<FiltersProps> = ({ filters, saveFilters }) => {
  const totalCashDesksRef = useRef();
  const maximalServingTimeRef = useRef();
  const priorityInServiceRef = useRef();

  const handleSaveFilters = () => {
    const totalCashDesks = +(totalCashDesksRef.current as any)?.value;
    const maximalServingTime = +(maximalServingTimeRef.current as any)?.value;
    const priorityInService = (priorityInServiceRef.current as any)?.checked;

    const confirmed = confirm(
      'Зміна фільтрів перезапустить програму. Зберегти?',
    );
    if (confirmed) {
      saveFilters({ totalCashDesks, maximalServingTime, priorityInService });
    }
  };

  return (
    <Paper sx={{ p: '12px' }}>
      <Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            textDecoration: 'underline',
            mb: '12px',
          }}
        >
          Загальні фільтри:
        </Typography>

        <Box sx={{ display: 'flex', gap: '8px', mb: '24px' }}>
          <TextField
            label="Максимальна кількість кас"
            size="small"
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            inputRef={totalCashDesksRef}
            defaultValue={filters.totalCashDesks}
          />
          <TextField
            label="Максимальний час очікування"
            size="small"
            inputRef={maximalServingTimeRef}
            defaultValue={filters.maximalServingTime}
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  inputRef={priorityInServiceRef}
                  defaultChecked={filters.priorityInService}
                />
              }
              label="Враховувати приорітет"
            />
          </FormGroup>
        </Box>
        {/* <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            textDecoration: 'underline',
            mb: '12px',
          }}
        >
          Фільтри каси №1:
        </Typography>
        <Box sx={{ display: 'flex', gap: '8px', mb: '24px' }}>
          <TextField label="Стан каси" size="small" value="Відкрита" disabled />
          <TextField
            label="Час обробки одиниці товару"
            size="small"
            value={1}
            disabled
          />
          <TextField
            label="Максимальна кількість товарів на 1 людину"
            size="small"
            value="-"
            disabled
          />
        </Box> */}

        <Button variant="outlined" onClick={handleSaveFilters}>
          Зберегти фільтри
        </Button>
      </Box>
    </Paper>
  );
};
