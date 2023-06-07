import RestartAltIcon from '@mui/icons-material/RestartAlt';
import TuneIcon from '@mui/icons-material/Tune';
import { AppBar, Box, Button, ButtonGroup } from '@mui/material';
import { ClockGroup } from 'components/unsorted/ClockGroup';
import { CustomersTable } from 'components/unsorted/CustomersTable';
import { Modal } from 'components/unsorted/Modal';
import { Stopwatch } from 'hooks/useStopwatch';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { parseCustomersData } from 'utils/parseCustomersData';
import { PreparedCustomersData } from 'utils/prepareCustomersData';

export type HeaderProps = {
  timer: Stopwatch & {
    speed: number;
    setSpeed: Dispatch<SetStateAction<number>>;
  };
  customersData: PreparedCustomersData | undefined;
  resetData: () => void;
  generateData: () => void;
  handleShowFilters: () => void;
  usePoisson: boolean;
};

export const Header: FC<HeaderProps> = ({
  timer,
  customersData,
  resetData,
  generateData,
  handleShowFilters,
  usePoisson,
}) => {
  const {
    active: stopwatchActive,
    time,
    startStopwatch,
    pauseStopwatch,
    resetStopwatch,
    speed,
    setSpeed,
  } = timer || {};

  const [showCustomersTable, setShowCustomersTable] = useState(false);

  const handleCloseCustomersTableModal = () => {
    setShowCustomersTable(false);
  };

  const handleShowCustomersTableModal = () => {
    setShowCustomersTable(true);
  };
  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          top: 0,
          left: 0,
          width: '100vw',
          height: '50px',
          background: 'lightgrey',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: '12px',
        }}
      >
        <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Button
            sx={{ height: '36px' }}
            variant="contained"
            color="warning"
            disabled
          >
            <RestartAltIcon />
          </Button>
          <ClockGroup
            active={stopwatchActive}
            disabled={!customersData}
            time={time}
            speed={speed}
            setSpeed={setSpeed}
            startStopwatch={startStopwatch}
            stopStopwatch={pauseStopwatch}
            resetStopwatch={resetStopwatch}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: '16px' }}>
          {!usePoisson && (
            <ButtonGroup size="small" variant="outlined">
              <Button
                onClick={resetData}
                color="error"
                disabled={!customersData}
              >
                Reset data
              </Button>
              <Button
                onClick={generateData}
                color="success"
                disabled={!!customersData}
              >
                Generate data
              </Button>
              <Button onClick={handleShowCustomersTableModal} color="info">
                Show data
              </Button>
            </ButtonGroup>
          )}
          <Button
            sx={{ borderRadius: '5px' }}
            variant="contained"
            onClick={handleShowFilters}
          >
            <TuneIcon />
          </Button>
        </Box>
      </AppBar>
      <Modal
        title="Згенеровані покупці:"
        open={showCustomersTable}
        onClose={handleCloseCustomersTableModal}
      >
        <CustomersTable
          customers={customersData ? parseCustomersData(customersData) : []}
        />
      </Modal>
    </>
  );
};
