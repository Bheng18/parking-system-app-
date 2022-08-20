import Typography from "@mui/material/Typography";
import Stack  from "@mui/material/Stack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import MuiButton from "../../components/button";
// import FullParking from "../full-parking";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import moment, { min } from "moment";
import produce from "immer";
import Snackbar from "../../components/snackbar";


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  const vehiclesType = [
    {
     type: 'SP',
     succeeding: 20,
    },
   {
     type: 'MP',
     succeeding: 60,
    },
   {
     type: 'LP',
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
        dateTime: "18/06/2022",
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
  },
  {
    id: 3,
    slots: [
      {
        slotId: 1, 
        isAvailable: true,
        dateTime: null,
        type: "SP",
      },
      {
        slotId: 2, 
        isAvailable: false,
        dateTime: null,
        type: "SP",
      },
      {
        slotId: 3, 
        isAvailable: true,
        dateTime: null,
        type: "MP",
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

const paymentObj = {
  flatRate: 40,
  datePark: null,
  dateUnPark: null, 
  succeedingHours: null,
  totalParkHours: null,
  totalAmountCharge: null,
  succeedingFee: null
}

const VehicleEntry = () => {
  const log = console.log.bind(document);
  const [paymentState, setPaymentState] = useState(paymentObj);
  const [snackState, setSnackState] = useState({
    open: false,
  });
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const [data, setData] = useState(initialData);
    const {  open } = snackState;
    
  
    const handleClose = () => {
      setSnackState({ ...snackState, open: false });
    };

    const submitForm = (data) => {
        getParkingSlot(data.carType, parseInt(data.entrance));
    }

    const updateSlot = (slots, newSlot, vehicleType) => {
      const slot = produce(slots, draft => {
        const newParkingSlot = draft.find(todo => todo.slotId === newSlot.slotId); // get index value
        const index = draft.findIndex(todo => todo.slotId === newSlot.slotId); // get index
        if(index !== -1) {
          draft[index].isAvailable = !newParkingSlot.isAvailable;
          draft[index].dateTime = moment(new Date()).unix();
          draft[index].type = vehicleType;
        } 
      })
      return slot;
      // return slots.map((slot => {
      //       if (slot.slotId === newSlot.slotId) {
      //           return {
      //               ...slot,
      //               isAvailable: !slot.isAvailable,
      //               dateTime: moment(new Date()).unix(),
      //               type: vehicleType
      //           }
      //       }
      //       return slot;
      //   }))
    }

    const checkIf_MP_available = (slotsArray, MPvalue) => {
      console.log('slot array:', slotsArray)
      console.log(' MP-Value: ', MPvalue)
      return slotsArray.some((slotArr) => slotArr.type === MPvalue);
    }

    const getParkingSlot = (vehicleType, entrypoint) => {
     
      let slots = [];
       const entry = data?.find(entry => entry.id === entrypoint);
       const allSlots = entry.slots.filter((slot) => slot.isAvailable);
       
       //check for slot availablity and if vehicle type match to parking slot

       // get medium and large slot [ MP, LP]
       const mediumSlots = allSlots.filter(mediumSlot => mediumSlot.type !== "SP");

       // get only medium slot [MP]
       const getMediumSlots = allSlots.filter(mediumSlot => mediumSlot.type === "MP");

       // check if there is MP type [return true or false]
       const isMediumSlot = checkIf_MP_available(mediumSlots, vehicleType);

       //get only large slot
       const largeSlots = allSlots.filter((slot) =>  slot.type !== "SP" && slot.type !== "MP");
       log("medium slots:", mediumSlots)
       log("get medium:", isMediumSlot)
      if(vehicleType === "SP"){
       slots = allSlots;
      }else if(vehicleType === "MP"){
        if(isMediumSlot){ // check if medium slot is available, if not goto large slot
          slots = getMediumSlots // [MP only]
        } else{
          slots = mediumSlots; // [MP, LP]
        }
      }else{
        slots = largeSlots;
      }

      // check if no available slot, return alert message
       if (!slots.length) {
        let type = "";
        if(vehicleType === "SP"){
          type = "Small Parking"
         }else if(vehicleType === "MP"){
          type = "Medium Parking"
         }else{
          type = "Large Parking"
         }
        alert(`no slots avaiable for ${type} in this Entrance ${entrypoint}`);
        return;
       }
       setData((prevEntries) => {
        return prevEntries.map((prevEntry) => {
            if (prevEntry.id  === entry.id) {
                return {
                    ...prevEntry,
                    slots: updateSlot(prevEntry.slots, slots[0], vehicleType)
                }
            }
            return prevEntry;
        })
       })
    }


    const handleExit = (parkingSlotId, entrypointId, vehicleType) => {
      log(`vehicle type - Parking SLot ID:, ${vehicleType} - ${parkingSlotId}`)
      let flatRate = 40;
      let getSucceedingFee = null;
      let succeedingHours = null;
      let totalAmountOfSuccedingHours = null;
    
      // get record in the prevoius data date of entry
    const currentSlot = data?.find(entry => entry.id === entrypointId).slots.find(slot => slot.slotId === parkingSlotId);
    const entryDate = moment.unix(currentSlot.dateTime);
    // console.log("currentSlot:", moment.unix(currentSlot.dateTime).format("DD-MM-YYYY"));
    // let dateUnpark = moment().add(1, "days");
    let dateUnpark = moment().add(5, "hours");
    // const entryDate = new Date(Number(currentSlot.dateTime) * 1000) // date of entry
    
      // minus current date from dateOfEntry
      const totalParkHours = dateUnpark.diff(entryDate, 'hours');
      // log('total park hours - ', totalParkHours);
// getExceedHours => if (hours > 3) 
      if(totalParkHours > 3){
         getSucceedingFee = vehiclesType.find(vehicle => vehicle.type === vehicleType).succeeding;
        succeedingHours = totalParkHours - 3; // 1hr
      // check if hours exceed => flatRate + (hoursExceed x vehicle type size)
        totalAmountOfSuccedingHours = (succeedingHours * getSucceedingFee) + flatRate;
        
        // log(`First Flat Rate = 40, Succeeding Hours = ${succeedingHours}, Total of = ${totalAmountOfSuccedingHours}`)
        setPaymentState(produce(draft => {
          draft.flatRate = flatRate;
          draft.datePark = entryDate;
          draft.dateUnPark = dateUnpark;
          draft.totalParkHours = totalParkHours;
          draft.succeedingFee = getSucceedingFee;
          draft.succeedingHours = succeedingHours;
          draft.totalAmountCharge = totalAmountOfSuccedingHours;
        }));
      }else {
      // check hours if not exceed => flatRate = 40pesos
        setPaymentState(produce(draft => {
          draft.flatRate = flatRate;
          draft.datePark = entryDate;
          draft.dateUnPark = dateUnpark;
          draft.totalParkHours = totalParkHours;
          draft.succeedingFee = getSucceedingFee;
          draft.succeedingHours = succeedingHours;
          draft.totalAmountCharge = totalAmountOfSuccedingHours;
        }));
      }

      const entryPoint = data?.find(entry => entry.id === entrypointId); 
      const availableSlots = entryPoint?.slots?.filter((slot) => slot.slotId === parkingSlotId)
      if(!availableSlots[0].isAvailable){
      setSnackState({ open: true })
        setData(produce(draft => {
          const entries = draft.find(entry => entry.id === entryPoint.id)
          const index = draft.findIndex(entry => entry.id === entryPoint.id)
          if(index !== -1){
            draft[index].slots = updateSlot(entries.slots, availableSlots[0], vehicleType)
          }
        })); //   same codes commented below
      }

    //   setData((prevEntries) => {
    //     return prevEntries.map((prevEntry) => {
    //         if (prevEntry.id  === slots.id) {
    //             return {
    //                 ...prevEntry,
    //                 slots: updateSlot(prevEntry.slots, availableSlots[0], vehicleType)
    //             }
    //         }
    //         return prevEntry;
    //     })
    //    })
    // }
    }
    return(
        <>
        <Snackbar handleClose={handleClose} open={open} paymentState={paymentState} />

       <form onSubmit={handleSubmit(submitForm)}>
        <Stack spacing={3} sx={{ mt: '2rem' }}>
            <Typography variant="h4" >Select Vehicle Type</Typography>
            <Stack direction="row" spacing={0} justifyContent="center">
              <Item>
                  <label htmlFor="small-car">
                      <input
                          {...register("carType", { required: true })}
                          type="radio"
                          value="SP"
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
                          value="MP"
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
                          value="LP"
                          id="large-car"
                          />
                      LARGE
                  </label>

              </Item>
            </Stack>
                <div style={{ color: 'red' }}>{errors.carType && "Vehicle Type is Required"}</div>
           
              <Stack>
                <Typography>SELECT ENTRANCE NUMBER</Typography>
              </Stack>
          <Stack direction="row" spacing={2} justifyContent="center">
              <Item>
                  <label htmlFor="entrance1">
                      <input
                          {...register("entrance", { required: true })}
                          type="radio"
                          value="1"
                          id="entrance1"
                      />
                     Entrance 1
                  </label>
              </Item>
              <Item>
                  <label htmlFor="entrance2">
                      <input
                          {...register("entrance")}
                          type="radio"
                          value="2"
                          id="entrance2"
                          />
                      Entrance 2
                  </label>

              </Item>
              <Item>
                  <label htmlFor="entrance3">
                      <input
                          {...register("entrance")}
                          type="radio"
                          value="3"
                          id="entrance3"
                          />
                      Entrance 3
                  </label>

              </Item>
            </Stack>
                <div style={{ color: 'red' }}>{errors.entrance && "Entrance # is Required"}</div>

            <Stack direction="row" justifyContent="center">
              <MuiButton type="submit" variant="contained" sx={{ m: '1rem' }}>GET PARKING SLOT</MuiButton>
            </Stack>
        </Stack>
       </form>
       <Stack direction="row" justifyContent="space-around">
          {
            data?.map((entrypoint, index) => (
             <div key={index}>
               <Stack><h3 key={index}>Entry Point {entrypoint.id}</h3></Stack>
               
               <Stack >
                {
                    entrypoint?.slots.map((slot, index) => (
                        
                        <Box onClick={() => handleExit(slot.slotId, entrypoint.id, slot.type)} key={index} sx={{ p: "0.5rem", cursor: "pointer", width: '5rem', height: '4rem',  display: "flex", alignItems: "center", justifyContent: 'center', m: 1, backgroundColor: slot.isAvailable ? "green" : "red"  }}>
                          <Stack>
                            <Typography >SLOT# {slot.slotId}</Typography>
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
