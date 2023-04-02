import { forwardRef, useEffect, useRef } from 'react';
export default forwardRef(function Checkbox(
    { type = 'checkbox', name, id, value,checked, isFocused, handleChange },
    ref
){
    const checkbox = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);
    return (
        <input
            type={type}
            name={name}
            id={id}
            checked={checked}
            value={value}
            ref={checkbox}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
            onChange={(e) => handleChange(e)}
        />
    );
});
