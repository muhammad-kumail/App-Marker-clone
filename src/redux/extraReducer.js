import {createSlice} from '@reduxjs/toolkit';

const MapSlice = createSlice({
  name: 'Map',
  initialState: {
    markerNames: [],
  },
  reducers: {
    setMarkerNames: (state, action) => {
      state.markerNames = action.payload;
    },
  },
});

export const {setMarkerNames} = MapSlice.actions;
export default MapSlice.reducer;
