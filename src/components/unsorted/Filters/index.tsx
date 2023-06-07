import CancelIcon from '@mui/icons-material/Cancel';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Dispatch, FC, SetStateAction, useRef, useState } from 'react';
import { Optional, ShopFilters } from 'types/global';
import { initialCashDeskFilters } from 'utils/constants';

export interface FiltersProps {
  filters: ShopFilters;
  saveFilters: (filters: ShopFilters) => void;
  usePoisson: boolean;
  setUsePoisson: Dispatch<SetStateAction<boolean>>;
}
export const Filters: FC<FiltersProps> = ({
  filters,
  saveFilters,
  usePoisson,
  setUsePoisson,
}) => {
  const maximalServingTimeRef = useRef();
  const priorityInServiceRef = useRef();

  const [cashDesks, setCashDesks] = useState(filters.cashDesks);

  const handleSaveFilters = () => {
    const maximalServingTime = +(maximalServingTimeRef.current as any)?.value;
    const priorityInService = (priorityInServiceRef.current as any)?.checked;

    const confirmed = confirm(
      'Зміна фільтрів перезапустить програму. Зберегти?',
    );
    if (confirmed) {
      saveFilters({
        ...filters,
        ...{
          totalCashDesks: cashDesks.length,
          maximalServingTime,
          priorityInService,
          cashDesks,
        },
      });
    }
  };

  const handleAddCashDesk = () => {
    setCashDesks((prevCashDesks) => [...prevCashDesks, initialCashDeskFilters]);
  };

  const handleDeleteCashDesk = (index: number) => {
    setCashDesks((prevCashDesks) => [
      ...prevCashDesks.slice(0, index),
      ...prevCashDesks.slice(index + 1),
    ]);
  };

  const handleUpdateCashDesk = (
    index: number,
    filters: Optional<
      ShopFilters['cashDesks'][0],
      'goodsLimitation' | 'open' | 'processingTimePerGoodItem'
    >,
  ) => {
    setCashDesks((prevCashDesks) => {
      const updatedCashDesks = prevCashDesks.slice();
      updatedCashDesks[index] = { ...updatedCashDesks[index], ...filters };
      return updatedCashDesks;
    });
  };

  return (
    <Paper sx={{ p: '12px' }}>
      <FormControl>
        <FormLabel>Джерело даних</FormLabel>
        <RadioGroup
          value={usePoisson ? 'poisson' : 'db'}
          onChange={(event) => {
            setUsePoisson(event.target.value === 'poisson');
          }}
        >
          <FormControlLabel value="db" control={<Radio />} label="База даних" />
          <FormControlLabel
            value="poisson"
            control={<Radio />}
            label="Пуассонівський процесс"
          />
        </RadioGroup>
      </FormControl>

      <Divider sx={{ my: '16px' }} />

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

        <Box sx={{ display: 'flex', gap: '8px' }}>
          <TextField
            label="Кількість кас"
            size="small"
            type="number"
            value={cashDesks.length}
            disabled
          />
          {/* TODO: Доробити */}
          {/* <TextField
            label="Максимальний час очікування"
            size="small"
            inputRef={maximalServingTimeRef}
            defaultValue={filters.maximalServingTime}
            disabled
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  disabled
                  inputRef={priorityInServiceRef}
                  defaultChecked={filters.priorityInService}
                />
              }
              label="Враховувати приорітет"
            />
          </FormGroup> */}
        </Box>

        <Divider sx={{ mt: '16px' }} />

        <Box>
          {cashDesks.map((cashDesk, index) => (
            <Box key={index}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    my: '12px',
                  }}
                >
                  Каса №{index + 1}:
                </Typography>
                <IconButton
                  onClick={() => {
                    handleDeleteCashDesk(index);
                  }}
                  color="error"
                >
                  <CancelIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <TextField
                  size="small"
                  label="Час обробки одного товару"
                  type="number"
                  InputProps={{ inputProps: { min: 1 } }}
                  value={cashDesk.processingTimePerGoodItem || ''}
                  onChange={(event) => {
                    const value = +event.target.value;
                    handleUpdateCashDesk(index, {
                      processingTimePerGoodItem: value,
                    });
                  }}
                />
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        onChange={(event) =>
                          handleUpdateCashDesk(index, {
                            open: event.target.checked,
                          })
                        }
                        color="success"
                        checked={cashDesk.open}
                      />
                    }
                    label="Відкрита"
                  />
                </FormGroup>
              </Box>
            </Box>
          ))}
          <Button
            sx={{ mt: '16px' }}
            color="info"
            onClick={handleAddCashDesk}
            variant="contained"
          >
            Додати касу
          </Button>
        </Box>

        <Divider sx={{ my: '16px' }} />

        <Button variant="outlined" onClick={handleSaveFilters}>
          Зберегти фільтри
        </Button>
      </Box>
    </Paper>
  );
};
