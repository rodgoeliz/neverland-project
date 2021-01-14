import React from 'react'

// import { Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';

import NSelect from "components/UI/NSelect";

/* eslint-disable */
export default function CustomRefinementList({ items, refine }) {
    const handleChange = (selectedFilters) => {
      if (selectedFilters && selectedFilters.length > 0) {
        refine(selectedFilters[0].label);
      } else if (selectedFilters && selectedFilters.length == 0) {
        refine();
      }
    }

    const getLastItemValue = (item) => {
        if (item.value?.length) {
            // After first call of select change 
            // algolia updates items array and provides selected + basic value in item.values array.
            // This logic was made for checkbox scenario
            // TODO: fix issue with displaying data while valie is item.value.length - 1, but item.value[0]
            return item.value[item.value.length - 1];
        }
    }
    console.log("refinement itesm: ", items)
   return <NSelect 
            items={items}
            itemIdKey="label"
            itemTitleKey="label"
            isSingleSelect
            onChangeItems={handleChange}
            title="Status" />

    /*return (
        <FormControl>
            <InputLabel shrink id="refinements-label-id">
                Status
            </InputLabel>
            <Select
                labelId="refinements-label-id"
                id="refinements-label-id"
                onChange={handleChange}
            >
                {items.map((item, index) => (
                    <MenuItem key={index} value={getLastItemValue(item)}>{item.label}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )*/
}
