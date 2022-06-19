import Typography from "@mui/material/Typography";
import Stack  from "@mui/material/Stack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import MuiButton from "../../components/button";
import FullParking from "../full-parking";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import moment from "moment";


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  const vehicles = [
    {
     type: 'S',
     succeeding: 20,
    },
   {
     type: 'M',
     succeeding: 60,
    },
   {
     type: 'L',
     succeeding: 100,
    },
   ]

  const initialData = [
    { 
    id: 1,
    slots: [
     {
       slotId: 1, 
       isAvailable: false,
       dateTime: null,
       type: "SP",
     },
     {
        slotId: 2,
        isAvailable: true,
        dateTime: null,
        type: "SP",
      },
      {
        slotId: 3, 
        isAvailable: true,
        dateTime: null,
        type: "SP",
      },
      {
        slotId: 4, 
        isAvailable: false,
        dateTime: null,
        type: "MP",
      },
      {
        slotId: 5, 
        isAvailable: true,
        dateTime: null,
        type: "LP",
      },
    ]
  },
  {
    id: 2,
    slots: [
      {
        slotId: 1, 
        isAvailable: true,
        dateTime: null,
        type: "SP",
      },
      {
        slotId: 2, 
        isAvailable: true,
        dateTime: null,
        type: "SP",
      },
      {
        slotId: 3, 
        isAvailable: false,
        dateTime: null,
        type: "SP",
      },
      {
        slotId: 4, 
        isAvailable: true,
        dateTime: null,
        type: "LP",
      },
      {
        slotId: 5, 
        isAvailable: true,
        dateTime: null,
        type: "MP",
      },
    ]
  }
 
]

const VehicleEntry = () => {
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const [data, setData] = useState(initialData);
    const submitForm = (data) => {
        getParkingSlot(data.carType, 1);
    }

    const updateSlot = (slots, newSlot, vehicleType) => {
      return slots.map((slot => {

            if (slot.slotId === newSlot.slotId) {
                return {
                    ...slot,
                    isAvailable: !slot.isAvailable,
                    dateTime: moment(new Date()).unix(),
                    type: vehicleType
                }
            }
            return slot;
        }))
    }

    const getParkingSlot = (vehicleType, entrypoint) => {
       const entry = data?.find(entry => entry.id === entrypoint);
       const availableSlots = entry.slots.filter((slot) => slot.isAvailable)

       if (!availableSlots.length) {
        alert('no slots avaiable');
        return;
       }

       setData((prevEntries) => {
        return prevEntries.map((prevEntry) => {
            if (prevEntry.id  === entry.id) {
                return {
                    ...prevEntry,
                    slots: updateSlot(prevEntry.slots, availableSlots[0], vehicleType)
                }
            }
            return prevEntry;
        })
       })
    }

    const handleExit = (id, entrypointId) => {
      const flatRate = 40;
      const dateOfEntry = null; // get the record in the prevoius data entry
      const currentDate = new Date();
      // 1. exit scenes
      // check if hours exceed
      // if not exceed flatRate = 40pesos
      // if exceed flatRate + dateOfEntry - currentDate
      const slots = data?.find(slot => slot.id === 1); //entrypointId set to 1 
      const availableSlots = slots?.slots?.filter((slot) => slot.slotId === id)
      console.log("availSlots:", availableSlots)
      setData((prevEntries) => {
        return prevEntries.map((prevEntry) => {
            if (prevEntry.id  === slots.id) {
                return {
                    ...prevEntry,
                    slots: updateSlot(prevEntry.slots, availableSlots[0].isAvailable = true)
                }
            }
            return prevEntry;
        })
       })
    }

    return(
        <>
       <form onSubmit={handleSubmit(submitForm)}>
        <Stack spacing={3} sx={{ mt: '2rem' }}>
            <Typography variant="h4" >Select Vehicle Type</Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
            <Item>
                <label htmlFor="small-car">
                    <input
                        {...register("carType", { required: true })}
                        type="radio"
                        value="small"
                        id="small-car"
                    />
                    SMALL
                </label>
            </Item>
            <Item>
                <label htmlFor="medium-car">
                    <input
                        {...register("carType")}
                        type="radio"
                        value="medium"
                        id="medium-car"
                        />
                    MEDIUM
                </label>

            </Item>
            <Item>
                <label htmlFor="large-car">
                    <input
                        {...register("carType")}
                        type="radio"
                        value="large"
                        id="large-car"
                        />
                    LARGE
                </label>

            </Item>
            </Stack>
                <div style={{ color: 'red' }}>{errors.carType && "Vehicle Type is Required"}</div>
           
            <Stack direction="row" justifyContent="center">
              <MuiButton type="submit" variant="contained" sx={{ m: '1rem' }}>GET PARKING SLOT</MuiButton>
            </Stack>
        </Stack>
       </form>
       <Stack justifyContent="center">
          {
            data?.map((entrypoint, index) => (
             <div key={index}>
               <h3 key={index}>Entry Point {entrypoint.id}</h3>
               <Stack direction="row" justifyContent="center" >
                {
                    entrypoint?.slots.map((slot, index) => (
                        
                        <Box onClick={() => handleExit(slot.slotId)} key={index} sx={{ cursor: "pointer", width: '4rem', height: '4rem',  display: "flex", alignItems: "center", justifyContent: 'center', m: 1, backgroundColor: slot.isAvailable ? "green" : "red"  }}>
                          <Stack>
                            <Typography>{slot.slotId}</Typography>
                            <Typography>{slot.type}</Typography>
                          </Stack>
                        </Box>
                    ))
                }
               </Stack>
             </div>    
            ))
          }
       </Stack>
      </>
    );
}

export default VehicleEntry;