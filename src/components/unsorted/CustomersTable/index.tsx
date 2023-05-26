import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { FC } from 'react';
import { Customer } from 'types/global';

export type CustomersTableProps = {
  customers: Customer[];
};

export const CustomersTable: FC<CustomersTableProps> = ({ customers }) => {
  const getTableCells = (customer: Customer) => {
    const customerValues = Object.entries(customer);
    return customerValues.map(([key, value]) => (
      <TableCell key={key}>{value}</TableCell>
    ));
  };

  const getTableRows = (tableCustomers: Customer[]) =>
    customers.map((customer, index) => {
      return (
        <TableRow key={customer.id}>
          <TableCell>{index + 1}</TableCell>
          {getTableCells(customer)}
        </TableRow>
      );
    });

  const tableHeadTitles = [
    '№',
    'ID',
    'Гендер',
    'Кількість товарів (штука/-и)',
    'Час прибуття (секунда/-и)',
    'Приорітет',
  ];

  if (customers.length === 0) {
    return (
      <Typography sx={{ ml: '12px' }} variant="h5">
        Покупці відсутні...
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            {tableHeadTitles.map((title) => (
              <TableCell sx={{ fontWeight: 'bold' }} key={title}>
                {title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {getTableRows(customers)}
          {/* {customers.map((customer) => getTableRow(customer))} */}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
