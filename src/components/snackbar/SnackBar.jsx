import * as React from 'react';
import {Button, Divider, Stack } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import { Typography } from '@mui/material';
import moment from 'moment';

const SnackBar = (props) => {
  
    const { handleClose, open, paymentState } = props;

// console.log("paymentState:", paymentState)
  const messages = (
    <Stack spacing={2} sx={{ ml: '3rem' }}>
       <Stack>
         <Typography>Object Oriented Parking</Typography>
       </Stack>
       <Stack>
          <Typography>Date of Entry: {moment(paymentState?.datePark).format('MM-DD-YYYY')}</Typography>
          <Typography>Date of Exit: {moment(paymentState?.dateUnPark).format('MM-DD-YYYY')}</Typography>
          <Divider  />
          <Typography>First 3 Hours: {paymentState?.flatRate}</Typography>
          <Typography>Succeeding Hours: {paymentState?.succeedingHours}</Typography>
          <Typography>Succeeding Fee: {paymentState?.succeedingFee}</Typography>
       </Stack>
       <Stack>
          <Typography>Total Amount Charge: P{paymentState?.totalAmountCharge}</Typography>
       </Stack>
       <Stack>
         <Button>Pay</Button>
       </Stack>
    </Stack>
  );

  return (
    <div>
      {/* {messages} */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        onClose={handleClose}
        message={messages}
      />
    </div>
  );
}

export default SnackBar;
