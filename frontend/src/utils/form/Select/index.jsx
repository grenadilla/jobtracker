import React, { useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import clsx from 'clsx';

// import ReactSelect from 'react-select';
import WindowedSelect from 'react-windowed-select';

import ErrorMessage from '../ErrorMessage';
import { Form } from 'react-bootstrap';

// Modified from https://github.com/JedWatson/react-select/issues/3067

const customFilterOption = (option, rawInput) => {
  if (String(option.label).toLowerCase() === 'other') {
    return true;
  }

  const words = rawInput.split(' ');
  return words.reduce(
    (acc, cur) => acc && String(option.label).toLowerCase().includes(String(cur).toLowerCase()),
    true,
  );
};

const Select = ({ name, options = [], isMulti = false, className, ...props }) => {
  const { control } = useFormContext();
  const { field: { onChange, onBlur, value, ref } } = useController({ name, control });
  const [isFocused, setIsFocused] = useState(false);

  const getValue = () => {
    if (isMulti) {
      if (value === undefined || value === null) {
        return [];
      }
      return options.filter((option) => value.includes(option.value));
    }
    return options.find((option) => value === option.value);
  };

  const handleChange = (selected) => {
    if (Array.isArray(selected)) {
      const newValues = selected ? selected.map((option) => option.value) : [];
      onChange(newValues);
    } else {
      const newValue = selected ? selected.value : undefined;
      onChange(newValue);
    }
  };

  return (
    <Form.Group>
      <WindowedSelect
        name={name}
        ref={ref}
        // hide value when menu is open so placeholder can be seen (unless it's a multiselect)
        value={(isFocused && !isMulti) ? '' : getValue()}
        onChange={handleChange}
        onBlur={() => { setIsFocused(false); onBlur(); }}
        onFocus={() => setIsFocused(true)}
        className={clsx(className)}
        options={options}
        isMulti={isMulti}
        blurInputOnSelect={!isMulti}
        closeMenuOnSelect={!isMulti}
        menuPlacement="auto"
        filterOption={customFilterOption}
        isClearable
        {...props}
      />

      <ErrorMessage name={name} />
    </Form.Group>
  );
};

export default Select;
