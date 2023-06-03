import { Box, Button, Paper, TextField, Typography } from '@mui/material';

export const Filters = () => {
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
            value={1}
            disabled
          />
          <TextField
            label="Максимальний час обслуговування"
            size="small"
            value="-"
            disabled
          />
        </Box>
        <Typography
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
        </Box>
        <Button variant="contained" color="info">
          Відкрити касу
        </Button>
        <Button sx={{ ml: '8px' }} variant="contained" color="warning">
          Закрити касу
        </Button>
      </Box>
    </Paper>
  );
};
